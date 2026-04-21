#!/usr/bin/env python3
"""
Docker Swarm Auto-scaler — dựa trên Prometheus CPU metrics.

Cron job (chạy mỗi 2 phút):
  */2 * * * * /usr/bin/python3 /opt/scripts/autoscaler.py >> /var/log/autoscaler.log 2>&1

Yêu cầu:
  pip3 install requests --break-system-packages
"""

import fcntl
import logging
import subprocess
import sys
import time

import requests

# ================================================================
# CẤU HÌNH — Chỉnh sửa các giá trị này theo nhu cầu thực tế
# ================================================================
CONFIG = {
    # URL Prometheus trong Docker Swarm network
    "prometheus_url": "http://prometheus:9090",

    # Tên service cần scale (format: <stack_name>_<service_name>)
    "service_name": "mystack_backend",

    # Giới hạn số replica
    "min_replicas": 2,      # Luôn giữ tối thiểu 2 để HA
    "max_replicas": 8,      # Không scale quá 8 (tránh quá tải DB)

    # Ngưỡng CPU để ra quyết định scale
    "scale_up_cpu_threshold": 70,    # Scale UP khi CPU trung bình > 70%
    "scale_down_cpu_threshold": 30,  # Scale DOWN khi CPU trung bình < 30%

    # Cooldown: không scale liên tục, chờ ít nhất 2 phút giữa 2 lần scale
    "cooldown_seconds": 120,
    "cooldown_file": "/tmp/autoscaler_last_action",

    # Lock file: ngăn 2 instance script chạy đồng thời
    "lock_file": "/tmp/autoscaler.lock",

    # Timeout khi gọi Prometheus API
    "prometheus_timeout": 10,
}

# ================================================================
# LOGGING
# ================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [AUTOSCALER] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
log = logging.getLogger(__name__)


# ================================================================
# FUNCTIONS
# ================================================================

def get_avg_cpu_percent() -> float:
    """
    Lấy CPU% trung bình của tất cả replica backend từ Prometheus.
    Trả về -1.0 nếu không lấy được (sẽ bỏ qua lần chạy đó).
    """
    query = (
        'avg(rate(container_cpu_usage_seconds_total'
        '{container_label_com_docker_swarm_service_name=~".*backend.*"}[2m]))'
        ' * 100'
    )
    try:
        resp = requests.get(
            f"{CONFIG['prometheus_url']}/api/v1/query",
            params={"query": query},
            timeout=CONFIG["prometheus_timeout"],
        )
        resp.raise_for_status()

        data = resp.json()
        results = data.get("data", {}).get("result", [])

        if not results:
            log.warning("Prometheus trả về kết quả rỗng — không có container backend nào đang chạy?")
            return -1.0

        cpu = float(results[0]["value"][1])
        return cpu

    except requests.exceptions.ConnectionError:
        log.error("Không kết nối được Prometheus. Kiểm tra monitoring stack có đang chạy không.")
        return -1.0
    except Exception as exc:
        log.error(f"Lỗi khi query Prometheus: {exc}")
        return -1.0


def get_current_replicas() -> int:
    """
    Lấy số replica hiện tại của service từ Docker.
    Trả về -1 nếu service không tồn tại hoặc có lỗi.
    """
    try:
        result = subprocess.run(
            [
                "docker", "service", "inspect",
                CONFIG["service_name"],
                "--format", "{{.Spec.Mode.Replicated.Replicas}}",
            ],
            capture_output=True,
            text=True,
            check=True,
            timeout=10,
        )
        return int(result.stdout.strip())

    except subprocess.CalledProcessError:
        log.error(f"Service '{CONFIG['service_name']}' không tồn tại.")
        return -1
    except Exception as exc:
        log.error(f"Lỗi khi lấy số replica: {exc}")
        return -1


def scale_service(new_replicas: int) -> bool:
    """
    Scale service đến số replica mới.
    Ghi timestamp vào cooldown file sau khi scale thành công.
    """
    try:
        subprocess.run(
            ["docker", "service", "scale",
             f"{CONFIG['service_name']}={new_replicas}"],
            check=True,
            capture_output=True,
            timeout=30,
        )

        # Ghi thời điểm scale để cooldown check
        with open(CONFIG["cooldown_file"], "w") as f:
            f.write(str(time.time()))

        return True

    except subprocess.CalledProcessError as exc:
        log.error(f"Lỗi khi scale: {exc.stderr.decode().strip()}")
        return False
    except Exception as exc:
        log.error(f"Lỗi không xác định khi scale: {exc}")
        return False


def is_in_cooldown() -> bool:
    """
    Kiểm tra có đang trong thời gian cooldown không.
    Trả về True nếu chưa đủ thời gian chờ kể từ lần scale trước.
    """
    try:
        with open(CONFIG["cooldown_file"], "r") as f:
            last_action_time = float(f.read().strip())

        elapsed = time.time() - last_action_time
        remaining = CONFIG["cooldown_seconds"] - elapsed

        if remaining > 0:
            log.info(f"Đang trong cooldown. Còn {remaining:.0f}s trước khi có thể scale tiếp.")
            return True

    except FileNotFoundError:
        pass
    except Exception as exc:
        log.warning(f"Không đọc được cooldown file: {exc}. Tiếp tục bình thường.")

    return False


# ================================================================
# MAIN
# ================================================================

def main():
    log.info("=== Autoscaler bắt đầu chạy ===")

    # ---- Bước 1: Acquire lock để tránh race condition ----
    lock_file_handle = open(CONFIG["lock_file"], "w")
    try:
        fcntl.flock(lock_file_handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        log.info("Instance khác đang chạy (lock file bị giữ). Thoát.")
        lock_file_handle.close()
        sys.exit(0)

    try:
        # ---- Bước 2: Kiểm tra cooldown ----
        if is_in_cooldown():
            return

        # ---- Bước 3: Lấy metrics ----
        cpu = get_avg_cpu_percent()
        if cpu < 0:
            log.warning("Không lấy được CPU metrics. Bỏ qua lần này.")
            return

        current_replicas = get_current_replicas()
        if current_replicas < 0:
            return

        log.info(
            f"CPU trung bình: {cpu:.1f}% | "
            f"Replicas hiện tại: {current_replicas} | "
            f"Giới hạn: [{CONFIG['min_replicas']}, {CONFIG['max_replicas']}]"
        )

        # ---- Bước 4: Ra quyết định scale ----
        if cpu > CONFIG["scale_up_cpu_threshold"]:
            if current_replicas < CONFIG["max_replicas"]:
                new_count = min(current_replicas + 1, CONFIG["max_replicas"])
                log.info(
                    f"CPU {cpu:.1f}% > ngưỡng {CONFIG['scale_up_cpu_threshold']}% "
                    f"→ SCALE UP: {current_replicas} → {new_count}"
                )
                if scale_service(new_count):
                    log.info(f"Scale UP thành công. Replicas mới: {new_count}")
                else:
                    log.error("Scale UP thất bại!")
            else:
                log.warning(
                    f"CPU cao ({cpu:.1f}%) nhưng đã đạt max replicas "
                    f"({CONFIG['max_replicas']}). Không thể scale thêm."
                )

        elif cpu < CONFIG["scale_down_cpu_threshold"]:
            if current_replicas > CONFIG["min_replicas"]:
                new_count = max(current_replicas - 1, CONFIG["min_replicas"])
                log.info(
                    f"CPU {cpu:.1f}% < ngưỡng {CONFIG['scale_down_cpu_threshold']}% "
                    f"→ SCALE DOWN: {current_replicas} → {new_count}"
                )
                if scale_service(new_count):
                    log.info(f"Scale DOWN thành công. Replicas mới: {new_count}")
                else:
                    log.error("Scale DOWN thất bại!")
            else:
                log.info(
                    f"CPU thấp ({cpu:.1f}%) nhưng đã ở min replicas "
                    f"({CONFIG['min_replicas']}). Không scale xuống thêm."
                )

        else:
            log.info(
                f"CPU ổn định ({cpu:.1f}%) trong ngưỡng "
                f"[{CONFIG['scale_down_cpu_threshold']}%-{CONFIG['scale_up_cpu_threshold']}%]. "
                f"Không cần scale."
            )

    finally:
        fcntl.flock(lock_file_handle, fcntl.LOCK_UN)
        lock_file_handle.close()
        log.info("=== Autoscaler kết thúc ===")


if __name__ == "__main__":
    main()
