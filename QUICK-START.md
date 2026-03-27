# ⚡ Quick Start Guide - CI/CD Setup

Hướng dẫn nhanh để setup CI/CD trong 15 phút.

## 🎯 Mục Tiêu

Sau khi hoàn thành guide này, mỗi lần bạn `git push`, hệ thống sẽ tự động:
- ✅ Chạy tests
- ✅ Build Docker images
- ✅ Push lên GitHub Container Registry
- ✅ Deploy lên VPS

## 📋 Checklist Chuẩn Bị

Đảm bảo bạn có:
- [ ] VPS với Ubuntu/Debian (ít nhất 2GB RAM)
- [ ] GitHub repository với code
- [ ] SSH access vào VPS
- [ ] Domain (optional, nhưng recommended)

---

## 🚀 3 Bước Chính

### BƯỚC 1: Setup VPS (5 phút)

```bash
# 1. SSH vào VPS
ssh root@your-vps-ip

# 2. Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 3. Chạy setup script
chmod +x scripts/setup-vps.sh
./scripts/setup-vps.sh

# 4. Tạo SSH key cho GitHub Actions
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions

# 5. Copy private key (sẽ dùng ở bước 2)
cat ~/.ssh/github_actions
# Copy toàn bộ output này!

# 6. Tạo file .env
cd ~/app
cp .env.template .env
nano .env  # Điền thông tin của bạn

# 7. Log out và log in lại
exit
```

---

### BƯỚC 2: Cấu Hình GitHub (5 phút)

#### 2.1. Cập nhật workflow file

Mở `.github/workflows/main.yml`, tìm và thay đổi:

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_BACKEND: YOUR-GITHUB-USERNAME/next-ecommerce-backend  # ← Thay đổi
  IMAGE_FRONTEND: YOUR-GITHUB-USERNAME/next-ecommerce-frontend  # ← Thay đổi
```

#### 2.2. Cập nhật docker-compose.prod.yml

Mở `docker-compose.prod.yml`, tìm và thay đổi:

```yaml
backend:
  image: ${BACKEND_IMAGE:-ghcr.io/YOUR-GITHUB-USERNAME/next-ecommerce-backend:latest}

frontend:
  image: ${FRONTEND_IMAGE:-ghcr.io/YOUR-GITHUB-USERNAME/next-ecommerce-frontend:latest}
```

#### 2.3. Thêm GitHub Secrets

Vào: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

**Secrets cần thiết** (copy từ file .env trên VPS):

```bash
# VPS Connection
DEPLOY_HOST=your-vps-ip
DEPLOY_USER=root  # hoặc ubuntu
DEPLOY_SSH_KEY=<paste private key từ bước 1.5>

# Database
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=next_ecommerce
MYSQL_USER=springstudent
MYSQL_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=360000000

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_id

# Payment URLs
VNPAY_RETURN_URL=https://yourdomain.com/en/user/orders
PAYPAL_RETURN_URL=https://yourdomain.com/en/user/orders
PAYPAL_CANCEL_URL=https://yourdomain.com/en/user/orders
```

**💡 Tip**: Tạo một file text local để track các secrets này (KHÔNG commit vào git!)

---

### BƯỚC 3: Test Deployment (5 phút)

```bash
# 1. Commit và push changes
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main

# 2. Xem workflow chạy
# Vào GitHub → Actions tab → Xem workflow đang chạy

# 3. Sau khi workflow hoàn thành, kiểm tra VPS
ssh root@your-vps-ip
cd ~/app
docker compose -f docker-compose.prod.yml ps

# 4. Test application
curl http://your-vps-ip:3000  # Frontend
curl http://your-vps-ip:5000/api/health  # Backend
```

---

## ✅ Verify Success

Nếu thành công, bạn sẽ thấy:

**Trên GitHub Actions**:
- ✅ All jobs passed (màu xanh)
- ✅ 4 jobs: CI Backend, CI Frontend, Docker Build & Push, Deploy

**Trên VPS**:
```bash
$ docker compose -f docker-compose.prod.yml ps

NAME              STATUS
mysql-server      Up (healthy)
redis-server      Up (healthy)
spring-backend    Up
nextjs-frontend   Up
```

**Trên Browser**:
- ✅ Frontend accessible: `http://your-vps-ip:3000`
- ✅ Backend accessible: `http://your-vps-ip:5000/api`

---

## 🎉 Done!

Từ giờ, workflow sẽ tự động chạy mỗi khi bạn push code:

```bash
git add .
git commit -m "Your changes"
git push origin main
# → GitHub Actions tự động deploy! 🚀
```

---

## 🔧 Common Issues

### Issue 1: "Permission denied (publickey)"

```bash
# Trên VPS, kiểm tra lại SSH key
cat ~/.ssh/authorized_keys | grep github-actions

# Nếu không có, thêm lại
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Issue 2: "Cannot pull image"

```bash
# Kiểm tra image name trong workflow và docker-compose.prod.yml
# Đảm bảo username GitHub đúng
```

### Issue 3: "Container unhealthy"

```bash
# Xem logs
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs mysql

# Kiểm tra .env file
cat ~/app/.env
```

---

## 📚 Next Steps

- [ ] Setup reverse proxy (Nginx/Caddy) cho HTTPS
- [ ] Setup monitoring (Prometheus/Grafana)
- [ ] Setup backup automation
- [ ] Setup staging environment
- [ ] Configure custom domain

Xem file `CICD-SETUP.md` để biết chi tiết hơn!

---

## 🆘 Need Help?

1. Xem logs trên GitHub Actions
2. Xem logs trên VPS: `docker compose -f docker-compose.prod.yml logs`
3. Đọc file `CICD-SETUP.md` (hướng dẫn chi tiết)
4. Check phần Troubleshooting trong `CICD-SETUP.md`
