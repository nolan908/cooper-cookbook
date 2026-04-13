# Cooper Cookbook — Demo Script
**ECE-366 Software Engineering & Large Systems Design — Spring 2026**
**Team: Isaac Amar, Isaac Schertz, Nolan Griffith, Alex Valsamis**

---

## Pre-Demo Checklist
- [ ] Docker Desktop is running
- [ ] IntelliJ is closed (port 8080 must be free)
- [ ] Postman is open with `Cooper Cookbook Demo` collection loaded
- [ ] DBeaver is connected to `cookbook_db`

---

## Step 1 — Start the Full Stack
**What to say:** *"With a single command, we can spin up both the PostgreSQL database and the Spring Boot backend."*

```bash
docker-compose up --build
```

**What to show:**
- Terminal output showing `cookbook-db` and `cookbook-app` both starting
- Wait for: `Started CooperCookbookApplication` in the logs

---

## Step 2 — Register a User
**What to say:** *"Users register with their credentials. The password is hashed using bcrypt before being stored — it is never saved as plain text."*

**Postman:**
- Method: `POST`
- URL: `http://localhost:8080/api/auth/register`
- Body (raw JSON):
```json
{
    "username": "demochef",
    "email": "chef@cookbook.com",
    "passwordHash": "cooking123",
    "displayName": "Demo Chef",
    "bio": "I love cooking!"
}
```

**Expected response:**
```
User registered successfully
```

**What to show in DBeaver:** Open the `users` table and show the `password_hash` column is a long bcrypt string, not plain text.

---

## Step 3 — Login and Get a JWT Token
**What to say:** *"When a user logs in with valid credentials, the server returns a JWT token. This token is used to authenticate all future requests."*

**Postman:**
- Method: `POST`
- URL: `http://localhost:8080/api/auth/login`
- Body (raw JSON):
```json
{
    "username": "demochef",
    "password": "cooking123"
}
```

**Expected response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Copy the token** — you will need it for all remaining steps.

---

## Step 4 — Try Accessing Recipes Without a Token
**What to say:** *"All API routes are protected. Without a valid token, the server returns 403 Forbidden."*

**Postman:**
- Method: `GET`
- URL: `http://localhost:8080/api/recipes`
- No Authorization header

**Expected response:**
```
403 Forbidden
```

---

## Step 5 — Access Recipes WITH the Token
**What to say:** *"When we include the JWT token in the Authorization header, the server validates it and returns the data."*

**Postman:**
- Method: `GET`
- URL: `http://localhost:8080/api/recipes`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`

**Expected response:**
```json
[
    {
        "id": 1,
        "title": "Pasta Carbonara",
        ...
    }
]
```

---

## Step 6 — Create a Recipe
**What to say:** *"Authenticated users can create recipes with structured data including title, description, prep time, cook time, servings, and category tags."*

**Postman:**
- Method: `POST`
- URL: `http://localhost:8080/api/recipes`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`
- Body (raw JSON):
```json
{
    "title": "Spaghetti Bolognese",
    "description": "Classic Italian meat sauce pasta",
    "prepTime": 15,
    "cookTime": 45,
    "servings": 4,
    "isPublic": true,
    "categoryTags": "Italian",
    "authorId": 1
}
```

**Expected response:**
```
Recipe created successfully
```

---

## Step 7 — Create a Collection
**What to say:** *"Users can organize their recipes into named collections, like folders for their cookbook."*

**Postman:**
- Method: `POST`
- URL: `http://localhost:8080/api/collections`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`
- Body (raw JSON):
```json
{
    "userId": 1,
    "name": "Italian Favorites",
    "description": "My favorite Italian recipes",
    "orderIndex": 1
}
```

**Expected response:**
```
Collection created successfully
```

---

## Step 8 — Add Recipe to Collection
**What to say:** *"Recipes can be added to collections. A recipe can belong to multiple collections."*

**Postman:**
- Method: `POST`
- URL: `http://localhost:8080/api/collections/1/recipes/1`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`

**Expected response:**
```
Recipe added to collection successfully
```

---

## Step 9 — Save a Recipe
**What to say:** *"Users can save any public recipe to their personal cookbook. Attribution to the original author is preserved in the database."*

**Postman:**
- Method: `POST`
- URL: `http://localhost:8080/api/saved-recipes`
- Headers:
  - `Authorization: Bearer YOUR_TOKEN`
- Body (raw JSON):
```json
{
    "userId": 1,
    "recipeId": 1,
    "originalAuthorId": 1
}
```

**Expected response:**
```
Recipe saved successfully
```

---

## Step 10 — Show the Database in DBeaver
**What to say:** *"All data is persisted in PostgreSQL. Here we can see our relational schema with all 7 tables."*

**What to show:**
1. Open DBeaver → connect to `cookbook_db`
2. Show the **Tables** list: `users`, `recipes`, `ingredients`, `steps`, `collections`, `collection_recipes`, `saved_recipes`
3. Right-click `users` → **View Data** — show the registered user with hashed password
4. Right-click `recipes` → **View Data** — show the created recipes
5. Right-click `saved_recipes` → **View Data** — show attribution is preserved

---

## Architecture Summary
| Layer | Technology |
|---|---|
| Frontend | React + TypeScript (coming Apr 20) |
| Backend | Spring Boot (Java) — REST API |
| Database | PostgreSQL — 7 tables |
| Auth | JWT + bcrypt |
| Infra | Docker + Docker Compose |

---

## API Endpoints Summary
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT token |
| GET | `/api/users` | Get all users |
| GET | `/api/recipes` | Get all recipes |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/{id}` | Update recipe |
| DELETE | `/api/recipes/{id}` | Delete recipe |
| GET | `/api/collections/user/{id}` | Get user collections |
| POST | `/api/collections` | Create collection |
| POST | `/api/collections/{id}/recipes/{recipeId}` | Add recipe to collection |
| POST | `/api/saved-recipes` | Save a recipe |
| GET | `/api/saved-recipes/user/{id}` | Get user's saved recipes |
