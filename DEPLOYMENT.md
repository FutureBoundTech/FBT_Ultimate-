# FBT Finance - Deployment Guide

This guide explains how to deploy the FBT Finance application with:
- **Backend**: Google Cloud App Engine
- **Frontend**: Vercel

## Prerequisites

1. Google Cloud account with billing enabled
2. Vercel account (free tier works)
3. MongoDB Atlas account (or use existing MongoDB)
4. Google Cloud SDK installed locally

## Backend Deployment (Google Cloud App Engine)

### 1. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster (if not already done)
2. Whitelist Google Cloud IPs in Atlas Network Access:
   - For App Engine: Add `0.0.0.0/0` (all IPs) or use VPC peering
3. Get your connection string

### 2. Update app.yaml

Edit `app.yaml` and update:
```yaml
env_variables:
  MONGODB_URI: "your-mongodb-connection-string"
  CORS_ORIGIN: "https://your-vercel-app.vercel.app"
```

### 3. Deploy to App Engine

```bash
# Initialize gcloud (first time only)
gcloud init

# Create an App Engine app (first time only)
gcloud app create

# Deploy
gcloud app deploy

# View logs
gcloud app logs tail -s default
```

Your backend will be available at: `https://YOUR-PROJECT-ID.appspot.com`

## Frontend Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://YOUR-PROJECT-ID.appspot.com/api`
6. Click "Deploy"

### 3. Update CORS (Important!)

After Vercel deployment, update your `app.yaml` in Google Cloud:

```yaml
env_variables:
  CORS_ORIGIN: "https://your-app.vercel.app,https://your-app-git-main-username.vercel.app"
```

Then redeploy:
```bash
gcloud app deploy
```

## Environment Variables Summary

### Backend (Google Cloud - app.yaml)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | Server port (auto-set by App Engine) | `3001` |
| `CORS_ORIGIN` | Allowed frontend origins | `https://app.vercel.app` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://project-id.appspot.com/api` |

## Testing Deployment

1. Test backend health: `https://YOUR-PROJECT-ID.appspot.com/api/clients`
2. Test frontend: Visit your Vercel URL
3. Test login with default credentials:
   - Admin: `admin@futurebound.tech` / `admin123`
   - Sales: `sales1@fbt.com` / `sales123`
   - Agent: `sarah@fbt.com` / `agent123`

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGIN` in `app.yaml` includes your Vercel URL
- Redeploy backend after updating

### MongoDB Connection Issues
- Check IP whitelist in Atlas
- Verify connection string format
- Check Atlas cluster is running

### Build Failures
- Check Node.js version compatibility
- Run `npm install` locally to verify dependencies

## Cost Estimates

### Google Cloud App Engine (Free Tier)
- 28 frontend instance hours/day
- 1GB storage
- Suitable for low-traffic applications

### Vercel (Free Tier)
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### MongoDB Atlas (Free Tier)
- 512MB storage
- Shared cluster
- Good for development/testing

## Production Checklist

- [ ] Update MongoDB connection string with secure credentials
- [ ] Set strong passwords for default users
- [ ] Enable MongoDB Atlas IP access list restrictions
- [ ] Configure custom domain in Vercel
- [ ] Set up monitoring and alerts
- [ ] Enable MongoDB Atlas backups
- [ ] Review and rotate sensitive credentials