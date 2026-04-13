# GitHub Rules — Cooper Cookbook
**ECE-366 Spring 2026 | Team: Nolan Griffith & Alex Valsamis**

---

## Team

| Member | Branch | Role |
|---|---|---|
| Nolan Griffith | `nolan` | Backend, Database, Infrastructure |
| Alex Valsamis | `alex` | Frontend (React) |

> Isaac Amar and Isaac Schertz are no longer part of the project.

---

## Branching

- Each developer works on their own named branch (`nolan`, `alex`)
- Pull requests are **not required** — push directly to `main` when ready
- Branches do not need to be deleted after merging; they are kept as personal working branches

---

## Pushing to Main

- Both members are authorized to push directly to `main`
- No PR review process is required given the two-person team size and pace of development
- Communicate with your teammate before pushing large changes that affect shared files (e.g. `docker-compose.yml`, `application.properties`, `App.tsx`)

---

## Meetings

- Weekly sync every **Monday**
- Use the meeting to review what was pushed to main, align on next tasks, and resolve any conflicts

---

## Conflict Resolution

- If a merge conflict occurs, the two members resolve it together during the Monday meeting or over a quick call
- Do not force push to `main`

---

## Ownership

| Area | Owner |
|---|---|
| Backend (Spring Boot, JWT, controllers, services) | Nolan |
| Database (PostgreSQL schema, JPA repositories) | Nolan |
| Infrastructure (Docker, Docker Compose, cloud deployment) | Nolan |
| Frontend (React, TypeScript, pages, components) | Alex |
| Frontend Docker Compose integration | Alex |
| Shared (demos, documentation, final presentation) | Both |
