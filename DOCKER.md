# PasteParty Docker Quick Reference

## Prerequisites

- Docker Desktop for Windows installed and running
- No other software using port 8081

## Quick Start

```bash
# Start PasteParty
docker compose up -d

# Your server is now running!
# Local:   http://localhost:8081
# Network: http://YOUR-IP:8081
```

## Management Commands

```bash
# Stop PasteParty
docker compose down

# Restart PasteParty
docker compose restart

# View logs (live)
docker compose logs -f

# View recent logs
docker compose logs --tail=50

# Check status
docker ps

# Rebuild after changes
docker compose up -d --build
```

## Data Persistence

All your pastes are stored in `./data` folder on your host machine. This means:
- Data survives container restarts
- You can backup by copying the `./data` folder
- Data is immediately accessible from Windows Explorer

## Networking

Docker Desktop automatically:
- Creates firewall rules for port 8081
- Makes the service accessible on your LAN
- Handles port forwarding

**No manual firewall configuration needed!**

To find your network IP:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (e.g., 192.168.1.100)

## Auto-Start on Boot

The container is configured with `restart: unless-stopped`, which means:
- Starts automatically when Docker Desktop starts
- Restarts if it crashes
- Only stops when you explicitly stop it

To ensure it starts on Windows boot:
1. Open Docker Desktop settings
2. Enable "Start Docker Desktop when you log in"

## Updating

When you make changes to the code:

```bash
# Rebuild and restart
docker compose up -d --build

# Or rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

## Troubleshooting

### Port already in use
```bash
# Check what's using port 8081
netstat -ano | findstr :8081

# Stop the container
docker compose down

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Container won't start
```bash
# View error logs
docker compose logs

# Remove and recreate
docker compose down
docker compose up -d
```

### Can't access from network
1. Check Docker Desktop is running
2. Verify your IP: `ipconfig`
3. Try from another device: `http://YOUR-IP:8081`
4. Check Windows Firewall (should be auto-configured by Docker)

### Data not persisting
- Data is in `./data` folder relative to docker-compose.yml
- Check volume mount: `docker inspect pasteparty`
- Verify folder exists and has write permissions

## Advanced Configuration

### Change Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "9000:8081"  # Access on port 9000 instead
```

Then restart:
```bash
docker compose down
docker compose up -d
```

### Change Timezone

Edit `docker-compose.yml`:
```yaml
environment:
  - TZ=America/New_York  # Change to your timezone
```

Available timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

### Resource Limits

Add to service definition in `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

## Cleanup

```bash
# Stop and remove container
docker compose down

# Remove container and image
docker compose down --rmi all

# Remove container, image, and volumes
docker compose down --rmi all --volumes
```

## Using with Android Companion App

When configuring the Android app:
1. Find your computer's IP: `ipconfig`
2. Use format: `http://192.168.1.100:8081` (replace with your IP)
3. Make sure your Android device is on the same network
4. Docker automatically allows LAN access

## Why Docker?

- **Simple Installation**: One command to start (`docker compose up -d`)
- **Automatic Firewall**: No manual Windows Firewall configuration needed
- **Auto-restart**: Starts automatically on boot via Docker Desktop
- **Clean Uninstall**: Remove everything with `docker compose down --rmi all`
- **Consistent Environment**: Works the same on any machine
- **Isolated**: Doesn't interfere with other software

## Questions?

Check the main [README.md](README.md) for more information.
