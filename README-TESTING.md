# Cooper Cookbook Testing Documentation

This document outlines the test suite for the Cooper Cookbook backend, covering unit and integration tests using **JUnit 5** and **Mockito**.

## Test Suite Overview

| Test Class | Category | Methods Covered | Description |
|:---|:---|:---|:---|
| **`AuthControllerTest`** | Controller | `register`, `login` | Verifies user registration, duplicate username handling, and secure login verification. |
| **`UserServiceTest`** | Service (Mocked) | `getUserByUsername`, `generateResetToken`, `resetPassword` | Tests user retrieval and the complete logic for the password reset flow using Mockito. |
| **`RecipeServiceTest`** | Service (Mocked) | `createRecipe`, `updateRecipe`, `forkRecipe` | Verifies recipe lifecycle management and the logic for cloning public recipes vs. blocking private ones. |
| **`CollectionServiceTest`** | Service (Mocked) | `createCollection`, `addRecipeToCollection`, `getRecipesByCollectionId` | Ensures recipes can be organized into folders and retrieved accurately. |
| **`CooperCookbookApplicationTests`** | System | `contextLoads` | A smoke test to ensure the Spring Boot application context initializes correctly. |

## Detailed Coverage

### 1. Authentication & Security
*   **Success Scenarios:** Valid registration and login with correct BCrypt matching.
*   **Failure Scenarios:** Blocked registration for existing users and rejected login for incorrect passwords.
*   **Reset Flow:** Verifies UUID token generation and expiration-time logic for password recovery.

### 2. Recipe Management
*   **Persistence:** Verifies that saving a recipe correctly handles associated database calls.
*   **Forking Logic:** Ensures that forking a public recipe copies ingredients/steps, while forking a private recipe throws a `RuntimeException`.
*   **Maintenance:** Ensures that updating a recipe correctly clears old associations (ingredients/steps) before saving new ones.

### 3. Collections & Stashing
*   **Organization:** Verifies the linkage between recipes and user-created folders.
*   **Integrity:** Confirms that recipes are retrieved with full metadata (author name, PFP) when viewed within a collection.

## How to Run Tests

Ensure you are in the project root and run:

```bash
./mvnw test
```

*All 15 tests are currently passing as of April 27, 2026.*
