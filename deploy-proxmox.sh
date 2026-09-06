#!/bin/bash

# Angularflow - Docker Deployment Script for Proxmox
# Usage: ./deploy-proxmox.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/ben33880/Angularflow.git"
CONTAINER_NAME="angularflow"
IMAGE_NAME="angularflow:latest"
PORT="4200"
PROJECT_DIR="Angularflow"

echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  Angularflow - Docker Deploy    ${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    echo "   https://docs.docker.com/engine/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker found${NC}"

# Check if docker-compose is installed
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo -e "${YELLOW}⚠️  docker-compose not found, using docker build${NC}"
    COMPOSE_CMD=""
fi

# Clone repository if not exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}📦 Cloning repository...${NC}"
    git clone $REPO_URL
    echo -e "${GREEN}✅ Repository cloned${NC}"
else
    echo -e "${GREEN}✅ Repository already exists${NC}"
    cd $PROJECT_DIR
fi

cd $PROJECT_DIR

# Stop existing container if running
echo -e "${YELLOW}🛑 Stopping existing container (if any)...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true
echo -e "${GREEN}✅ Container stopped/removed${NC}"

# Build Docker image
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
if [ -f "docker-compose.yml" ] && [ -n "$COMPOSE_CMD" ]; then
    echo "   Using docker-compose..."
    $COMPOSE_CMD build
else
    echo "   Using docker build..."
    docker build -t $IMAGE_NAME .
fi
echo -e "${GREEN}✅ Image built${NC}"

# Run container
echo -e "${YELLOW}🚀 Starting container...${NC}"
if [ -f "docker-compose.yml" ] && [ -n "$COMPOSE_CMD" ]; then
    $COMPOSE_CMD up -d
else
    docker run -d \
        --name $CONTAINER_NAME \
        -p ${PORT}:80 \
        --restart unless-stopped \
        $IMAGE_NAME
fi
echo -e "${GREEN}✅ Container started${NC}"

# Wait for container to be ready
echo -e "${YELLOW}⏳ Waiting for container to be ready...${NC}"
sleep 3

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $CONTAINER_NAME 2>/dev/null || echo "not_found")

if [ "$CONTAINER_STATUS" = "running" ]; then
    echo ""
    echo -e "${GREEN}==================================${NC}"
    echo -e "${GREEN}  ✅ Deployment Successful!      ${NC}"
    echo -e "${GREEN}==================================${NC}"
    echo ""
    echo -e "Container: ${GREEN}$CONTAINER_NAME${NC}"
    echo -e "Image:     ${GREEN}$IMAGE_NAME${NC}"
    echo -e "Port:      ${GREEN}$PORT${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Access your application at:${NC}"
    echo -e "   ${GREEN}http://localhost:$PORT${NC}"
    echo ""
    echo -e "${YELLOW}📝 Useful commands:${NC}"
    echo "   View logs:     ${GREEN}docker logs -f $CONTAINER_NAME${NC}"
    echo "   Stop:          ${GREEN}docker stop $CONTAINER_NAME${NC}"
    echo "   Start:         ${GREEN}docker start $CONTAINER_NAME${NC}"
    echo "   Restart:       ${GREEN}docker restart $CONTAINER_NAME${NC}"
    echo "   Remove:        ${GREEN}docker rm -f $CONTAINER_NAME${NC}"
    echo ""
else
    echo -e "${RED}==================================${NC}"
    echo -e "${RED}  ❌ Deployment Failed           ${NC}"
    echo -e "${RED}==================================${NC}"
    echo ""
    echo -e "Container status: ${RED}$CONTAINER_STATUS${NC}"
    echo ""
    echo -e "${YELLOW}Check logs:${NC}"
    docker logs $CONTAINER_NAME 2>/dev/null || echo "No logs available"
    exit 1
fi
