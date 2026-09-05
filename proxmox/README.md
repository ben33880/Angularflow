# Proxmox LXC Template

Template pour déployer Flow.io dans un container LXC Proxmox.

## Installation

### 1. Créer le container LXC

**Via l'interface web :**
- CT ID : `100` (ou autre)
- Template : `debian-12-standard` (Bookworm)
- Root Disk : `4 GB` minimum
- Memory : `512 MB` minimum
- Swap : `0 MB`
- CPU : `1 core` minimum
- Network : Bridge `vmbr0`, IPv4 DHCP

**Via CLI :**
```bash
pct create 100 local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst \
  --rootfs local-lvm:4 \
  --memory 512 \
  --swap 0 \
  --cores 1 \
  --net0 name=eth0,bridge=vmbr0,ip=dhcp \
  --hostname flowio \
  --password yourpassword \
  --unprivileged 1
```

### 2. Monter le script d'install

```bash
# Copier le script dans le storage LXC
cp install-flowio.sh /var/lib/vz/snippets/

# Ou via SCP
scp install-flowio.sh root@proxmox:/var/lib/vz/snippets/
```

### 3. Exé§°cuter le script

```bash
# Lancer l'install dans le container
pct exec 100 -- bash -c "$(cat install-flowio.sh)"

# Ou se connecter et lancer manuellement
pct enter 100
bash /var/lib/vz/snippets/install-flowio.sh
```

### 4. Configurer

```bash
# Entrer dans le container
pct enter 100

# Modifier la config MQTT
cd /opt/flowio
nano config.json

# Lancer Flow.io
docker-compose up -d
```

### 5. Accé§°der

- Frontend : `http://<IP_LXC>:80`
- MQTT : `ws://<IP_LXC>:1883/mqtt`

---

## Script d'installation

Le script `install-flowio.sh` :
1. Met à jour le système
2. Installe Docker + Docker Compose
3. Clone le repo Flow.io
4. Configure le firewall (optionnel)
5. Active le service au boot

---

## Configuration recommandé§°e

| Ressource | Minimum | Recommandé§° |
|-----------|---------|-------------|
| CPU       | 1 core  | 2 cores      |
| RAM       | 512 MB  | 1 GB         |
| Disk      | 4 GB    | 8 GB         |
| Network   | Bridge  | Bridge       |

---

## Backup

```bash
# Backup du container
pct backup 100

# Restore
pct restore 100 /var/lib/vz/dump/vzdump-100.tar.zst
```

---

## Update

```bash
# Entrer dans le container
pct enter 100

# Pull et restart
cd /opt/flowio
git pull
docker-compose down
docker-compose up -d --build
```

---

## Troubleshooting

### Container ne démarre pas
```bash
# Vérifier logs
pct status 100
pct start 100
```

### Docker ne fonctionne pas
```bash
# Vérifier service
pct exec 100 -- systemctl status docker

# Restart
pct exec 100 -- systemctl restart docker
```

### Ports non accessibles
```bash
# Vérifier firewall
pct exec 100 -- ufw status

# Ouvrir ports
pct exec 100 -- ufw allow 80
pct exec 100 -- ufw allow 1883
```

---

## Notes

- Container **unprivileged** recommandé pour la sécurité
- Utiliser `local-lvm` pour de meilleures perfs
- Activer les backups automatiques dans Proxmox
- Monitorer les ressources avec `pct enter 100 && htop`
