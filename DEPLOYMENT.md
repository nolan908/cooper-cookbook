# Cooper Cookbook Free Deployment

This setup keeps the app deployable on free tiers:

- Frontend: Vercel static React app from `cookbook-frontend`
- Backend: Render free web service from the repo root Dockerfile
- Database: Supabase or Neon Postgres free tier

## 1. Create Postgres

Create a free Postgres database in Supabase or Neon. Copy the host, database, user, and password.

The Spring API expects a JDBC URL:

```text
jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
```

## 2. Deploy the Backend on Render

Create a new Render web service from this repo, using the repo root.

Use the included `render.yaml` blueprint or these settings:

- Runtime: Docker
- Plan: Free
- Dockerfile: `./Dockerfile`
- Health check path: `/api/recipes/public`

Set these Render environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:5432/DATABASE?sslmode=require
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
JWT_SECRET=long-random-secret
FRONTEND_URL=https://your-cookbook-frontend.vercel.app
APP_FRONTEND_URL=https://your-cookbook-frontend.vercel.app
```

After deploy, copy the Render URL, for example:

```text
https://cooper-cookbook-api.onrender.com
```

## 3. Deploy the Frontend on Vercel

Import this repo into Vercel and set the project root directory to:

```text
cookbook-frontend
```

Set:

```text
VITE_API_BASE_URL=https://cooper-cookbook-api.onrender.com/api
```

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

## 4. Update the Portfolio

In the portfolio deployment, set:

```text
NEXT_PUBLIC_COOPER_COOKBOOK_URL=https://your-cookbook-frontend.vercel.app
```

That makes the portfolio iframe use the deployed cookbook app instead of `localhost:3001`.

## Free Tier Notes

Render free web services sleep after inactivity, so the first API request can be slow.
Do not use Render free Postgres for lasting data; it expires after 30 days.
