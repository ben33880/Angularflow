#!/bin/bash
set -e

echo "======================================="
echo "  Flow.io - Installation LXC Proxmox"
echo "======================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then
    log_error "Script doit être exé§°cuté·§ en root"
    exit 1
fi

log_info "Mise à jour du système..."
apt update && apt upgrade -y

log_info "Installation des dépendances..."
apt install -y curl git ca-certificates gnupg lsb-release ufw

log_info "Installation de Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
log_info "Docker $(docker --version) installé"

log_info "Configuration firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw allow 1883/tcp
ufw allow 22/tcp

log_info "Cré·§ation de /opt/flowio..."
mkdir -p /opt/flowio
cd /opt/flowio

log_info "Ré§°cupé·§ration Flow.io..."
if git clone https://github.com/ben33880/Angularflow.git . 2>/dev/null; then
    log_info "Repository cloné·§"
else
    log_warn "Clone échoué·§, création manuelle..."
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
EOF
    cat > config.json << 'EOF'
{"mqtt":{"broker":"localhost","port":1883,"path":"/mqtt"},"device":{"name":"Flow.io"}}
EOF
    mkdir -p mosquitto/config
    echo -e "listener 1883\nallow_anonymous true\n\nlistener 9001\nprotocol websockets\nallow_anonymous true" > mosquitto/config/mosquitto.conf
fi

log_info "Activation Docker..."
systemctl enable --now docker

log_info "Installation terminé § §e !"
echo ""
echo "======================================="
echo "  IMPORTANT - Configurer MQTT"
echo "======================================="
echo ""
echo "1. Modifier config MQTT :"
echo "   cd /opt/flowio"
echo "   nano config.json"
echo "   # Changer broker, port, user, password"
echo ""
echo "2. Lancer Flow.io :"
echo "   docker compose up -d"
echo ""
echo "3. Accé§°der :"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "======================================="
echo ""
log_info "N'oubliez pas de modifier config.json avant de lancer !"
