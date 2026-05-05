# Cooper Cookbook Latest Testing Metrics

| Component | Test Framework | Total Tests | Status | Line Coverage | Branch Coverage |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Backend (Spring Boot) | JUnit 5 / JaCoCo | 73 | PASSED | 76.8% | 40.9% |
| Frontend (React) | Vitest / V8 | 10 | PASSED | 79.4% | 66.0% |
| Project Total (Avg) |  | 83 | PASSED | 78.1% | 53.5% |

### Backend Detail
**Directory Path:** `src/test/java/com/cookbook/cookbook/`

*   **Total Classes:** 27  
*   **Total Lines:** 720 (553 Covered / 167 Missed)  
*   **Security & Auth:** High coverage in SecurityConfig (100%) and AuthController (~90%).  
*   **Services:** RecipeService and UserService have moderate coverage, focusing on logic like forking and rest tokens.

| Test Suite (Class) | Test Cases | Focus Area |
| ----- | ----- | ----- |
| AuthControllerTest | 8 | Login, registration, Step 1 validation |
| RecipeControllerTest | 12 | CRUD operations, public/private filtering |
| RecipeServiceTest | 10 | Forking logic, ingredient validation |
| CollectionControllerTest | 8 | Folder management, adding recipes to collections |
| UserControllerTest | 6 | Profile updates, password verification |
| SavedRecipeControllerTest | 5 | “Stashing” recipes, removing from stash |
| JwtFilterTest / JwtUtilTest | 8 | Token generation, validation, and security |
| RepositoryTests (Multiple) | 15 | SQL queries for recipes, ingredients, steps, and users |
| ModelTest | 1 | Basic POJO/entity integrity |

### Frontend Detail
**Directory Path:** `cookbook-frontend/src/components/__tests__/`

*   **Navbar.tsx:** 71.4%  
*   **RecipeCard.tsx:** 60.0% (Increased complexity from recent link updates)  
*   **TagInput.tsx:** 86.4%  
*   **Summary:** The frontend coverage is concentrated on critical UI components and input validation.

| Test File | Test Cases | Focus Area |
| ----- | ----- | ----- |
| Navbar.test.tsx | 2 | Navigation links and active states |
| RecipeCard.test.tsx | 3 | Title rendering, author display, and tag truncation |
| TagInput.test.tsx | 2 | Adding and removing category tags |
| TagInputLimits.test.tsx | 3 | Character limits and duplicate tag prevention |

---

| Area | How to View Specific Test Names | Note |
| :---: | :---: | :---: |
| Backend | Maven generates a detailed HTML report of every test name and its execution time. Open it with: `open target/site/surefire-report.html` | If the file does not exist, run: `./mvnw surefire-report:report` |
| Frontend | Run UI mode with: `cd cookbook-frontend && npx vitest --ui` | This opens an interactive browser window where you can click each test file and see the exact `it("should...")` descriptions. |
