#!/bin/bash

# Angularflow - Docker Deployment Script for Proxmox
# Usage: ./deploy-proxmox.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Function to install Docker
install_docker() {
    echo -e "${YELLOW}📦 Installing Docker...${NC}"
    
    # Update package list
    apt-get update -qq
    
    # Install prerequisites
    apt-get install -y -qq \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package list again
    apt-get update -qq
    
    # Install Docker
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add user to docker group (optional, for non-root access)
    # usermod -aG docker $USER
    
    # Enable and start Docker
    systemctl enable docker
    systemctl start docker
    
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed${NC}"
    read -p "Do you want to install Docker now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_docker
    else
        echo -e "${RED}❌ Docker is required. Exiting.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Docker found ($(docker --version))${NC}"
fi

# Check if docker-compose is available
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✅ docker-compose found${NC}"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    echo -e "${GREEN}✅ docker compose (plugin) found${NC}"
else
    echo -e "${YELLOW}⚠️  docker-compose not found, will use docker build${NC}"
    COMPOSE_CMD=""
fi

# Clone or update repository
echo ""
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}📦 Cloning repository...${NC}"
    git clone $REPO_URL
    echo -e "${GREEN}✅ Repository cloned${NC}"
else
    echo -e "${GREEN}✅ Repository exists${NC}"
    echo -e "${YELLOW}🔄 Updating repository...${NC}"
    cd $PROJECT_DIR
    git pull origin main
    cd ..
    echo -e "${GREEN}✅ Repository updated${NC}"
fi

cd $PROJECT_DIR

# Stop existing container if running
echo ""
echo -e "${YELLOW}🛑 Stopping existing container (if any)...${NC}"
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true
echo -e "${GREEN}✅ Container stopped/removed${NC}"

# Remove old image (optional, saves disk space)
echo ""
echo -e "${YELLOW}🗑️  Removing old image (if exists)...${NC}"
docker rmi $IMAGE_NAME 2>/dev/null || true
echo -e "${GREEN}✅ Old image removed${NC}"

# Build Docker image
echo ""
echo -e "${YELLOW}🔨 Building Docker image...${NC}"
if [ -f "docker-compose.yml" ] && [ -n "$COMPOSE_CMD" ]; then
    echo "   Using docker-compose..."
    $COMPOSE_CMD build --no-cache
else
    echo "   Using docker build..."
    docker build --no-cache -t $IMAGE_NAME .
fi
echo -e "${GREEN}✅ Image built${NC}"

# Run container
echo ""
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
echo ""
echo -e "${YELLOW}⏳ Waiting for container to be ready...${NC}"
sleep 5

# Check container status
CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' $CONTAINER_NAME 2>/dev/null || echo "not_found")

if [ "$CONTAINER_STATUS" = "running" ]; then
    # Get container IP
    CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CONTAINER_NAME)
    
    echo ""
    echo -e "${GREEN}==================================${NC}"
    echo -e "${GREEN}  ✅ Deployment Successful!      ${NC}"
    echo -e "${GREEN}==================================${NC}"
    echo ""
    echo -e "Container:  ${GREEN}$CONTAINER_NAME${NC}"
    echo -e "Image:      ${GREEN}$IMAGE_NAME${NC}"
    echo -e "Port:       ${GREEN}$PORT${NC}"
    echo -e "Container IP: ${GREEN}$CONTAINER_IP${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Access your application at:${NC}"
    echo -e "   ${GREEN}http://localhost:$PORT${NC}"
    echo -e "   ${GREEN}http://$CONTAINER_IP:80${NC}"
    echo ""
    echo -e "${YELLOW}📝 Useful commands:${NC}"
    echo "   View logs:     ${GREEN}docker logs -f $CONTAINER_NAME${NC}"
    echo "   Stop:          ${GREEN}docker stop $CONTAINER_NAME${NC}"
    echo "   Start:         ${GREEN}docker start $CONTAINER_NAME${NC}"
    echo "   Restart:       ${GREEN}docker restart $CONTAINER_NAME${NC}"
    echo "   Remove:        ${GREEN}docker rm -f $CONTAINER_NAME${NC}"
    echo "   Update:        ${GREEN}cd $PROJECT_DIR && git pull && ./deploy-proxmox.sh${NC}"
    echo ""
    
    # Show running containers
    echo -e "${BLUE}📊 Running containers:${NC}"
    docker ps --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
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
