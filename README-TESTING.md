# Testing Documentation — Cooper Cookbook
**ECE-366 Spring 2026 | Unit Testing Suite**

This project utilizes **Unit Testing** to ensure business logic integrity, security, and data consistency. By using **JUnit 5** and **Mockito**, we validate the "brain" of the application in isolation without requiring a live database connection.

---

## 🛠️ Testing Stack
- **JUnit 5 (Jupiter)**: Core framework for defining tests and assertions.
- **Mockito**: Used for mocking Repository dependencies and verifying service-layer interactions.
- **Spring Boot Test**: Used for application context validation.

---

## 📋 Unit Test Suite Summary

The following 10 tests are implemented and passing:

| Category | Test Class | Test Case | Purpose / Logic Checked |
| :--- | :--- | :--- | :--- |
| **Recipes** | `RecipeServiceTest` | `testForkRecipeSuccess` | Verifies that forking a public recipe copies data correctly and triggers ingredient/step copying. |
| **Recipes** | `RecipeServiceTest` | `testForkRecipePrivateFail` | **Security Check:** Ensures private recipes cannot be forked (throws `RuntimeException`). |
| **Recipes** | `RecipeServiceTest` | `testCreateRecipe` | Confirms the Service correctly passes a new recipe to the Repository for saving. |
| **Users** | `UserServiceTest` | `testGetUserByUsername` | Verifies that a user can be successfully retrieved from the database by their username. |
| **Users** | `UserServiceTest` | `testCreateUser` | **Business Rule:** Ensures every new user is automatically assigned the `"USER"` role. |
| **Auth** | `AuthControllerTest` | `testRegisterSuccess` | Confirms new users can register and receive a `200 OK` response. |
| **Auth** | `AuthControllerTest` | `testRegisterFailExists` | **Validation:** Ensures registration is blocked if the username is already taken (`400 Bad Request`). |
| **Auth** | `AuthControllerTest` | `testLoginSuccess` | Verifies that correct credentials return a valid JWT token for the user. |
| **Auth** | `AuthControllerTest` | `testLoginInvalidPassword` | **Security:** Ensures login fails with a `400` status if the password does not match the encrypted hash. |
| **System** | `CooperCookbookApplicationTests` | `contextLoads` | **Sanity Check:** Ensures the Spring Boot application starts and the context loads without errors. |

---

## 🚀 Running the Tests

To execute the test suite in your local environment, run:

```bash
./mvnw test
```

To run a specific test class (e.g., Recipe logic):

```bash
./mvnw test -Dtest=RecipeServiceTest
```

---

## 🧠 Why Mocking?
We use Mockito to "mock" the Repositories. This allows us to test the **Service Layer** logic (like security checks and role assignments) without needing the PostgreSQL Docker container to be running. It makes the tests extremely fast and deterministic.
