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
- ✅ **Web UI** - Configuration via l'interface (zè§°ro CLI)

---

## 🚀 Quick Start

### Prerequis

- Docker & Docker Compose
- Ou Node.js 24+ & npm 10+
- Ou Proxmox VE (pour LXC)

### Option 1 : Docker

```bash
# 1. Cloner
git clone https://github.com/ben33880/Angularflow.git
cd Angularflow

# 2. Lancer
docker-compose up -d

# 3. Ouvrir
# http://localhost

# 4. Configurer via l'UI
# Page Config → Modifier broker/port → Sauvegarder
```

### Option 2 : Proxmox LXC

```bash
# 1. Créer container
pct create 100 local:vztmpl/debian-12-standard \
  --rootfs local-lvm:4 \
  --memory 512 \
  --cores 1 \
  --hostname flowio \
  --unprivileged 1

# 2. Installer
pct exec 100 -- bash < proxmox/install-flowio.sh

# 3. Ouvrir
# http://<IP_LXC>

# 4. Configurer via l'UI
# Page Config → Modifier broker/port → Sauvegarder
```

### Option 3 : Dev local

```bash
cd frontend
npm install
npm start
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
    └── src/app/
        ├── features/        # Pages
        ├── models/          # Types
        ├── services/        # MQTT, config
        └── shared/          # UI components
```

---

## 📡 Topics MQTT

### Publication (Backend → Frontend)

| Topic | Payload | Fré·§quence |
|-------|---------|-------------|
| `flowio/pool/status` | `{ temperature, ph, orp, filtrationOn, chlorineDosingOn, phDosingOn }` | 1 Hz |
| `flowio/pool/temperatures` | `{ basin, return, equipment, outdoor? }` | 1 Hz |
| `flowio/pool/chemistry` | `{ ph, orp, redox?, tds? }` | 1 Hz |
| `flowio/system/status` | `{ uptime, freeMemory, totalMemory, wifiRssi, mqttConnected }` | 5s |
| `flowio/system/uptime` | `{ uptime }` | 60s |
| `flowio/system/memory` | `{ free, total }` | 60s |
| `flowio/system/wifi` | `{ rssi, ssid? }` | 60s |
| `flowio/system/mqtt` | `{ connected, broker? }` | 60s |
| `flowio/logs/info` | `{ timestamp, level, message, module? }` | Event |
| `flowio/logs/warn` | `{ timestamp, level, message, module? }` | Event |
| `flowio/logs/error` | `{ timestamp, level, message, module? }` | Event |
| `flowio/alarms/active` | `AlarmEntry[]` | Event |
| `flowio/alarms/history` | `AlarmEntry[]` | Event |
| `flowio/device/config` | `DeviceConfig` | Event |
| `flowio/relays/state` | `RelayState[]` | Event |
| `flowio/inputs/state` | `InputState[]` | Event |

### Commandes (Frontend → Backend)

| Topic | Payload | Description |
|-------|---------|-------------|
| `flowio/cmd/pool/filtration` | `{ on: boolean }` | Filtration |
| `flowio/cmd/pool/chlorine` | `{ on: boolean }` | Chlore |
| `flowio/cmd/pool/ph` | `{ on: boolean }` | pH |
| `flowio/cmd/relay/{1-8}` | `{ on: boolean }` | Relay |
| `flowio/cmd/config/update` | `DeviceConfig` | Config |
| `flowio/cmd/system/reboot` | `{}` | Reboot |
| `flowio/cmd/alarm/ack` | `{ id: string }` | Ack alarm |

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

### Via l'interface web

1. Ouvrir `http://<IP>`
2. Aller dans **Config**
3. Modifier broker/port/auth
4. Sauvegarder → Reconnect auto

### Docker

```yaml
volumes:
  - ./config.json:/usr/share/nginx/html/config.json:ro
```

---

## 🔒 Sé-•curité·§

### Bonnes pratiques

1. **Broker MQTT** :
   - Auth (username/password)
   - TLS (wss://)
   - Firewall

2. **Docker** :
   - Réseaux isolé·§s
   - Updates ré-•gulierement

3. **Config** :
   - `.gitignore` pour `config.json`
   - Rotater credentials

4. **Network** :
   - VLAN IoT
   - Client isolation WiFi

5. **Proxmox LXC** :
   - Containers unprivileged
   - Firewall Proxmox
   - Backups automatiques

### Mosquitto (auth)

```conf
allow_anonymous false
password_file /etc/mosquitto/passwd
mosquitto_passwd -c /etc/mosquitto/passwd mqtt_user
```

---

## 🛠 Dé-•veloppement

```bash
cd frontend
npm install
npm start
npm run build -- --configuration production
```

### Stack

- Angular 20+ (standalone)
- Signals
- OnPush
- TypeScript strict

---

## 📊 Features

- **Dashboard** : Temp, pH, ORP, contrôles
- **System** : Uptime, mémoire, WiFi, MQTT
- **Logs** : INFO, WARN, ERROR (temps réel)
- **Alarms** : Actives, historique, ack
- **Config** : MQTT, device, reboot
- **Relays/Inputs** : Status, contrôles

---

## 🐛 Troubleshooting

### Frontend ne se connecte pas

```bash
cat config.json
docker logs flowio-frontend
docker-compose restart flowio-frontend
```

### MQTT ne fonctionne pas

```bash
docker exec -it mosquitto mosquitto_sub -v -t 'flowio/#'
mosquitto_pub -t 'flowio/cmd/pool/filtration' -m '{"on":true}'
```

### Proxmox LXC

```bash
pct exec 100 -- ufw allow 80
pct exec 100 -- ufw allow 1883
```

---

## 📝 License

MIT

---

## 🤝 Contributing

1. Fork
2. Branche (`feature/xxx`)
3. Commit
4. PR

---

## 📞 Support

- Issues : https://github.com/ben33880/Angularflow/issues
- Discussions : https://github.com/ben33880/Angularflow/discussions

---

## 🖥 Dé-•ploiement

| Plateforme | Guide | Status |
|------------|-------|--------|
| Docker | Quick Start | ✅ |
| Proxmox LXC | `proxmox/README.md` | ✅ |
| Dev local | Quick Start | ✅ |
