# Angularflow

**Angular 22 + MQTT + Tailwind CSS 4** - Dashboard de monitoring pour piscine FlowIO

[![Angular](https://img.shields.io/badge/Angular-22.1.5-DD0031?style=flat&logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.12-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![MQTT](https://img.shields.io/badge/MQTT-5.10.0-660066?style=flat&logo=mqtt)](https://mqtt.org)

---

## 🚀 Features

- ✅ **Angular 22.1.5** - Dernière version LTS
- ✅ **Signaux** - Réactivité¹¹ moderne (plus de Zone.js)
- ✅ **MockMQTT** - Mode dev sans broker
- ✅ **Tailwind CSS 4** - Utilitaires CSS
- ✅ **TypeScript strict** - Typage fort
- ✅ **Production-ready** - Optimisé²²

---

## 📋 Prérequis

- Node.js 20.x ou supérieur
- npm 10.x ou supérieur
- Broker MQTT (Mosquitto, EMQX, etc.) - pour la prod

---

## 🔧 Installation

### 1. Cloner le repo

```bash
git clone https://github.com/ben33880/Angularflow.git
cd Angularflow/frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer en dev

```bash
npm start
```

**Ouvre :** http://localhost:4200

---

## ⚙️ Configuration

### Mode Dev (MockMQTT)

Par défaut, le dev utilise des **donnees simulé³³** (pas besoin de broker MQTT).

**Fichier :** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  mockMqtt: true  // true = données simulé³³
};
```

### Mode Prod (Vrai MQTT)

**Fichier :** `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  mockMqtt: false  // false = vrai broker MQTT
};
```

### Configuration MQTT

**Broker requis :**
- Protocole : WebSocket (`ws://`)
- Port : `9001` (par défaut)
- Path : `/mqtt`

**Topics souscrits :**

| Topic | Type | Description |
|-------|------|-------------|
| `flowio/pool/status` | PoolStatus | Status piscine (temp, pH, ORP) |
| `flowio/pool/temperatures` | PoolTemperatures | Temp (bassin, retour, equipement, ext) |
| `flowio/pool/chemistry` | PoolChemistry | Chimie (pH, ORP) |
| `flowio/system/status` | SystemStatus | Status système |
| `flowio/system/uptime` | SystemUptime | Uptime |
| `flowio/system/memory` | SystemMemory | Mémoire |
| `flowio/system/wifi` | SystemWifi | WiFi (RSSI, SSID) |
| `flowio/system/mqtt` | SystemMqtt | MQTT (connected, broker) |
| `flowio/logs/info` | LogEntry | Logs info |
| `flowio/logs/warn` | LogEntry | Logs warn |
| `flowio/logs/error` | LogEntry | Logs error |
| `flowio/alarms/active` | AlarmEntry[] | Alarmes actives |
| `flowio/device/config` | DeviceConfig | Config appareil |
| `flowio/relays/state` | RelayState[] | Status relais |
| `flowio/inputs/state` | InputState[] | Status entré³³ |

**Topics publi (commandes) :**

| Topic | Payload | Description |
|-------|---------|-------------|
| `flowio/cmd/pool/filtration` | `{ on: boolean }` | Filtration ON/OFF |
| `flowio/cmd/pool/chlorine` | `{ on: boolean }` | Chlore ON/OFF |
| `flowio/cmd/pool/ph` | `{ on: boolean }` | pH dosing ON/OFF |
| `flowio/cmd/relay/{id}` | `{ on: boolean }` | Relais {id} ON/OFF |
| `flowio/cmd/config/update` | `DeviceConfig` | Màj config |
| `flowio/cmd/system/reboot` | `{}` | Reboot système |
| `flowio/cmd/alarm/ack` | `{ id: string }` | Ack alarme |

---

## 🏗️ Build Production

### 1. Build

```bash
npm run build -- --configuration production
```

**Output :** `dist/frontend/`

### 2. Déployer

**Option 1 : Nginx**

```nginx
server {
    listen 80;
    server_name ton-domaine.com;
    root /var/www/angularflow;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
```

**Option 2 : Docker**

```dockerfile
FROM nginx:alpine
COPY dist/frontend/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Option 3 : Firebase Hosting**

```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## 🧪 Tests

### Unitaires

```bash
npm test
```

### E2E (Playwright)

```bash
npm install -D @playwright/test
npx playwright install
npx playwright test
```

---

## 🐛 Troubleshooting

### Probl : Build échoue

```bash
# Nettoyer cache
rm -rf node_modules package-lock.json
npm install
npm run build -- --configuration production
```

### Probl : WebSocket MQTT ne connecte pas

**Vrifier :**
1. Broker MQTT accepte WebSocket (port 9001)
2. CORS activé²² sur broker
3. Firewall autorise port 9001

**Test :**
```bash
# Avec mosquitto
mosquitto_sub -h localhost -p 9001 -t 'flowio/#' -v
```

### Probl : Styles cassé²² après Tailwind 4

Tailwind 4 utilise `@import "tailwindcss"` (plus de `@tailwind`).

**Fichier :** `src/styles.css`

```css
@import "tailwindcss";
```

### Probl : MockMQTT toujours actif en prod

**Vrifier :** `environment.prod.ts`

```typescript
export const environment = {
  production: true,
  mockMqtt: false  // ← Doit tre false
};
```

**Build :**
```bash
npm run build -- --configuration production
```

---

## 📁 Structure

```
Angularflow/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/
│   │   │   │   └── dashboard/      # Dashboard component
│   │   │   ├── services/
│   │   │   │   ├── mqtt.service.ts        # Service MQTT
│   │   │   │   ├── mock-mqtt.service.ts   # Mock pour dev
│   │   │   │   ├── mqtt.provider.ts       # Factory provider
│   │   │   │   ├── logger.service.ts      # Logger
│   │   │   │   └── file-config.service.ts # Config
│   │   │   ├── models/
│   │   │   │   └── flowio.models.ts       # Types
│   │   │   ├── shared/
│   │   │   │   └── ui/                   # Components UI
│   │   │   ├── app.config.ts             # Config app
│   │   │   └── app.routes.ts             # Routes
│   │   ├── environments/
│   │   │   ├── environment.ts            # Dev
│   │   │   └── environment.prod.ts       # Prod
│   │   ├── styles.css                    # Tailwind 4
│   │   └── main.ts
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🔒 Sécurité

### Production Checklist

- ✅ Activer HTTPS
- ✅ Authentifier MQTT (username/password)
- ✅ Rate limiting sur commandes
- ✅ Valider inputs utilisateur
- ✅ CORS restreint
- ✅ Headers de sécurité (CSP, X-Frame-Options)

### Exemple nginx.conf

```nginx
server {
    listen 443 ssl http2;
    server_name ton-domaine.com;

    ssl_certificate /etc/ssl/certs/ton-cert.pem;
    ssl_certificate_key /etc/ssl/private/ton-key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📊 Performance

### Bundle Size

```bash
npm install -D webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json
```

### Optimisations

- ✅ `OnPush` change detection
- ✅ Lazy loading des features
- ✅ Tree-shaking
- ✅ AOT compilation
- ✅ Production build optimisé²²

---

## 🤝 Contributing

1. Fork
2. `git checkout -b feature/ma-feature`
3. Commit
4. Push
5. PR

---

## 📄 License

MIT - Voir `LICENSE`

---

## 📞 Support

- Issues : https://github.com/ben33880/Angularflow/issues
- Email : benj.moreau33@gmail.com

---

**Dé²² avec ❤️ par ben33880**
