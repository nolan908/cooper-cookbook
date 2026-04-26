# Backend Testing - JUnit & Mockito

This suite covers the core logic for recipes, users, and auth. We're using **JUnit 5** and **Mockito** so we can test the service layer without needing the database or Docker running.

## Current Test Suite

| Class | Test | Description |
| :--- | :--- | :--- |
| `RecipeServiceTest` | `testForkRecipeSuccess` | Checks that forking a public recipe copies all data and triggers ingredient/step migration. |
| `RecipeServiceTest` | `testForkRecipePrivateFail` | Verifies that private recipes can't be forked (throws exception). |
| `RecipeServiceTest` | `testCreateRecipe` | Basic check for saving recipes. |
| `UserServiceTest` | `testGetUserByUsername` | Confirms user lookup by username works. |
| `UserServiceTest` | `testCreateUser` | Confirms all new users are defaulted to the "USER" role. |
| `AuthControllerTest` | `testRegisterSuccess` | Checks that new users can register correctly. |
| `AuthControllerTest` | `testRegisterFailExists` | Checks that duplicate usernames are blocked (400 error). |
| `AuthControllerTest` | `testLoginSuccess` | Confirms valid credentials return a JWT token. |
| `AuthControllerTest` | `testLoginInvalidPassword` | Confirms wrong passwords return a 400 error. |
| `CooperCookbookApplicationTests` | `contextLoads` | Standard Spring Boot context load check. |

## Running Tests

Run all tests from the root directory:
```bash
./mvnw test
```

To run a specific service's tests:
```bash
./mvnw test -Dtest=RecipeServiceTest
```

## Why we used Mockito
By mocking the Repositories, we test the logic inside the Services (like security checks and role logic) without touching the actual PostgreSQL tables. It makes the tests fast and reliable for local development.
