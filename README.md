# Angularflow

**Angular 22 + MQTT + Tailwind CSS 4**

Application de monitoring de piscine avec interface moderne et temps réel.

---

## 🚀 Installation

### Prérequis
- Node.js 20+
- npm ou yarn
- Broker MQTT (Mosquitto, EMQX, etc.)

### Développement

```bash
cd frontend
npm install
npm start
```

L'application utilise **MockMQTTService** en dev - pas besoin de broker MQTT.

### Production

```bash
cd frontend
npm install
npm run build -- --configuration production
```

Dé§§ployez le contenu de `dist/frontend/` sur votre serveur web.

---

## ⚙️ Configuration

### Environment Dev

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  mockMqtt: true  // true = données simulé§§es, false = vrai MQTT
};
```

### Environment Prod

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  mockMqtt: false  // Toujours false en prod
};
```

### Broker MQTT

Le broker MQTT se configure via `FileConfigService` :

```typescript
// Exemple de config
{
  mqtt: {
    broker: 'localhost',
    port: 9001,
    path: '/mqtt',
    username: '',
    password: ''
  }
}
```

---

## 📡 Topics MQTT

### Subscriptions (Device → Web)

| Topic | Payload |
|-------|---------|
| `flowio/pool/status` | PoolStatus |
| `flowio/pool/temperatures` | PoolTemperatures |
| `flowio/pool/chemistry` | PoolChemistry |
| `flowio/system/status` | SystemStatus |
| `flowio/alarms/active` | AlarmEntry[] |

### Commands (Web → Device)

| Topic | Payload |
|-------|---------|
| `flowio/cmd/pool/filtration` | `{ on: boolean }` |
| `flowio/cmd/pool/chlorine` | `{ on: boolean }` |
| `flowio/cmd/pool/ph` | `{ on: boolean }` |
| `flowio/cmd/relay/{id}` | `{ on: boolean }` |
| `flowio/cmd/system/reboot` | `{}` |

---

## 🛠️ Technologies

- **Angular 22.1.5** - Framework
- **TypeScript 5.9.2** - Langage
- **Tailwind CSS 4.1.12** - Styles
- **MQTT 5.10.0** - Protocole temps réel
- **RxJS 7.8.2** - Programmation réactive
- **Zone.js 0.16.3** - Change detection

---

## 🎯 Features

- ✅ Dashboard temps réel
- ✅ Monitoring température, pH, ORP
- ✅ Contrôle filtration, chlore, pH
- ✅ Système d'alarmes
- ✅ Logs système
- ✅ Mode dev avec données simulé§§es
- ✅ Interface responsive
- ✅ Thè§§me sombre/clair

---

## 🔧 Troubleshooting

### Build échoue

```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur MQTT en prod

1. Vérifier que `mockMqtt: false` dans `environment.prod.ts`
2. Vérifier que le broker MQTT est accessible
3. Vérifier les credentials MQTT dans `FileConfigService`

### Styles cassé§§s

Tailwind CSS 4 nécessite :
- `@import "tailwindcss";` dans `styles.css`
- Pas de `tailwind.config.js`
- Pas de `postcss.config.js`

---

## 📄 License

MIT
