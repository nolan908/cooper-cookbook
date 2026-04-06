# Cooper Cookbook — Frontend

React + TypeScript frontend for the Cooper Cookbook platform.

## Setup

### 1. Add CORS to your backend (one-time)

Copy the two files from the `backend-add/` folder into your Spring Boot project:

- `CorsConfig.java` → `src/main/java/com/cookbook/cookbook/CorsConfig.java`
- `SecurityConfig.java` → **replaces** your existing `src/main/java/com/cookbook/cookbook/SecurityConfig.java`

Then rebuild and restart your backend:

```bash
./mvnw package -DskipTests
docker-compose up --build
```

### 2. Install frontend dependencies

```bash
cd cookbook-frontend
npm install
```

### 3. Run the frontend

```bash
npm run dev
```

The frontend runs on **http://localhost:3000** and proxies all `/api` requests to `http://localhost:8080` (your backend).

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Log in with username/password |
| `/register` | Create a new account |
| `/` | Browse public recipes |
| `/create` | Create a new recipe |
| `/my-recipes` | View all recipes with delete |
| `/collections` | Create/delete collections, add/remove recipes |
| `/saved` | View saved recipes with original author attribution |

## Tech Stack

- **Vite** — build tool
- **React 19** — UI
- **TypeScript** — type safety
- **React Router** — client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Tailwind CSS** — styling
