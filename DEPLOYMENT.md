# AEM Visual Portal - Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- 2GB free RAM
- Ports 3000 and 4000 available

### Deploy with Docker Compose

```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

---

## Deployment Options

### Option 1: Docker Compose (Recommended for Prototype)

**Advantages:**
- Single command deployment
- Isolated environment
- Easy to reproduce
- Works on any platform

**Steps:**
```bash
# Clone repository
git clone <repository-url>
cd AEM-Visual-Library

# Build and deploy
docker-compose up -d --build

# Access application
open http://localhost:3000
```

---

### Option 2: Cloud Deployment (Production)

#### Frontend (Vercel)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel --prod
```

3. **Environment Variables:**
```
NEXT_PUBLIC_API_URL=<your-backend-url>
```

#### Backend (Railway/Render/Fly.io)

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Render:**
1. Connect GitHub repository
2. Select backend folder
3. Set build command: `npm run build:backend`
4. Set start command: `npm run start -w backend`

---

### Option 3: Manual Deployment

#### Backend

```bash
# Build
npm run build:backend

# Start
cd backend
PORT=4000 npm start
```

#### Frontend

```bash
# Build shared package
npm run build -w shared

# Build frontend
cd frontend
npm run build

# Start
npm start
```

---

## Environment Configuration

### Backend (.env)
```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
USE_MOCK_DATA=true
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## Health Checks

### Backend Health
```bash
curl http://localhost:4000/health
# Expected: {"status":"ok","timestamp":"...","environment":"production"}
```

### Frontend Health
```bash
curl http://localhost:3000
# Expected: HTML response
```

---

## Monitoring

### View Docker Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Resource Usage
```bash
docker-compose stats
```

---

## Scaling

### Horizontal Scaling
```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

### Load Balancer (Nginx)
Add nginx service to docker-compose.yml for load balancing.

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Docker Build Issues
```bash
# Clean build
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Application Not Starting
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart
```

---

## Production Checklist

- [ ] Set NODE_ENV=production
- [ ] Configure CORS origins
- [ ] Set up HTTPS/SSL certificates
- [ ] Enable rate limiting
- [ ] Configure logging/monitoring
- [ ] Set up database (replace mock data)
- [ ] Implement authentication
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Configure error tracking (Sentry)

---

## Performance Optimization

### Frontend
- Enable Next.js image optimization
- Configure CDN for static assets
- Enable response compression
- Implement caching strategies

### Backend
- Enable response caching
- Implement connection pooling
- Use Redis for session storage
- Configure rate limiting

---

## Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backup Data
```bash
# Export component data
curl http://localhost:4000/api/components > backup.json
```

### Clean Up
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review health endpoints
3. Verify environment variables
4. Check network connectivity

---

## License

[Your License Here]
