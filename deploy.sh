#!/bin/bash

# Angularflow Deployment Script for Proxmox
# Usage: ./deploy.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Angularflow Deployment Script${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Config
REPO_URL="https://github.com/ben33880/Angularflow.git"
CONTAINER_NAME="angularflow"
HOST_PORT=4200
IMAGE_NAME="angularflow:latest"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker found${NC}"

# Clone or update repo
if [ -d "Angularflow" ]; then
    echo -e "${BLUE}📦 Repository already exists, updating...${NC}"
    cd Angularflow
    git pull
else
    echo -e "${BLUE}📦 Cloning repository...${NC}"
    git clone $REPO_URL
    cd Angularflow
fi

echo -e "${GREEN}✅ Repository ready${NC}"

# Stop existing container
echo -e "${BLUE}🛑 Stopping existing container (if any)...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo -e "${GREEN}✅ Container stopped${NC}"

# Build Docker image
echo -e "${BLUE}🔨 Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

echo -e "${GREEN}✅ Image built${NC}"

# Run container
echo -e "${BLUE}🚀 Starting container...${NC}"
docker run -d \
  --name $CONTAINER_NAME \
  -p $HOST_PORT:80 \
  --restart unless-stopped \
  $IMAGE_NAME

echo -e "${GREEN}✅ Container started${NC}"
echo ""

# Show status
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✨ Deployment successful!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "Application URL: ${BLUE}http://localhost:$HOST_PORT${NC}"
echo -e "Container name:  ${BLUE}$CONTAINER_NAME${NC}"
echo -e "Image name:      ${BLUE}$IMAGE_NAME${NC}"
echo ""
echo -e "Useful commands:"
echo -e "  ${BLUE}docker logs $CONTAINER_NAME${NC}         # View logs"
echo -e "  ${BLUE}docker stop $CONTAINER_NAME${NC}         # Stop container"
echo -e "  ${BLUE}docker start $CONTAINER_NAME${NC}        # Start container"
echo -e "  ${BLUE}docker rm $CONTAINER_NAME${NC}           # Remove container"
echo ""
