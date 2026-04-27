# Cooper Cookbook

### Project Overview
Cooper Cookbook is a community-led documentation platform designed for the preservation and evolution of culinary heritage. The website allows users to discover artisanal recipes, maintain a personal inventory of favorites, and collaborate through a unique revision system.

As of early March 2026, this project is developed by Alex Valsamis and Nolan Griffith.

---

### Aim
The primary aim of Cooper Cookbook is to provide a digital catalog where culinary assets can be stashed, organized, and shared. By allowing users to "fork" or "clone" recipes, the platform encourages the natural evolution of dishes while maintaining clear attribution to the original authors.

---

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
*   **Search:** A keyword-based search feature to filter the recipe catalog by string.
*   **Security Tools:** 
    *   **Change Password:** Secure update flow requiring current password verification.
    *   **Forgot Password:** A simulation system that generates a local reset link in the backend console logs, representing an email sent to the user's registered Gmail address.

---

### Technical Details & Setup

The application is built using a Spring Boot backend, a React/TypeScript frontend, and a PostgreSQL database.

#### Quick Start (Docker)
Ensure Docker is running, then execute:
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
The backend logic is protected by a suite of 15 automated tests.

| Test Class | Category | Methods Covered | Description |
|:---|:---|:---|:---|
| **AuthControllerTest** | Controller | register, login | Verifies registration, duplicate handling, and secure login. |
| **UserServiceTest** | Service | getUser, generateToken, resetPassword | Tests user retrieval and the simulated password recovery flow. |
| **RecipeServiceTest** | Service | create, update, fork | Verifies recipe lifecycles and the "Clone & Revise" logic. |
| **CollectionServiceTest** | Service | create, addRecipe, getRecipes | Ensures stashed recipes can be organized into folders. |
| **ApplicationTests** | System | contextLoads | Ensures the Spring Boot context initializes correctly. |

For more detailed information, see [README-TESTING.md](./README-TESTING.md).

---

### Future Development
The final version of Cooper Cookbook will include a comprehensive landing page with detailed instructions on how to maximize the platform's features.

© 2026 Alex Valsamis & Nolan Griffith | Version 3.4.0
