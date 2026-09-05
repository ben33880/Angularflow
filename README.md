# Flow.io

Contrô·§·leur intelligent pour piscine avec interface web moderne et architecture 100% MQTT.

![Status](https://img.shields.io/badge/status-production-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-24 LTS-green)
![Angular](https://img.shields.io/badge/Angular-20+-red)

---

## 📡 Architecture

```
┌─────────────────┐         MQTT          ┌─────────────────┐
│   Flow.io       │◄──────────────────────►│   Frontend      │
│   (ESP32)       │      (flowio:1883)    │   (Angular)     │
│                 │                       │                 │
│ - Capteurs      │                       │ - Dashboard     │
│ - Relays        │                       │ - Config        │
│ - PID           │                       │ - Logs          │
│ - WiFi/MQTT     │                       │ - Alarms        │
└─────────────────┘                       └─────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                       ┌─────────────────┐
│   Pool          │                       │   Docker        │
│ - Temp          │                       │   Nginx         │
│ - pH            │                       │   Config        │
│ - ORP           │                       │                 │
└─────────────────┘                       └─────────────────┘
```

**Caracté·§ristiques :**
- ✅ **100% MQTT** - Aucune API HTTP
- ✅ **Temps réel** - Push natif via MQTT
- ✅ **Docker-ready** - `docker-compose.yml` inclus
- ✅ **Config persistante** - Fichier `config.json` monté·§ en volume
- ✅ **SPA moderne** - Angular 20+, signals, standalone components
- ✅ **Proxmox LXC** - Script d'install auto pour containers

---

## 🚀 Quick Start

### Prerequis

- Docker & Docker Compose
- Ou Node.js 24+ & npm 10+
- Ou Proxmox VE (pour LXC)

### Option 1 : Docker (Recommandé·§)

```bash
# 1. Cloner le repo
git clone https://github.com/ben33880/Angularflow.git
cd Angularflow

# 2. Configurer MQTT
nano config.json
# Modifier broker, port, auth si besoin

# 3. Lancer
docker-compose up -d

# 4. Ouvrir
# http://localhost
```

### Option 2 : Proxmox LXC

```bash
# 1. Créer un container Debian 12
pct create 100 local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
  --rootfs local-lvm:4 \
  --memory 512 \
  --cores 1 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp \
  --hostname flowio \
  --unprivileged 1

# 2. Exé§°cuter le script d'install
pct exec 100 -- bash -c "$(curl -s https://raw.githubusercontent.com/ben33880/Angularflow/main/proxmox/install-flowio.sh)"

# 3. Configurer et lancer
pct enter 100
cd /opt/flowio
nano config.json
docker-compose up -d

# 4. Ouvrir
# http://<IP_LXC>
```

### Option 3 : Dev local

```bash
# 1. Installer
cd frontend
npm install

# 2. Configurer
cp ../config.json src/assets/

# 3. Lancer
npm start

# 4. Ouvrir
# http://localhost:4200
```

---

## 📁 Structure

```
Angularflow/
├── config.json              # Config MQTT (volume Docker)
├── docker-compose.yml       # Orchestration Docker
├── Dockerfile               # Build Angular + Nginx
├── nginx.conf               # Config serveur web
├── README.md
├── proxmox/                 # Template LXC Proxmox
│   ├── README.md
│   └── install-flowio.sh
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── features/    # Pages (dashboard, config, etc.)
    │   │   ├── models/      # Types TypeScript
    │   │   ├── services/    # MQTT, config
    │   │   ├── shared/      # UI components, pipes
    │   │   └── app.routes.ts
    │   └── assets/
    ├── package.json
    └── tsconfig.json
```

---

## 📡 Topics MQTT

### Publication (Backend → Frontend)

#### Pool Status
| Topic | Payload | Fré·§quence |
|-------|---------|-------------|
| `flowio/pool/status` | `{ temperature, ph, orp, filtrationOn, chlorineDosingOn, phDosingOn }` | 1 Hz |
| `flowio/pool/temperatures` | `{ basin, return, equipment, outdoor? }` | 1 Hz |
| `flowio/pool/chemistry` | `{ ph, orp, redox?, tds? }` | 1 Hz |

#### System
| Topic | Payload | Fré·§quence |
|-------|---------|-------------|
| `flowio/system/status` | `{ uptime, freeMemory, totalMemory, wifiRssi, mqttConnected }` | 5s |
| `flowio/system/uptime` | `{ uptime }` | 60s |
| `flowio/system/memory` | `{ free, total }` | 60s |
| `flowio/system/wifi` | `{ rssi, ssid? }` | 60s |
| `flowio/system/mqtt` | `{ connected, broker? }` | 60s |

#### Logs
| Topic | Payload | Description |
|-------|---------|-------------|
| `flowio/logs/info` | `{ timestamp, level, message, module? }` | Logs info |
| `flowio/logs/warn` | `{ timestamp, level, message, module? }` | Avertissements |
| `flowio/logs/error` | `{ timestamp, level, message, module? }` | Erreurs |

#### Alarms
| Topic | Payload | Description |
|-------|---------|-------------|
| `flowio/alarms/active` | `AlarmEntry[]` | Alarmes actives |
| `flowio/alarms/history` | `AlarmEntry[]` | Historique |

#### Device
| Topic | Payload | Description |
|-------|---------|-------------|
| `flowio/device/config` | `DeviceConfig` | Config appareil |
| `flowio/relays/state` | `RelayState[]` | État des relays |
| `flowio/inputs/state` | `InputState[]` | État des inputs |

### Commandes (Frontend → Backend)

| Topic | Payload | Description |
|-------|---------|-------------|
| `flowio/cmd/pool/filtration` | `{ on: boolean }` | Activer filtration |
| `flowio/cmd/pool/chlorine` | `{ on: boolean }` | Activer chlore |
| `flowio/cmd/pool/ph` | `{ on: boolean }` | Activer pH |
| `flowio/cmd/relay/{1-8}` | `{ on: boolean }` | Contrô·§·ler relay |
| `flowio/cmd/config/update` | `DeviceConfig` | Mettre à jour config |
| `flowio/cmd/system/reboot` | `{}` | Redé·§marrer |
| `flowio/cmd/alarm/ack` | `{ id: string }` | Acquitter alarme |

---

## 🔧 Configuration

### config.json

```json
{
  "mqtt": {
    "broker": "192.168.1.100",
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
```

**Champs :**
- `broker` : IP/hostname du broker MQTT
- `port` : Port WebSocket (1883 ou 9001)
- `path` : Path WebSocket (ex: `/mqtt`)
- `username` / `password` : Auth optionnelle

### Docker

```yaml
services:
  flowio-frontend:
    volumes:
      - ./config.json:/usr/share/nginx/html/config.json:ro
```

Le fichier est monté·§ en **lecture seule** dans le container.

### Proxmox LXC

Voir [`proxmox/README.md`](proxmox/README.md) pour :
- Création du container
- Script d'install auto
- Configuration recommandé•e
- Backup & restore

---

## 🔒 Sé-•curité·§

### Bonnes pratiques

1. **Broker MQTT** :
   - Activer l'authentification (username/password)
   - Utiliser TLS (port 8883 + wss://)
   - Restreindre l'accè·§s réseau (firewall)

2. **Docker** :
   - Ne pas exposer les ports inutilement
   - Utiliser des réseaux isolé·§s
   - Mettre à jour les images ré-•gulierement

3. **Config** :
   - Ne pas committer `config.json` avec des mots de passe
   - Utiliser `.gitignore`
   - Rotater les credentials ré-•gulierement

4. **Network** :
   - Isoler le broker MQTT du réseau public
   - Utiliser un VLAN dédié pour l'IoT
   - Activer le client isolation sur le WiFi

5. **Proxmox LXC** :
   - Utiliser des containers **unprivileged**
   - Limiter les ressources (CPU, RAM)
   - Activer le firewall Proxmox
   - Backup ré-•gulier avec `pct backup`

### Exemple Mosquitto (auth)

```conf
# /etc/mosquitto/conf.d/auth.conf
allow_anonymous false
password_file /etc/mosquitto/passwd

# Créer le fichier de mots de passe
mosquitto_passwd -c /etc/mosquitto/passwd mqtt_user
```

---

## 🛠 Dé-•veloppement

### Commands

```bash
# Install
cd frontend
npm install

# Dev server
npm start

# Build prod
npm run build -- --configuration production

# Lint
npm run lint

# Test
npm run test
```

### Architecture code

- **Standalone components** - Pas de NgModules
- **Signals** - Gestion d'é·§tat réactive
- **OnPush** - Change detection optimisé·§e
- **Typed** - TypeScript strict

### Services

| Service | Description |
|---------|-------------|
| `FileConfigService` | Lit/é·§crit `config.json` |
| `MqttService` | Client MQTT, subscriptions, commands |

### Models

| Interface | Description |
|-----------|-------------|
| `PoolStatus` | Status piscine (temp, pH, ORP) |
| `SystemStatus` | Status système (uptime, mémoire, WiFi) |
| `LogEntry` | Entré·§e de log |
| `AlarmEntry` | Alarme |
| `DeviceConfig` | Config appareil |
| `RelayState` | État relay |
| `InputState` | État input |

---

## 📊 Features

### Dashboard
- Tempé·§rature en temps réel
- pH / ORP
- Status filtration, chlore, pH
- Contrô·§·les rapides

### System
- Uptime
- Mémoire libre
- Qualité WiFi (RSSI)
- Status MQTT

### Logs
- Logs temps réel (INFO, WARN, ERROR)
- Filtre par niveau
- Scrollback 100 entries

### Alarms
- Alarmes actives
- Historique
- Acknowledgement
- Sévé·§rité·§ (LOW, MEDIUM, HIGH, CRITICAL)

### Config
- Config MQTT (broker, port, auth)
- Config device (WiFi, etc.)
- Reboot à distance

### Relays / Inputs
- Status des 8 relays
- Status des inputs
- Contrô·§·le manuel

---

## 🐛 Troubleshooting

### Frontend ne se connecte pas

```bash
# 1. Vérifier config.json
cat config.json

# 2. Vérifier broker
nc -zv 192.168.1.100 1883

# 3. Logs container
docker logs flowio-frontend

# 4. Restart
docker-compose restart flowio-frontend
```

### MQTT ne fonctionne pas

```bash
# 1. Vérifier broker
docker exec -it mosquitto mosquitto_sub -v -t 'flowio/#'

# 2. Tester publish
mosquitto_pub -t 'flowio/cmd/pool/filtration' -m '{"on":true}'

# 3. Vérifier firewall
ufw status
```

### Config ne se met pas à jour

```bash
# 1. Vérifier volume
docker inspect flowio-frontend | grep config.json

# 2. Vérifier perms
ls -l config.json

# 3. Reload
docker-compose restart flowio-frontend
```

### Proxmox LXC

```bash
# Container ne démarre pas
pct status 100
pct start 100

# Docker ne fonctionne pas
pct exec 100 -- systemctl status docker
pct exec 100 -- systemctl restart docker

# Ports non accessibles
pct exec 100 -- ufw status
pct exec 100 -- ufw allow 80
pct exec 100 -- ufw allow 1883
```

---

## 📝 License

MIT - Voir [LICENSE](LICENSE)

---

## 🤝 Contributing

1. Fork le repo
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une PR

---

## 📞 Support

- Issues GitHub : https://github.com/ben33880/Angularflow/issues
- Discussions : https://github.com/ben33880/Angularflow/discussions

---

## 🖥 Dé-•ploiement

| Plateforme | Guide | Status |
|------------|-------|--------|
| Docker | Voir [Quick Start](#option-1--docker-recommandé§°) | ✅ |
| Proxmox LXC | Voir [`proxmox/README.md`](proxmox/README.md) | ✅ |
| Dev local | Voir [Quick Start](#option-3--dev-local) | ✅ |
