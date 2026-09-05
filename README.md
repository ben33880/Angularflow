# Flow.io Angular UI

Application Angular 22+ (standalone, signals, zoneless) pour piloter un contrôleur Flow.io-Waveshare.

## Stack

- **Angular 22+** : standalone components, signals, zoneless
- **HttpClient** + interceptors
- **Stores légers** (pattern signal-based)
- **Docker** (nginx, Node 26) pour le déploiement

## Démarrage local

```bash
cd frontend
npm install
npm start
```

Puis ouvrir http://localhost:4200

## Build Docker

```bash
docker compose up --build
```

Puis ouvrir http://localhost:8080

## Config

É§dite `src/environments/environment.ts` pour mettre l'IP de ton Waveshare.

## Endpoints attendus

- `GET /api/pool/status`
- `POST /api/pool/filtration`
- `POST /api/pool/chlorine`
- `POST /api/pool/ph`
- `GET /api/device/config`
- `POST /api/device/config`
- `GET /api/logs`
- `GET /api/alarms`
- `POST /api/alarms/:id/ack`
- `GET /api/health`

À· adapter selon `WebInterfaceServer.cpp` du firmware.

## Architecture

- **Components** : standalone, OnPush, DestroyRef pour cleanup
- **State** : signals + computed, pas de mutable state
- **Services** : HttpClient, typage fort
- **Stores** : pattern léger (pas de NgRx)

## Best practices

- Zoneless change detection
- Signals partout
- Interceptors pour API prefix + error handling
- Guards pour device connectivity
- Lazy loading des features
