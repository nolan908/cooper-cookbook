# Cooper Cookbook

### Project Overview
Cooper Cookbook is a community-led documentation platform designed for recipes. The website allows users to discover recipes, maintain a personal inventory of favorites, and collaborate through a unique revision system.

As of early March 2026, this project is developed by Alex Valsamis and Nolan Griffith. Due to change in teamwork structure, documentation via Projects and pull requests via personal branches of each team member were used.

### Aim
The primary aim of Cooper Cookbook is to provide a digital catalog where culinary assets can be stashed, organized, and shared. By allowing users to "fork" or "clone" recipes, the platform encourages the natural evolution of dishes while maintaining clear attribution to the original authors.

### Progress

The current progress is logged in "Projects" in the Cooper Cookbook Progress Log. When we finish tasks, we move the issue to its respective category (In Progress, Done, etc.).

This project was partially made with use of Gemini CLI tools. 


### Core Features
The current version (v3.4.0) includes the following functionality:

*   **User Authentication:** Complete Sign In and Sign Up flows with secure BCrypt password hashing.
*   **My Kitchen:** A dedicated space for users to manage their original culinary creations.
*   **The Stash:** A personal inventory system for recipes saved from the broader community.
*   **Integrated Collections:** A simplified organizational system located directly within the Stash tab, allowing users to sort stashed recipes into curated folders.
*   **Recipe Management:** 
    *   **Editing:** Full control over your own recipes, including titles, descriptions, ingredients, and preparation steps.
    *   **Forking (Clone & Revise):** Create personal, editable copies of community recipes. The system automatically maintains a lineage record, noting the previous user who authored the recipe.
    *   **Stashing:** One-click saving of recipes to your personal inventory.
*   **Search:** A keyword-based search feature to filter the recipe catalog by string. Additional filtering is possible if enough time permits, however not required.
*   **Security Tools:** 
    *   **Change Password:** Secure update flow requiring current password verification.
    *   **Forgot Password:** A simulation system that generates a local reset link in the backend console logs, representing an email sent to the user's registered Gmail address. The "forgot password" option via email address is still a work in progress; the "forgot password" option when already logged in still works.

---

### Technical Details & Setup

The application is built using a Spring Boot backend, a React/TypeScript frontend, and a PostgreSQL database.

#### Quick Start (Docker)
Ensure Docker Desktop is running, then execute:
```bash
docker compose up -d --build
```
Access the UI at: **http://localhost:5173**

#### Initial State
Upon first entry, the system is pre-populated with:
*   Two demo users: `user1` (password: `password1`) and `user2` (password: `password2`).
*   Three community recipes authored by the demo users.
*   One initialized collection ("Summer Pantry") which starts empty. 

---

### Testing Framework
The application logic is protected by a comprehensive test suite covering both Backend (JUnit 5, Mockito) and Frontend (Vitest, React Testing Library).

| Category | Tools | Coverage |
|:---|:---|:---|
| **Backend** | JUnit 5, Mockito, JaCoCo | ~100% Logic (Controllers, Services, Repositories) |
| **Frontend** | Vitest, RTL, JSDOM | ~100% Critical Components (Navbar, RecipeCard, TagInput) |
| **Database** | H2 (In-Memory) | Verified Integration & Key Generation |

Detailed test documentation and limit-testing strategies are available in [README-TESTING.md](./README-TESTING.md).

---

### Future Development
The final version of Cooper Cookbook will include a comprehensive landing page with detailed instructions on how to maximize the platform's features.

2026 Alex Valsamis & Nolan Griffith 
