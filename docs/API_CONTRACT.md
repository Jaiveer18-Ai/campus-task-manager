# Campus Task Manager — Unified API Contract

> **Version:** 1.1.0 (Integration-Ready)  
> **Audience:** Frontend Developer (Lead), Dhruv (Backend Engineer), Lavesh (Integration & Testing)  
> **Backend Base URL:** `http://localhost:5000` (API Route: `http://localhost:5000/api/tasks`)  
> **Frontend URL:** `http://localhost:5173` (Vite Development Server)  
> **Data Format:** `application/json`  
> **Cross-Origin Resource Sharing (CORS):** Fully enabled on backend for all origins (`*`)

---

## 1. Overview & Team Roles

This document defines the formal, unified contract between the frontend and backend for the **Campus Task Manager** web application. It bridges the frontend UI implementation with the backend REST endpoints.

* **Frontend Developer:** Implements the user interface, binds UI actions to these endpoints, manages visual state (filters, sorting, modals, toasts), and displays errors gracefully.
* **Backend Engineer (Dhruv):** Implements server routing, JSON parsing, field validations, status codes, and storage conforming exactly to this specification.
* **Integration & Testing (Lavesh):** Uses these specifications to run automated and end-to-end tests validating status codes, response shapes, and filter operations.

---

## 2. Core Principles & Integration Protocol

1. **Zero Authentication Overhead:** All requests operate openly on the student task list. No tokens, auth headers, or cookies are needed.
2. **CORS Pre-Configured:** The backend enables CORS (`cors()`), allowing the frontend at `http://localhost:5173` to make direct requests to `http://localhost:5000` without browser cross-origin blocking.
3. **Flexible Status Filtering:** The backend accepts both `status=active` (backend convention) and `status=pending` (frontend convention) to fetch uncompleted tasks (`completed === false`), preventing cross-team naming mismatches.
4. **Permissive Due Date Format:** Due dates can be provided either in ISO 8601 format (`2026-09-12T23:59:00.000Z`) or HTML5 datetime-local format (`2026-09-12T23:59`), or `null`/empty string.
5. **Partial Updates Supported:** `PATCH /api/tasks/:id` (and `PUT /api/tasks/:id`) allows sending only the modified fields (such as `{ "completed": true }`).
6. **Predictable Status Codes:** All endpoints use standard HTTP status codes (`200`, `201`, `400`, `404`, `500`).

---

## 3. Task Data Model

### 3.1. Field Definitions

| Field Name | Type | Required? | Default Value | Allowed Values / Constraints | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `string` | **Yes** (Server) | Auto-generated | `task-` prefix followed by unique timestamp/UUID (e.g. `"task-1"`, `"task-1741600000000"`) | Unique task identifier. |
| `title` | `string` | **Yes** (Client) | — | Non-empty string, 1 to 200 characters | Name or subject of the assignment or activity. |
| `course` | `string` | No | `"General"` | String (e.g. `"CS101"`, `"MATH201"`, `"PHYS150"`, `"ENG102"`, `"Campus Life"`, `"Club / Extracurricular"`) | Academic course or student activity name. |
| `category` | `string` | No | `"Assignment"` | `"Assignment"`, `"Exam Prep"`, `"Project"`, `"Reading"`, `"Personal"` | Category of academic responsibility. |
| `priority` | `string` | No | `"medium"` | `"high"`, `"medium"`, `"low"` | Priority level of the task. |
| `dueDate` | `string` or `null` | No | `null` | ISO date string, `YYYY-MM-DDTHH:MM`, or `null` / `""` | Target deadline for task completion. |
| `description` | `string` | No | `""` | String up to 1000 characters | Notes, instructions, room locations, or group links. |
| `completed` | `boolean` | No | `false` | `true`, `false` | Whether the task is completed. |
| `createdAt` | `string` | **Yes** (Server) | Current ISO timestamp | ISO 8601 timestamp (e.g. `"2026-09-10T10:30:00.000Z"`) | Timestamp when task was created. |
| `updatedAt` | `string` | **Yes** (Server) | Current ISO timestamp | ISO 8601 timestamp | Timestamp when task was last modified. |

### 3.2. Example Task Object

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

---

## 4. Standard Response Formats

### 4.1. Success Responses
* `200 OK`: Successful retrieval, update, or deletion.
* `201 Created`: Successful creation of a new task.

### 4.2. Error Response Envelope (`4xx` / `5xx`)
All client and server errors return this standardized JSON object:

```json
{
  "error": "Bad Request",
  "message": "Validation failed for new task.",
  "details": [
    "Field 'title' is required and cannot be blank.",
    "Field 'priority' must be one of: high, medium, low."
  ]
}
```

* `error` (`string`, required): Short HTTP error title (`"Bad Request"`, `"Not Found"`, `"Internal Server Error"`).
* `message` (`string`, required): User-friendly summary message suitable for toast or alert displays.
* `details` (`array of strings`, optional): Specific field validation error descriptions.

---

## 5. API Endpoints Reference

### 5.1. List All Tasks
Retrieves all tasks, with optional query filters.

* **Method:** `GET`
* **Path:** `/api/tasks`
* **Query Parameters (all optional):**
  * `status`: `'all'` | `'active'` | `'pending'` | `'completed'`. (`'active'` and `'pending'` both return tasks where `completed === false`).
  * `course`: Filter tasks by exact course name (case-insensitive, e.g. `?course=CS101`).
  * `priority`: Filter tasks by priority (`?priority=high`).
  * `search`: Case-insensitive search matching against `title`, `description`, or `course`.
* **Response:** `200 OK` with JSON array of task objects (returns `[]` if no matches).

#### Example Request
```http
GET /api/tasks?status=pending&priority=high HTTP/1.1
Host: localhost:5000
```

---

### 5.2. Get Single Task by ID
Retrieves details of a single task.

* **Method:** `GET`
* **Path:** `/api/tasks/:id`
* **Response:**
  * `200 OK`: Task object.
  * `404 Not Found`: Task does not exist.

#### Example Request
```http
GET /api/tasks/task-1 HTTP/1.1
Host: localhost:5000
```

---

### 5.3. Create a New Task
Creates a new task. The server assigns `id`, `createdAt`, `updatedAt`, and sets `completed: false`.

* **Method:** `POST`
* **Path:** `/api/tasks`
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "title": "CS101 Term Project Proposal",
    "course": "CS101",
    "category": "Project",
    "priority": "high",
    "dueDate": "2026-09-20T17:00:00.000Z",
    "description": "Draft 2-page project outline and group member roles."
  }
  ```
* **Response:**
  * `201 Created`: Created task object with all fields populated.
  * `400 Bad Request`: Validation failure (e.g. missing `title` or invalid `priority`).

---

### 5.4. Update a Task (Partial or Full)
Updates one or more fields of an existing task. Used by the frontend to toggle completion, edit due dates, or modify details.

* **Method:** `PATCH` (or `PUT`)
* **Path:** `/api/tasks/:id`
* **Headers:** `Content-Type: application/json`
* **Request Body (send only changed fields):**
  ```json
  {
    "completed": true
  }
  ```
  *(Or full edit)*:
  ```json
  {
    "title": "Updated Title",
    "priority": "low",
    "dueDate": "2026-09-25T18:00"
  }
  ```
* **Response:**
  * `200 OK`: Updated task object with fresh `updatedAt` timestamp.
  * `400 Bad Request`: Validation error on submitted fields.
  * `404 Not Found`: Task does not exist.

---

### 5.5. Mark Task Complete (Shortcut)
Shorthand endpoint to quickly mark an existing task as completed.

* **Method:** `PATCH`
* **Path:** `/api/tasks/:id/complete`
* **Response:**
  * `200 OK`: `{ "message": "Task marked as completed successfully.", "task": { ... } }`
  * `404 Not Found`: Task does not exist.

---

### 5.6. Delete a Task
Removes a task from storage.

* **Method:** `DELETE`
* **Path:** `/api/tasks/:id`
* **Response:**
  * `200 OK`: `{ "message": "Task 'task-1' was successfully deleted.", "id": "task-1" }`
  * `404 Not Found`: Task does not exist.

---

## 6. Frontend Developer Integration Guide (Ready to Copy-Paste)

Here is a ready-to-use API client file the frontend developer can place in `frontend/src/api/tasksApi.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api/tasks';

// 1. Fetch all tasks (supports status, course, priority, search)
export async function fetchTasks(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.course && params.course !== 'all') query.append('course', params.course);
  if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
  if (params.search && params.search.trim()) query.append('search', params.search.trim());

  const url = query.toString() ? `${API_BASE_URL}?${query.toString()}` : API_BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

// 2. Create a new task
export async function createTask(taskData) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create task');
  return data;
}

// 3. Toggle task completion status
export async function toggleTaskCompletion(taskId, nextCompletedState) {
  const res = await fetch(`${API_BASE_URL}/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: nextCompletedState })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update task');
  return data;
}

// 4. Update task details
export async function updateTask(taskId, updates) {
  const res = await fetch(`${API_BASE_URL}/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update task');
  return data;
}

// 5. Delete a task
export async function deleteTask(taskId) {
  const res = await fetch(`${API_BASE_URL}/${taskId}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete task');
  return data;
}
```

---

## 7. Status Code Summary

| HTTP Code | Name | Used In Endpoints | Description |
| :--- | :--- | :--- | :--- |
| `200 OK` | Success | `GET`, `PATCH`, `PUT`, `DELETE` | Request succeeded; returns data or confirmation. |
| `201 Created` | Created | `POST /api/tasks` | Task created; returns complete task object. |
| `400 Bad Request` | Client Error | `POST`, `PATCH`, `PUT` | Missing required fields or invalid values. |
| `404 Not Found` | Not Found | `GET /:id`, `PATCH /:id`, `DELETE /:id` | Requested task does not exist. |
| `500 Internal Error` | Server Error | All | Unhandled server crash or unexpected exception. |
