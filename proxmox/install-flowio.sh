#!/bin/bash

# Flow.io LXC Install Script for Proxmox
# Debian 12 (Bookworm) - Unprivileged container

set -e

echo "======================================="
echo "  Flow.io - Installation LXC Proxmox"
echo "======================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then
    log_error "Ce script doit être exé§°cuté·§ en root"
    exit 1
fi

# 1. Update
log_info "Mise à jour du système..."
apt update && apt upgrade -y

# 2. Dependencies
log_info "Installation des dépendances..."
apt install -y curl git ca-certificates gnupg lsb-release ufw

# 3. Docker
log_info "Installation de Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

log_info "Docker $(docker --version) installé"

# 4. Firewall
log_info "Configuration du firewall (UFW)..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw allow 1883/tcp
ufw allow 22/tcp
log_info "Firewall configuré·§ - Ports: 80, 1883, 22"

# 5. Create directory
log_info "Cré·§ation du dossier /opt/flowio..."
mkdir -p /opt/flowio
cd /opt/flowio

# 6. Clone repo or create files
log_info "Ré§°cupé·§ration des fichiers Flow.io..."

if git clone https://github.com/ben33880/Angularflow.git . 2>/dev/null; then
    log_info "Repository cloné·§"
else
    log_warn "Clone échoué·§, création des fichiers..."
    
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  flowio-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    volumes:
      - ./config.json:/usr/share/nginx/html/config.json:ro
    restart: unless-stopped
    networks:
      - flowio-network

  mosquitto:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    restart: unless-stopped
    networks:
      - flowio-network

networks:
  flowio-network:
    driver: bridge
EOF

    cat > config.json << 'EOF'
{
  "mqtt": {
    "broker": "localhost",
    "port": 1883,
    "path": "/mqtt",
    "username": "",
    "password": ""
  },
  "device": {
    "name": "Flow.io Pool Controller",
    "location": "Pool House"
  }
}
EOF

    mkdir -p mosquitto/config
    
    cat > mosquitto/config/mosquitto.conf << 'EOF'
listener 1883
allow_anonymous true

listener 9001
protocol websockets
allow_anonymous true
EOF
fi

# 7. Enable Docker
log_info "Activation de Docker au boot..."
systemctl enable docker
systemctl start docker

# 8. Done
log_info "Installation terminé § §e !"
echo ""
echo "======================================="
echo "  Prochaines é•tapes"
echo "======================================="
echo ""
echo "1. Modifier config MQTT :"
echo "   cd /opt/flowio && nano config.json"
echo ""
echo "2. Lancer Flow.io :"
echo "   docker compose up -d"
echo ""
echo "3. Accé§°der :"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "======================================="
echo ""

read -p "Lancer Flow.io maintenant ? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Build et démarrage..."
    docker compose up -d --build
    log_info "Flow.io en ligne : http://$(hostname -I | awk '{print $1}')"
fi

echo ""
log_info "Script terminé !"
