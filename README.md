# 🐟 COOPER × COOKBOOK

### Artisanal community-led documentation of culinary heritage. Fresh from the source.

Cooper Cookbook is a premium digital anthology for curated recipes, designed with a focus on community exchange and high-end specialty food aesthetics. Built with a Spring Boot backend and a React/TypeScript frontend, it offers a robust platform for chefs to stash, organize, and revise their favorite culinary assets.

---

## 🚀 Quick Start (Docker)

The fastest way to get the full stack running is using Docker Compose. Ensure you have Docker installed, then run:

```bash
# Clone the repository
git clone https://github.com/nolan908/cooper-cookbook.git
cd cooper-cookbook

# Spin up the entire ecosystem (Database, Backend, UI)
docker compose up -d --build
```

Access the application at: **[http://localhost:5173](http://localhost:5173)**

---

## 🛠 Tech Stack

*   **Frontend:** React 19, TypeScript, Vite, Tailwind CSS (Fishwife-inspired theme)
*   **Backend:** Java 21, Spring Boot 3.5, Maven
*   **Database:** PostgreSQL 15
*   **Testing:** JUnit 5, Mockito (Unit & Service logic)
*   **Security:** JWT-based authentication with BCrypt password hashing

---

## ✨ Key Features

-   **The Stash:** A personal inventory system for handpicked recipes from the community.
-   **Collections Sidebar:** Integrated folder management that allows you to organize your stashed items into curated sets.
-   **Smart Forking:** Clone community recipes while maintaining attribution to the original author.
-   **Complete Recipe Lifecycle:** Full control over ingredients, preparation steps, and public/private visibility.
-   **Secure Account Management:** Multi-step verification for sensitive account changes.
-   **High-Contrast UI:** Industrial-chic design featuring the **Fraunces** editorial typeface.

---

## 🧪 Testing

We maintain a rigorous test suite protecting core logic. To run the backend tests:

```bash
./mvnw test
```
Refer to [README-TESTING.md](./README-TESTING.md) for a detailed breakdown of coverage.

---

## 👤 Demo Access

The database is pre-seeded with two demo accounts for testing:

| Username | Password |
| :--- | :--- |
| `user1` | `password1` |
| `user2` | `password2` |

---

© 2026 COOPER COOKBOOK | Version 3.4.0
