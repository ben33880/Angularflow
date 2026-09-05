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
log_info "Configuration firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 80/tcp
ufw allow 1883/tcp
ufw allow 22/tcp

# 5. Create directory
log_info "Cré·§ation de /opt/flowio..."
mkdir -p /opt/flowio
cd /opt/flowio

# 6. Clone or create
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

# 7. Enable Docker
log_info "Activation Docker..."
systemctl enable --now docker

# 8. Done
log_info "Installation terminé § §e !"
echo ""
echo "======================================="
echo "  Prochaines é•tapes"
echo "======================================="
echo "1. Configurer: cd /opt/flowio && nano config.json"
echo "2. Lancer: docker compose up -d"
echo "3. Accé§°der: http://$(hostname -I | awk '{print $1}')"
echo "======================================="
echo ""

read -p "Lancer maintenant ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker compose up -d --build
    log_info "Flow.io en ligne: http://$(hostname -I | awk '{print $1}')"
fi
