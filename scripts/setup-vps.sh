#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# VPS Initial Setup Script
# ═══════════════════════════════════════════════════════════════════════════
# Script này cài đặt các dependencies cần thiết trên VPS Ubuntu/Debian
# Chạy script này trên VPS lần đầu tiên
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   VPS Setup Script for Next.js E-commerce${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Update system
echo -e "\n${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo -e "\n${YELLOW}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}✅ Docker installed${NC}"
else
    echo -e "${GREEN}✅ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "\n${YELLOW}🐳 Installing Docker Compose...${NC}"
if ! command -v docker compose &> /dev/null; then
    sudo apt-get install docker-compose-plugin -y
    echo -e "${GREEN}✅ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✅ Docker Compose already installed${NC}"
fi

# Install other useful tools
echo -e "\n${YELLOW}🔧 Installing additional tools...${NC}"
sudo apt-get install -y \
    git \
    curl \
    wget \
    vim \
    htop \
    ufw

# Setup firewall
echo -e "\n${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Next.js (optional, if not behind reverse proxy)
sudo ufw allow 5000/tcp  # Spring Boot (optional, if not behind reverse proxy)
echo -e "${GREEN}✅ Firewall configured${NC}"

# Create app directory
echo -e "\n${YELLOW}📁 Creating app directory...${NC}"
mkdir -p ~/app
cd ~/app

# Create .env template
echo -e "\n${YELLOW}📝 Creating .env template...${NC}"
cat > .env.template <<'EOF'
# Database
MYSQL_ROOT_PASSWORD=change_me
MYSQL_DATABASE=next_ecommerce
MYSQL_USER=springstudent
MYSQL_PASSWORD=change_me

# JWT
JWT_SECRET=change_me_to_a_secure_random_string
JWT_EXPIRATION=360000000

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# Payment URLs
VNPAY_RETURN_URL=https://yourdomain.com/en/user/orders
PAYPAL_RETURN_URL=https://yourdomain.com/en/user/orders
PAYPAL_CANCEL_URL=https://yourdomain.com/en/user/orders

# Docker Images (will be set by CI/CD)
BACKEND_IMAGE=ghcr.io/your-username/next-ecommerce-backend:latest
FRONTEND_IMAGE=ghcr.io/your-username/next-ecommerce-frontend:latest
EOF

echo -e "${GREEN}✅ .env template created at ~/app/.env.template${NC}"

# Setup log rotation
echo -e "\n${YELLOW}📋 Setting up log rotation...${NC}"
sudo tee /etc/logrotate.d/docker-containers > /dev/null <<'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    missingok
    delaycompress
    copytruncate
}
EOF

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ VPS setup completed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}📝 Next steps:${NC}"
echo -e "1. Copy .env.template to .env and fill in your values:"
echo -e "   ${GREEN}cp ~/app/.env.template ~/app/.env${NC}"
echo -e "   ${GREEN}nano ~/app/.env${NC}"
echo -e ""
echo -e "2. Generate SSH key for GitHub Actions:"
echo -e "   ${GREEN}ssh-keygen -t ed25519 -C 'github-actions' -f ~/.ssh/github_actions${NC}"
echo -e "   ${GREEN}cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys${NC}"
echo -e "   ${GREEN}cat ~/.ssh/github_actions${NC}  # Copy this to GitHub Secrets"
echo -e ""
echo -e "3. Test Docker:"
echo -e "   ${GREEN}docker --version${NC}"
echo -e "   ${GREEN}docker compose version${NC}"
echo -e ""
echo -e "4. ${YELLOW}IMPORTANT: Log out and log back in for Docker group changes to take effect!${NC}"
