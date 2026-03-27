#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# Deploy Script for VPS
# ═══════════════════════════════════════════════════════════════════════════
# Script này giúp deploy thủ công lên VPS nếu cần
# Sử dụng: ./scripts/deploy.sh
# ═══════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   Next.js E-commerce Deployment Script${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file from .env.example${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed!${NC}"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Error: Docker Compose is not installed!${NC}"
    exit 1
fi

echo -e "\n${YELLOW}📦 Pulling latest images...${NC}"
docker compose -f docker-compose.prod.yml pull

echo -e "\n${YELLOW}🔄 Stopping old containers...${NC}"
docker compose -f docker-compose.prod.yml down

echo -e "\n${YELLOW}🚀 Starting new containers...${NC}"
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo -e "\n${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

echo -e "\n${YELLOW}📊 Checking container status...${NC}"
docker compose -f docker-compose.prod.yml ps

echo -e "\n${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -af --filter "until=24h"

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

# Show logs
echo -e "\n${YELLOW}📝 Recent logs:${NC}"
docker compose -f docker-compose.prod.yml logs --tail=50
