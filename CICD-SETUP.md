# 🚀 Hướng Dẫn Setup CI/CD với GitHub Actions, Docker Registry và VPS

## 📋 Tổng Quan

Hệ thống CI/CD này tự động hóa quy trình:
1. **CI (Continuous Integration)**: Test và build code khi có commit mới
2. **Build & Push**: Build Docker images và push lên GitHub Container Registry (GHCR)
3. **CD (Continuous Deployment)**: Tự động deploy lên VPS khi push vào branch `main`

## 🏗️ Kiến Trúc

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐      ┌─────────┐
│   GitHub    │─────▶│ GitHub Actions   │─────▶│      GHCR       │─────▶│   VPS   │
│  Repository │      │  (CI/CD Runner)  │      │ (Docker Images) │      │ Server  │
└─────────────┘      └──────────────────┘      └─────────────────┘      └─────────┘
                             │
                             ├─ Test Backend (Maven)
                             ├─ Test Frontend (npm)
                             ├─ Build Docker Images
                             └─ Deploy via SSH
```

## 📦 Các File Quan Trọng

```
NextJS/
├── .github/workflows/
│   └── main.yml                    # GitHub Actions workflow
├── scripts/
│   ├── setup-vps.sh               # Script setup VPS lần đầu
│   └── deploy.sh                  # Script deploy thủ công
├── docker-compose.yml             # Development (build local)
├── docker-compose.prod.yml        # Production (pull từ registry)
├── .env.example                   # Template cho environment variables
└── CICD-SETUP.md                  # File này
```

---

## 🔧 BƯỚC 1: Setup VPS

### 1.1. Kết nối vào VPS

```bash
ssh your-user@your-vps-ip
```

### 1.2. Chạy script setup

```bash
# Download và chạy script setup
curl -fsSL https://raw.githubusercontent.com/your-username/your-repo/main/scripts/setup-vps.sh -o setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

Hoặc nếu đã clone repo:

```bash
cd ~/
git clone https://github.com/your-username/your-repo.git
cd your-repo


```

### 1.3. Tạo SSH Key cho GitHub Actions

```bash
# Tạo SSH key mới
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Thêm public key vào authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Set permissions
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Copy private key (sẽ dùng cho GitHub Secrets)
cat ~/.ssh/github_actions
```

**⚠️ Lưu ý**: Copy toàn bộ nội dung private key (bao gồm cả `-----BEGIN OPENSSH PRIVATE KEY-----` và `-----END OPENSSH PRIVATE KEY-----`)

### 1.4. Tạo file .env trên VPS

```bash
cd ~/app
cp .env.template .env
nano .env  # Hoặc vim .env
```

Điền các thông tin cần thiết vào file `.env`:

```env
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=next_ecommerce
MYSQL_USER=springstudent
MYSQL_PASSWORD=your_mysql_password

JWT_SECRET=your_jwt_secret_at_least_256_bits
JWT_EXPIRATION=360000000

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

VNPAY_RETURN_URL=https://yourdomain.com/en/user/orders
PAYPAL_RETURN_URL=https://yourdomain.com/en/user/orders
PAYPAL_CANCEL_URL=https://yourdomain.com/en/user/orders
```

---

## 🔐 BƯỚC 2: Cấu Hình GitHub Secrets

Vào repository trên GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 2.1. Secrets Bắt Buộc

| Secret Name | Mô Tả | Ví Dụ |
|------------|-------|-------|
| `DEPLOY_HOST` | IP hoặc domain của VPS | `123.45.67.89` |
| `DEPLOY_USER` | Username SSH | `root` hoặc `ubuntu` |
| `DEPLOY_SSH_KEY` | Private SSH key từ bước 1.3 | Nội dung file `~/.ssh/github_actions` |

### 2.2. Secrets Cho Application

| Secret Name | Mô Tả |
|------------|-------|
| `MYSQL_ROOT_PASSWORD` | Password root MySQL |
| `MYSQL_DATABASE` | Tên database (mặc định: `next_ecommerce`) |
| `MYSQL_USER` | MySQL user (mặc định: `springstudent`) |
| `MYSQL_PASSWORD` | Password MySQL user |
| `JWT_SECRET` | Secret key cho JWT (ít nhất 256 bits) |
| `JWT_EXPIRATION` | Thời gian expire JWT (ms) |
| `MAIL_USERNAME` | Email gửi mail |
| `MAIL_PASSWORD` | App password của email |
| `NEXT_PUBLIC_API_URL` | URL API backend (VD: `https://api.yourdomain.com/api`) |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal Client ID |
| `VNPAY_RETURN_URL` | URL return VNPay |
| `PAYPAL_RETURN_URL` | URL return PayPal |
| `PAYPAL_CANCEL_URL` | URL cancel PayPal |

### 2.3. Cách Thêm Secret

1. Vào **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Nhập **Name** và **Value**
4. Click **Add secret**

---

## 🔄 BƯỚC 3: Cấu Hình GitHub Container Registry (GHCR)

### 3.1. Enable GitHub Packages

1. Vào repository settings
2. Scroll xuống **Features**
3. Đảm bảo **Packages** được enable

### 3.2. Cập Nhật Image Names

Mở file `.github/workflows/main.yml` và cập nhật:

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_BACKEND: your-github-username/next-ecommerce-backend  # Thay your-github-username
  IMAGE_FRONTEND: your-github-username/next-ecommerce-frontend
```

Mở file `docker-compose.prod.yml` và cập nhật:

```yaml
backend:
  image: ${BACKEND_IMAGE:-ghcr.io/your-github-username/next-ecommerce-backend:latest}

frontend:
  image: ${FRONTEND_IMAGE:-ghcr.io/your-github-username/next-ecommerce-frontend:latest}
```

### 3.3. Set Package Visibility (Optional)

Sau lần build đầu tiên, vào:
- https://github.com/your-username?tab=packages
- Click vào package → **Package settings**
- Chọn **Change visibility** → **Public** (nếu muốn public)

---

## 🚀 BƯỚC 4: Test CI/CD Pipeline

### 4.1. Trigger Workflow

```bash
# Commit và push code
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

### 4.2. Theo Dõi Workflow

1. Vào repository trên GitHub
2. Click tab **Actions**
3. Xem workflow đang chạy
4. Click vào workflow để xem chi tiết từng job

### 4.3. Kiểm Tra Logs

**Trên GitHub Actions:**
- Xem logs của từng step trong workflow

**Trên VPS:**
```bash
cd ~/app
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🔍 BƯỚC 5: Verify Deployment

### 5.1. Kiểm Tra Containers

```bash
ssh your-user@your-vps-ip
cd ~/app
docker compose -f docker-compose.prod.yml ps
```

Output mong đợi:
```
NAME                IMAGE                                              STATUS
mysql-server        mysql:8.0                                          Up (healthy)
redis-server        redis:7-alpine                                     Up (healthy)
spring-backend      ghcr.io/your-username/next-ecommerce-backend       Up
nextjs-frontend     ghcr.io/your-username/next-ecommerce-frontend      Up
```

### 5.2. Test Endpoints

```bash
# Test backend
curl http://your-vps-ip:5000/api/health

# Test frontend
curl http://your-vps-ip:3000
```

### 5.3. Xem Logs

```bash
# Xem logs tất cả services
docker compose -f docker-compose.prod.yml logs

# Xem logs real-time
docker compose -f docker-compose.prod.yml logs -f

# Xem logs của service cụ thể
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend
```

---

## 🛠️ Workflow Chi Tiết

### CI/CD Pipeline Stages

```
1. CI Backend (Maven)
   ├── Checkout code
   ├── Setup Java 17
   ├── Run tests với MySQL & Redis
   └── Upload test reports

2. CI Frontend (Node.js)
   ├── Checkout code
   ├── Setup Node.js 20
   ├── Install dependencies
   ├── Run linter
   └── Build Next.js

3. Docker Build & Push
   ├── Login to GHCR
   ├── Build backend image
   ├── Push backend image
   ├── Build frontend image
   └── Push frontend image

4. Deploy to VPS
   ├── Copy docker-compose.prod.yml
   ├── Create .env file
   ├── Login to GHCR on VPS
   ├── Pull latest images
   ├── Start containers
   └── Cleanup old images
```

### Trigger Conditions

- **Push to `main` branch**: Chạy full pipeline (CI → Build → Deploy)
- **Pull Request**: Chỉ chạy CI (test và build, không deploy)
- **Manual trigger**: Có thể trigger thủ công từ GitHub Actions tab

---

## 🔧 Troubleshooting

### Lỗi: "Permission denied (publickey)"

**Nguyên nhân**: SSH key không đúng hoặc chưa được thêm vào VPS

**Giải pháp**:
```bash
# Trên VPS, kiểm tra authorized_keys
cat ~/.ssh/authorized_keys

# Đảm bảo public key của github_actions có trong file này
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Set đúng permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Lỗi: "Cannot connect to Docker daemon"

**Nguyên nhân**: User chưa có quyền chạy Docker

**Giải pháp**:
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER

# Log out và log in lại
exit
ssh your-user@your-vps-ip

# Test Docker
docker ps
```

### Lỗi: "Failed to pull image"

**Nguyên nhân**: Chưa login vào GHCR hoặc image không tồn tại

**Giải pháp**:
```bash
# Login vào GHCR trên VPS
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u your-username --password-stdin

# Kiểm tra image có tồn tại không
docker pull ghcr.io/your-username/next-ecommerce-backend:latest
```

### Lỗi: "Container unhealthy"

**Nguyên nhân**: Service không start được hoặc healthcheck fail

**Giải pháp**:
```bash
# Xem logs chi tiết
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs mysql

# Kiểm tra environment variables
docker compose -f docker-compose.prod.yml config

# Restart service
docker compose -f docker-compose.prod.yml restart backend
```

### Lỗi: "Port already in use"

**Nguyên nhân**: Port đã được sử dụng bởi process khác

**Giải pháp**:
```bash
# Kiểm tra port đang được sử dụng
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :5000

# Stop container cũ
docker compose -f docker-compose.prod.yml down

# Hoặc kill process đang dùng port
sudo kill -9 <PID>
```

---

## 📝 Deploy Thủ Công (Manual Deploy)

Nếu cần deploy thủ công mà không qua GitHub Actions:

### Trên Local Machine

```bash
# Build và push images
docker login ghcr.io -u your-username
docker build -t ghcr.io/your-username/next-ecommerce-backend:latest ./back-end
docker build -t ghcr.io/your-username/next-ecommerce-frontend:latest ./front-end
docker push ghcr.io/your-username/next-ecommerce-backend:latest
docker push ghcr.io/your-username/next-ecommerce-frontend:latest
```

### Trên VPS

```bash
cd ~/app
./deploy.sh  # Hoặc chạy các lệnh trong script
```

---

## 🔄 Rollback

Nếu deployment mới có vấn đề, rollback về version cũ:

```bash
# Trên VPS
cd ~/app

# Pull image với tag cũ (thay <commit-sha> bằng commit hash cũ)
docker pull ghcr.io/your-username/next-ecommerce-backend:sha-<commit-sha>
docker pull ghcr.io/your-username/next-ecommerce-frontend:sha-<commit-sha>

# Update .env với image tags cũ
nano .env
# BACKEND_IMAGE=ghcr.io/your-username/next-ecommerce-backend:sha-<commit-sha>
# FRONTEND_IMAGE=ghcr.io/your-username/next-ecommerce-frontend:sha-<commit-sha>

# Restart với images cũ
docker compose -f docker-compose.prod.yml up -d
```

---

## 🎯 Best Practices

### 1. Security

- ✅ Không commit file `.env` vào git
- ✅ Sử dụng strong passwords cho database
- ✅ Rotate SSH keys định kỳ
- ✅ Enable firewall trên VPS
- ✅ Sử dụng HTTPS với SSL certificate (Let's Encrypt)

### 2. Monitoring

```bash
# Setup monitoring với Docker stats
docker stats

# Setup log monitoring
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Setup disk space monitoring
df -h
docker system df
```

### 3. Backup

```bash
# Backup MySQL data
docker exec mysql-server mysqldump -u root -p next_ecommerce > backup.sql

# Backup volumes
docker run --rm -v mysql-data:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz /data
```

### 4. Performance

- ✅ Sử dụng Docker layer caching trong GitHub Actions
- ✅ Enable BuildKit cho faster builds
- ✅ Sử dụng multi-stage builds trong Dockerfile
- ✅ Cleanup unused images và containers định kỳ

---

## 📚 Tài Liệu Tham Khảo

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## 🆘 Support

Nếu gặp vấn đề, hãy:

1. Kiểm tra logs trên GitHub Actions
2. Kiểm tra logs trên VPS
3. Xem lại các bước trong hướng dẫn này
4. Tham khảo phần Troubleshooting

---

## ✅ Checklist

- [ ] VPS đã cài Docker và Docker Compose
- [ ] SSH key đã được tạo và thêm vào VPS
- [ ] GitHub Secrets đã được cấu hình đầy đủ
- [ ] Image names đã được cập nhật trong workflow và docker-compose
- [ ] File .env đã được tạo trên VPS
- [ ] Firewall đã được cấu hình
- [ ] Test deployment thành công
- [ ] Monitoring và logging đã được setup

---

**🎉 Chúc mừng! Bạn đã setup CI/CD thành công!**

Từ giờ, mỗi khi bạn push code lên branch `main`, hệ thống sẽ tự động:
1. Chạy tests
2. Build Docker images
3. Push lên GitHub Container Registry
4. Deploy lên VPS

Không cần chạy `git pull` và `docker-compose up -d` thủ công nữa! 🚀
