# Deployment Guide

This guide covers deploying the Car Rental Platform to production.

## Backend Deployment

### Option 1: Deploy to Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create a new app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-production-secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret

# Deploy
git push heroku main
```

### Option 2: Deploy to AWS EC2

```bash
# 1. Launch EC2 instance (Ubuntu 20.04)
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Java
sudo apt update
sudo apt install openjdk-17-jdk

# 4. Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# 5. Clone repository
git clone your-repo-url
cd car-rental-platform/backend

# 6. Build JAR
mvn clean package

# 7. Run application
java -jar target/car-rental-backend-1.0.0.jar
```

### Option 3: Deploy to DigitalOcean

```bash
# 1. Create Droplet (Ubuntu 20.04)
# 2. SSH into droplet
ssh root@your-droplet-ip

# 3. Install Java and PostgreSQL
apt update
apt install openjdk-17-jdk postgresql postgresql-contrib

# 4. Clone and deploy
git clone your-repo-url
cd car-rental-platform/backend
mvn clean package
java -jar target/car-rental-backend-1.0.0.jar
```

### Using Docker

Create `Dockerfile` in backend directory:

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/car-rental-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:

```bash
docker build -t car-rental-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/car_rental \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  -e CLOUDINARY_CLOUD_NAME=your_cloud_name \
  -e CLOUDINARY_API_KEY=your_api_key \
  -e CLOUDINARY_API_SECRET=your_api_secret \
  car-rental-backend
```

## Frontend Deployment

### Option 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel
```

### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

### Option 3: Deploy to AWS S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Deploy to GitHub Pages

```bash
# Update vite.config.js
export default {
  base: '/car-rental-platform/',
  // ... rest of config
}

# Build
npm run build

# Deploy to gh-pages branch
npm install --save-dev gh-pages
npx gh-pages -d dist
```

## Environment Variables

### Backend (Production)

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/car_rental
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-very-secure-random-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend (Production)

```bash
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Database Migration

### Backup Production Database

```bash
pg_dump -U postgres car_rental > backup.sql
```

### Restore Database

```bash
psql -U postgres car_rental < backup.sql
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d your-domain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/default

# Add SSL configuration
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
```

## Monitoring & Logging

### Backend Logging

```properties
# application.properties
logging.level.root=INFO
logging.level.com.carrental=DEBUG
logging.file.name=logs/application.log
logging.file.max-size=10MB
logging.file.max-history=10
```

### Frontend Error Tracking

Add Sentry or similar service:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

## Performance Optimization

### Backend
- Enable caching
- Use connection pooling
- Optimize database queries
- Enable gzip compression

### Frontend
- Minify and bundle code
- Lazy load components
- Optimize images
- Use CDN for static assets

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS/SSL
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Use strong database passwords
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security updates

## Troubleshooting

### Backend won't start
- Check logs: `tail -f logs/application.log`
- Verify database connection
- Check environment variables

### Frontend not loading
- Check browser console for errors
- Verify API base URL
- Check CORS configuration

### Images not uploading
- Verify Cloudinary credentials
- Check API limits
- Review Cloudinary dashboard

## Rollback Procedure

```bash
# Backend
git revert <commit-hash>
mvn clean package
java -jar target/car-rental-backend-1.0.0.jar

# Frontend
git revert <commit-hash>
npm run build
# Redeploy to hosting
```

## Support

For deployment issues, refer to the main README.md or create an issue in the repository.

---

**Last Updated**: May 2026
