# Campus Task Manager - Backend API

Simple, beginner-friendly REST API backend built for the Campus Task Manager hackathon practice project.

---

## 🛠️ Technology Used
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Minimal and flexible Node.js web application framework to build RESTful APIs quickly.
- **CORS (`cors`)**: Middleware allowing your frontend teammates (running on Vite, React, or Live Server) to connect without cross-origin errors.
- **In-Memory Storage**: Simple JavaScript array storing tasks in memory—no complicated database setup needed for rapid hackathon prototyping.

---

## 📁 Project Structure
```text
Campus_Task_Manager/
└── backend/
    ├── .gitignore       # Ignores node_modules
    ├── package.json     # Project dependencies and npm scripts
    ├── README.md        # Documentation and API reference
    └── server.js        # Main Express server and API endpoints
```

---

## 🚀 How to Install & Run

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   - **Standard start**:
     ```bash
     npm start
     ```
   - **Development auto-reload mode** (uses Node's built-in `--watch`):
     ```bash
     npm run dev
     ```

4. The server runs at: `http://localhost:5000`

---

## 📋 Task Data Model
Each task object has the following structure:
```json
{
  "id": "1",
  "title": "Complete CS101 Lab Assignment",
  "subject": "Computer Science",
  "dueDate": "2026-09-15",
  "completed": false
}
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Request Body (JSON) | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API Health Check | None | 200 OK |
| `GET` | `/api/tasks` | Get all tasks | None | 200 OK |
| `POST` | `/api/tasks` | Add a new task | `{ "title": "...", "subject": "...", "dueDate": "YYYY-MM-DD" }` | 201 Created |
| `PATCH` | `/api/tasks/:id/complete` | Mark task as completed | None | 200 OK |
| `DELETE` | `/api/tasks/:id` | Delete a task | None | 200 OK |

---

## 🧪 How to Test the API

### Automated Test Script (Easiest)
While the server is running in another terminal, run:
```bash
npm test
```
This tests all 4 endpoints (GET, POST, PATCH, DELETE) and prints the results!

### 1. In Your Browser
Open:
- `http://localhost:5000` -> Health check & overview
- `http://localhost:5000/api/tasks` -> View all tasks

### 2. Using PowerShell (Windows)

- **Get all tasks**:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method GET
  ```

- **Add a new task**:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method POST -ContentType "application/json" -Body '{"title":"Physics Lab Report","subject":"Physics","dueDate":"2026-09-20"}'
  ```

- **Mark task #1 as completed**:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/1/complete" -Method PATCH
  ```

- **Delete task #1**:
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/1" -Method DELETE
  ```

### 3. Using cURL (Git Bash / Linux / macOS)

- **Get all tasks**:
  ```bash
  curl http://localhost:5000/api/tasks
  ```

- **Add a new task**:
  ```bash
  curl -X POST http://localhost:5000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title": "Physics Lab Report", "subject": "Physics", "dueDate": "2026-09-20"}'
  ```

- **Mark task completed**:
  ```bash
  curl -X PATCH http://localhost:5000/api/tasks/1/complete
  ```

- **Delete a task**:
  ```bash
  curl -X DELETE http://localhost:5000/api/tasks/1
  ```
