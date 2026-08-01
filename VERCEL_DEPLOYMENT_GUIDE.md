# Vercel Deployment Guide - Kiran Charitable Trust

This repository has been fully configured for 1-click deployment on **Vercel**.

---

## 🚀 Option 1: Monorepo Deployment (Recommended)

When you connect your GitHub repository to Vercel, Vercel will automatically detect the configuration in `vercel.json` and deploy both the **React Frontend** and **Node/Express Backend API**.

### Steps:
1. Push this project repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" -> "Project"**.
3. Import your GitHub repository.
4. Leave Framework Preset as **Other** (or **Vite**).
5. In **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/kiran-trust?retryWrites=true&w=gzip` (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: `your_random_jwt_secret_key`
6. Click **Deploy**.

---

## ⚡ Option 2: Deploy Frontend & Backend Separately

If you prefer to deploy the Frontend and Backend as two separate Vercel projects:

### 1. Backend Project:
- Root Directory: `backend`
- Environment Variables:
  - `MONGO_URI`: Your MongoDB Atlas URI
- Click **Deploy** -> Copy your Backend Vercel URL (e.g. `https://kiran-trust-backend.vercel.app`)

### 2. Frontend Project:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: `https://kiran-trust-backend.vercel.app/api`
- Click **Deploy**.

---

## 🛠️ Code Changes Made for Vercel
- **Centralized API Config**: Created `frontend/src/config.js` with `API_BASE_URL` support.
- **Dynamic Endpoints**: Updated `Contact.jsx`, `Donate.jsx`, `Volunteers.jsx` to use relative `/api` paths (no hardcoded `localhost:5000`).
- **Serverless Backend**: Updated `backend/server.js` with serverless Mongoose connection pooling and module exports.
- **API Entrypoint**: Created `api/index.js` for Vercel Serverless Function routing.
- **Vite Local Proxy**: Configured `frontend/vite.config.js` to proxy `/api` requests to `http://localhost:5000` during local development.
