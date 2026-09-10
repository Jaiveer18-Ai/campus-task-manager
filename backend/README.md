# Campus Task Manager - Backend API (Contract.md Compliant)

Express REST API backend for the **Campus Task Manager** hackathon project. Fully compliant with [`Contract.md`](../Contract.md) and compatible with the frontend application.

---

## 🛠️ Technology Stack
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated web framework for Node.js.
- **CORS (`cors`)**: Middleware allowing cross-origin requests from the frontend client (`http://localhost:5173`).
- **In-Memory Store**: Seeded with the 6 initial academic tasks matching `Contract.md` and `frontend/src/data/mockTasks.js`.

---

## 📋 Task Data Model (Contract.md)

```json
{
  "id": "task-1",
  "title": "Submit Data Structures Lab 4 (Binary Search Trees)",
  "course": "CS101",
  "category": "Assignment",
  "priority": "high",
  "dueDate": "2026-09-12T23:59:00.000Z",
  "description": "Implement recursive insertion, deletion, and in-order traversal with unit tests.",
  "completed": false,
  "createdAt": "2026-09-10T10:30:00.000Z",
  "updatedAt": "2026-09-10T10:30:00.000Z"
}
```

* **Categories**: `"Assignment"`, `"Exam Prep"`, `"Project"`, `"Reading"`, `"Personal"`
* **Priorities**: `"high"`, `"medium"`, `"low"`
* **Courses**: `"CS101"`, `"MATH201"`, `"PHYS150"`, `"ENG102"`, `"Campus Life"`, `"Club / Extracurricular"`, or custom strings (defaults to `"General"`).

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Query / Body Params | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API status & sitemap | None | `200` |
| `GET` | `/api/tasks` | List all tasks | Query params: `status` (`all`/`active`/`completed`), `course`, `priority`, `search` | `200` |
| `GET` | `/api/tasks/:id` | Get single task | `:id` in URL | `200` / `404` |
| `POST` | `/api/tasks` | Create task | Body: `{ title, course?, category?, priority?, dueDate?, description? }` | `201` / `400` |
| `PATCH`| `/api/tasks/:id` | Partial update | Body: `{ completed?, title?, course?, category?, priority?, dueDate?, description? }` | `200` / `400` / `404` |
| `PATCH`| `/api/tasks/:id/complete` | Complete shortcut | None | `200` / `404` |
| `DELETE`| `/api/tasks/:id` | Delete task | `:id` in URL | `200` / `404` |

---

## 🚀 How to Run

1. Open terminal:
   ```bash
   cd backend
   ```
2. Start server:
   ```bash
   npm start
   ```
   Or with live reload:
   ```bash
   npm run dev
   ```
3. Base URL:
   ```text
   http://localhost:5000
   ```

---

## 🧪 Automated Testing

Run the test suite at any time:
```bash
npm test
```
Verifies all endpoints, query filtering, data validation, partial updates, and error envelopes.
