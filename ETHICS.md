# Ethical Engineering: Lessons from Cooper Cookbook

This document outlines the ethical considerations and professional standards applied during the development of the Cooper Cookbook platform, aligned with the [ACM/IEEE Software Engineering Code of Ethics](https://www.acm.org/code-of-ethics/software-engineering-code).

### 1. Prioritizing User Privacy (Principle 1.03)
We implemented **Bcrypt password hashing** and **JWT-based session management** to ensure that user credentials and private data are never stored in plain text or exposed. Learning to secure sensitive information is a fundamental ethical requirement to act in the public interest.

### 2. Respecting the "Right to be Forgotten" (Principle 1.01)
We specifically debugged and refined the **Account Deletion** feature. By implementing `ON DELETE CASCADE` and `ON DELETE SET NULL` constraints in PostgreSQL, we ensured that when a user chooses to leave the platform, their personal data is removed or anonymized reliably, fulfilling our ethical obligation to user autonomy.

### 3. Preserving Intellectual Property & Attribution (Principle 7.03)
A core feature of our platform is the "Fork" or "Save/Copy" mechanism. We designed this to preserve a **lineage of attribution**, ensuring that the original author is credited even when a recipe is adapted. This promotes fairness and respects the creative work of others.

### 4. Ensuring Data Accuracy & Quality (Principle 3.01)
We transitioned the ingredient quantity system to support **fractions (e.g., 1/2, 3/4)** instead of strictly decimals. This change was driven by the ethical need to provide a product that is accurate and useful for real-world application (cooking), meeting professional standards for functional quality.

### 5. Commitment to Software Integrity (Principle 3.10)
We reached a **test coverage of over 75%** using JaCoCo and Vitest. Ethically, a software engineer must ensure that their product is adequately tested. By verifying critical paths like Authentication and Recipe CRUD, we reduced the risk of system failure and data corruption.

### 6. Transparent Communication & Documentation (Principle 6.07)
We maintained a detailed **README-TESTING.md** and **TESTING-REPORT.md**. Providing clear documentation on how to verify the system's behavior is essential for professional transparency and allows others to evaluate the reliability of our work.

### 7. Protecting Against Unauthorized Access (Principle 3.01)
We implemented **Protected Routes** in the React frontend to prevent users from accessing or modifying data that does not belong to them. This enforces an ethical layer of security, ensuring that the software behaves exactly as intended and respects user boundaries.

### 8. Handling Security Vulnerabilities Responsibly (Principle 1.06)
When implementing the "Forgot Password" feature, we included **token expiry logic**. Learning that a reset token must have a limited lifespan is a key lesson in mitigating potential security risks and protecting the public from unauthorized account takeovers.

### 9. Professional Management & Milestone Resolution (Principle 5.01)
By utilizing an **Iterative Sprint model**, we prioritized team communication and cross-stack compatibility. We learned to manage the "Integration & Polish" phase intentionally, ensuring that all issues—whether created during backend or frontend development—were resolved and documented before the final release.

### 10. Lifelong Learning & Professional Growth (Principle 8.01)
Throughout the project, we embraced new technologies like **Docker Compose** and **JWT Security**. Ethically, software engineers must participate in lifelong learning to stay current with best practices, ensuring that the products they build are secure, modern, and high-quality.
