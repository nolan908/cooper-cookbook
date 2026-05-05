# Ethical Engineering: Lessons from Cooper Cookbook

This document outlines the ethical considerations and professional standards applied during the development of the Cooper Cookbook platform, aligned with the [ACM/IEEE Software Engineering Code of Ethics](https://www.acm.org/code-of-ethics/software-engineering-code).

### 1. No diminishing privacy to the user - 1.03
We implemented **Bcrypt password hashing** and **JWT-based session management** to ensure that user credentials and private data are never stored in unencrypted text or exposed. Securing sensitive information is a fundamental ethical requirement that serves the public interest.

### 2. Respecting the "right" to be forgotten - 1.02
We thoroughly debugged and refined the **Account Deletion** feature. By implementing `ON DELETE CASCADE` and `ON DELETE SET NULL` constraints in PostgreSQL, we ensured that when a user leaves the platform, their personal data is reliably removed or pseudonymized, thereby fulfilling our ethical obligation to uphold user self-determination. This data is further anonymized by using Display Names instead of unique usernames.

### 3. Preserving Intellectual Property & Attribution - 7.03
A core feature of our platform is the "Fork" or "Save/Copy" mechanism. We designed this to preserve a **lineage of attribution**, making sure that the first author is credited even when a recipe is adapted. This encourages fairness and respects others' creative work. In addition, we documented our use of the Gemini CLI, our professor, and the team involved, and properly attributed it to the main page of the Cooper Cookbook.

### 4. Ensuring Purposefulness to the software - 3.02
We transitioned the ingredient quantity system to support **fractions (e.g., 1/2, 3/4)** instead of strictly decimals. This change was driven by the ethical need to provide a product that is accurate and reproducible for actual use (cooking) and meets professional standards for functional quality.

### 5. Software Integrity via Debugging and Testing - 3.10
We reached a **test coverage of over 75%** using JaCoCo and Vitest. Ethically, a software engineer must ensure their product is adequately tested. By verifying critical paths such as Authentication and Recipe CRUD, we reduced the risk of system failures and data corruption.

### 6. Transparency in Documentation - 6.07
We maintained comprehensive **README-TESTING.md** and **TESTING-REPORT.md** documents. Providing clear documentation for system verification is essential for professional integrity and enables others to assess the reliability of our work, preventing any misleading impressions.

### 7. Protect against accidents made by user - 1.04
We implemented a **Danger Zone** where you have to insert your current password in order to properly change your password to something else or delete your account all together, therefore protecting the users from misleading clicks.

### 8. Handling Security Vulnerabilities Responsibly - 1.03
When implementing the "Forgot Password" feature, we included **token expiry logic**. Recognizing that a reset token must have a limited lifespan is essential for mitigating security risks and protecting users from unauthorized account access. We wouldn't have the 'forgot password' feature unless we knew it was safe and tested.

### 9. Professional Management & Milestone Resolution - 5.01
By utilizing an **Iterative Sprint model**, we prioritized team communication and cross-stack compatibility. We intentionally managed the "Integration & Polish" phase, ensuring that all issues, whether arising from backend or frontend development, were resolved and documented before the final release.

### 10. Career Development creating Full-Stack Systems - 8.01
Throughout the project, we adopted new technologies such as **Docker Compose** and **JWT Security**. Ethically, software engineers are required to engage in lifelong learning to stay current with best practices, ensuring the products they develop are secure, modern, and of high quality.
