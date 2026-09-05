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
NC='\033[0m' # No Color

# Fonctions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier root
if [ "$EUID" -ne 0 ]; then
    log_error "Ce script doit être exé§°cuté·§ en root"
    exit 1
fi

# 1. Mettre à jour le système
log_info "Mise à jour du système..."
apt update && apt upgrade -y

# 2. Installer les dépendances
log_info "Installation des dépendances..."
apt install -y \
    curl \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw

# 3. Installer Docker
log_info "Installation de Docker..."

# Ajouter la clé GPG officielle de Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Ajouter le repository Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier Docker
if ! docker --version > /dev/null 2>&1; then
    log_error "Docker n'a pas été installé correctement"
    exit 1
fi

log_info "Docker $(docker --version) installé"

# 4. Installer Docker Compose (plugin)
log_info "Docker Compose plugin déjà inclus avec Docker CE"

# 5. Configurer le firewall
log_info "Configuration du firewall (UFW)..."

ufw --force enable
ufw default deny incoming
ufw default allow outgoing

# Ports Flow.io
ufw allow 80/tcp      # Frontend web
ufw allow 1883/tcp    # MQTT
ufw allow 22/tcp      # SSH (à§° désactiver si pas besoin)

log_info "Firewall configuré·§ - Ports ouverts: 80, 1883, 22"

# 6. Créer le dossier Flow.io
log_info "Cré·§ation du dossier /opt/flowio..."

mkdir -p /opt/flowio
cd /opt/flowio

# 7. Cloner le repo (ou créer les fichiers de base)
log_info "Clonage du repository Flow.io..."

git clone https://github.com/ben33880/Angularflow.git /opt/flowio 2>/dev/null || {
    log_warn "Impossible de cloner le repo, création des fichiers de base..."
    
    # Créer docker-compose.yml
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

    # Créer config.json
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

    # Créer dossier Mosquitto
    mkdir -p mosquitto/config
    
    cat > mosquitto/config/mosquitto.conf << 'EOF'
listener 1883
allow_anonymous true

listener 9001
protocol websockets
allow_anonymous true
EOF
}

# 8. Activer Docker au boot
log_info "Activation de Docker au boot..."
systemctl enable docker
systemctl start docker

# 9. Afficher les infos
log_info "Installation terminé§°e avec succès !"
echo ""
echo "======================================="
echo "  Prochaines é•tapes"
echo "======================================="
echo ""
echo "1. Modifier la config MQTT :"
echo "   cd /opt/flowio"
echo "   nano config.json"
echo ""
echo "2. Lancer Flow.io :"
echo "   cd /opt/flowio"
echo "   docker-compose up -d"
echo ""
echo "3. Accé§°der à l'interface :"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "4. MQTT WebSocket :"
echo "   ws://$(hostname -I | awk '{print $1}'):1883/mqtt"
echo ""
echo "======================================="
echo ""

# Optionnel : Build et start automatique
read -p "Voulez-vous lancer Flow.io maintenant ? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Build et démarrage de Flow.io..."
    cd /opt/flowio
    docker-compose up -d --build
    
    echo ""
    log_info "Flow.io est en ligne !"
    echo "   Frontend: http://$(hostname -I | awk '{print $1}')"
    echo "   MQTT: ws://$(hostname -I | awk '{print $1}'):1883/mqtt"
fi

echo ""
log_info "Script terminé !"
