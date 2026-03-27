# 📜 Scripts Directory

Thư mục này chứa các scripts hỗ trợ deployment và quản lý hệ thống.

## 📋 Danh Sách Scripts

### 🔧 `setup-vps.sh`

**Mục đích**: Setup VPS lần đầu tiên với tất cả dependencies cần thiết.

**Sử dụng**:
```bash
# Trên VPS
chmod +x scripts/setup-vps.sh
./scripts/setup-vps.sh
```

**Script này sẽ**:
- Cài đặt Docker và Docker Compose
- Cài đặt các tools cần thiết (git, curl, vim, htop)
- Cấu hình firewall (UFW)
- Tạo thư mục ~/app
- Tạo template .env
- Setup log rotation cho Docker containers

**Yêu cầu**:
- Ubuntu/Debian VPS
- Sudo privileges

---

### 🚀 `deploy.sh`

**Mục đích**: Deploy thủ công lên VPS (không qua GitHub Actions).

**Sử dụng**:
```bash
# Trên VPS
cd ~/app
./deploy.sh
```

**Script này sẽ**:
- Pull latest Docker images từ GHCR
- Stop containers cũ
- Start containers mới
- Kiểm tra health status
- Cleanup old images
- Hiển thị logs

**Yêu cầu**:
- File `.env` đã được cấu hình
- Docker và Docker Compose đã được cài đặt
- Đã login vào GHCR (`docker login ghcr.io`)

---

## 🔐 Permissions

Đảm bảo scripts có quyền execute:

```bash
chmod +x scripts/*.sh
```

---

## 📝 Notes

- Các scripts này được thiết kế cho Ubuntu/Debian
- Đọc kỹ nội dung script trước khi chạy
- Backup dữ liệu quan trọng trước khi chạy scripts
- Xem file `CICD-SETUP.md` ở root directory để biết hướng dẫn chi tiết

---

## 🆘 Troubleshooting

### Script không chạy được

```bash
# Kiểm tra permissions
ls -la scripts/

# Set execute permission
chmod +x scripts/setup-vps.sh
chmod +x scripts/deploy.sh

# Chạy với bash explicitly
bash scripts/setup-vps.sh
```

### Line ending issues (Windows → Linux)

```bash
# Convert line endings nếu script được tạo trên Windows
sed -i 's/\r$//' scripts/*.sh
```
