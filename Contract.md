# Campus Task Manager — API Contract

> **Version:** 1.0.0  
> **Target Audience:** Frontend Developer (Lead), Dhruv (Backend Engineer), Lavesh (Integration & Testing)  
> **Base URL:** `/api` (or `http://localhost:5000/api`)  
> **Data Format:** `application/json`

---

## 1. Overview & Team Roles

This document defines the formal API specification and single source of truth for the **Campus Task Manager** web application. 

* **Frontend Developer:** Implements the UI, consumes these endpoints, and handles state/optimistic UI updates.
* **Backend Engineer (Dhruv):** Implements the HTTP server, routing, validation, and in-memory or file-backed storage matching these exact paths, schemas, and status codes.
* **Integration & Testing (Lavesh):** Uses these specifications to write integration tests, verify status codes, and test edge cases.

---

## 2. Core Principles

1. **No Authentication or Multi-Tenant Overhead:** For this practice release, all requests are open and operate on a shared student task list. No tokens, headers, cookies, or user IDs are required.
2. **Standard RESTful Conventions:** Endpoints use standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`) with JSON payloads.
3. **Predictable Status Codes:** Standard HTTP codes (`200`, `201`, `204`, `400`, `404`, `500`) are used consistently.
4. **Idempotent and Partial Updates:** `PATCH /api/tasks/:id` allows partial updates (such as only toggling `completed: true/false`), making it lightweight for the frontend.

---

## 3. Data Model: Task

### Schema Definition

| Field Name | Type | Required | Default | Allowed Values / Constraints | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `string` | **Yes** (Server-generated) | Auto | Unique string or UUID (e.g. `"task-1741600000000"` or `"c7b3d1e2"`) | Unique identifier for the task. |
| `title` | `string` | **Yes** | — | Non-empty, 1 to 200 characters | Name or subject of the assignment/task. |
| `course` | `string` | No | `"General"` | String (e.g. `"CS101"`, `"MATH201"`, `"PHYS150"`, `"ENG102"`, `"Campus Life"`, `"Club"`) | Academic course or campus organization code. |
| `category` | `string` | No | `"Assignment"` | `"Assignment"`, `"Exam Prep"`, `"Project"`, `"Reading"`, `"Personal"` | Type of academic responsibility. |
| `priority` | `string` | No | `"medium"` | `"high"`, `"medium"`, `"low"` | Priority level of the task. |
| `dueDate` | `string` (or `null`) | No | `null` | ISO 8601 date string (e.g. `"2026-09-15T23:59:00"`) or `null` | Target deadline for task completion. |
| `description` | `string` | No | `""` | String up to 1000 characters | Notes, instructions, room locations, or group member details. |
| `completed` | `boolean` | No | `false` | `true`, `false` | Whether the task is marked as finished. |
| `createdAt` | `string` | **Yes** (Server-generated) | Current ISO timestamp | ISO 8601 timestamp (e.g. `"2026-09-10T17:00:00.000Z"`) | Timestamp when the task was initially created. |
| `updatedAt` | `string` | No (Server-generated) | Current ISO timestamp | ISO 8601 timestamp | Timestamp when the task was last modified. |

### Example Task Object

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

### Error Response Envelope

All `4xx` and `5xx` responses must return a JSON object with this consistent structure:

```json
{
  "error": "Bad Request",
  "message": "Field 'title' is required and cannot be blank.",
  "details": [
    "title must be a non-empty string between 1 and 200 characters."
  ]
}
```

* `error` (`string`, required): Short title of the error status.
* `message` (`string`, required): Human-readable error description suitable for displaying in a toast/alert.
* `details` (`array of strings`, optional): Specific field-level validation errors.

---

## 5. API Endpoints

### 5.1. List All Tasks

Retrieves all student tasks, with optional query parameters to filter by completion status, course, or priority.

* **Method:** `GET`
* **Path:** `/api/tasks`
* **Headers:**
  * `Accept: application/json`

#### Query Parameters (All Optional)

| Parameter | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `status` | `string` | `all`, `active`, `completed` | Defaults to `all`. If `active`, returns only tasks where `completed === false`. If `completed`, returns only tasks where `completed === true`. |
| `course` | `string` | String (e.g. `CS101`) | Filters tasks matching a specific course name. |
| `priority` | `string` | `high`, `medium`, `low` | Filters tasks by priority level. |
| `search` | `string` | String | Case-insensitive search matching against `title`, `description`, or `course`. |

#### Successful Response: `200 OK`
Returns an array of Task objects. If no tasks exist or match filters, returns an empty array `[]`.

```json
[
  {
    "id": "task-1",
    "title": "Submit Data Structures Lab 4 (Binary Search Trees)",
    "course": "CS101",
    "category": "Assignment",
    "priority": "high",
    "dueDate": "2026-09-12T23:59:00.000Z",
    "description": "Implement recursive insertion, deletion, and in-order traversal.",
    "completed": false,
    "createdAt": "2026-09-10T10:30:00.000Z",
    "updatedAt": "2026-09-10T10:30:00.000Z"
  },
  {
    "id": "task-2",
    "title": "Pick up student transit pass",
    "course": "Campus Life",
    "category": "Personal",
    "priority": "low",
    "dueDate": "2026-09-09T16:00:00.000Z",
    "description": "Visit student union room 204.",
    "completed": true,
    "createdAt": "2026-09-08T09:00:00.000Z",
    "updatedAt": "2026-09-09T17:00:00.000Z"
  }
]
```

---

### 5.2. Get Task by ID

Retrieves the details of a single task by its unique identifier.

* **Method:** `GET`
* **Path:** `/api/tasks/:id`
* **Path Parameters:**
  * `id` (`string`, required): The unique identifier of the task.

#### Successful Response: `200 OK`
```json
{
  "id": "task-1",
  "title": "Submit Data Structures Lab 4 (Binary Search Trees)",
  "course": "CS101",
  "category": "Assignment",
  "priority": "high",
  "dueDate": "2026-09-12T23:59:00.000Z",
  "description": "Implement recursive insertion, deletion, and in-order traversal.",
  "completed": false,
  "createdAt": "2026-09-10T10:30:00.000Z",
  "updatedAt": "2026-09-10T10:30:00.000Z"
}
```

#### Error Response: `404 Not Found`
When the specified `id` does not exist:
```json
{
  "error": "Not Found",
  "message": "Task with ID 'task-999' was not found."
}
```

---

### 5.3. Create a New Task

Creates a new academic task and stores it. The backend generates a unique `id` and `createdAt` timestamp.

* **Method:** `POST`
* **Path:** `/api/tasks`
* **Headers:**
  * `Content-Type: application/json`
  * `Accept: application/json`

#### Request Body Schema

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

| Field | Type | Required | Notes |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **Yes** | 1 to 200 characters; trimmed of whitespace. |
| `course` | `string` | No | Defaults to `"General"` if omitted. |
| `category` | `string` | No | Must be one of: `"Assignment"`, `"Exam Prep"`, `"Project"`, `"Reading"`, `"Personal"`. Defaults to `"Assignment"`. |
| `priority` | `string` | No | Must be one of: `"high"`, `"medium"`, `"low"`. Defaults to `"medium"`. |
| `dueDate` | `string` or `null` | No | Valid ISO date string or `null`. Defaults to `null`. |
| `description` | `string` | No | Optional notes up to 1000 characters. Defaults to `""`. |
| `completed` | `boolean` | No | Defaults to `false`. |

#### Successful Response: `201 Created`
Returns the created Task object, populated with server-generated `id`, `createdAt`, and `updatedAt`.

```json
{
  "id": "task-1741604500123",
  "title": "CS101 Term Project Proposal",
  "course": "CS101",
  "category": "Project",
  "priority": "high",
  "dueDate": "2026-09-20T17:00:00.000Z",
  "description": "Draft 2-page project outline and group member roles.",
  "completed": false,
  "createdAt": "2026-09-10T11:45:00.123Z",
  "updatedAt": "2026-09-10T11:45:00.123Z"
}
```

#### Error Response: `400 Bad Request`
When validation fails (e.g. missing `title` or invalid `priority` value):
```json
{
  "error": "Bad Request",
  "message": "Validation failed for new task.",
  "details": [
    "Field 'title' is required.",
    "Field 'priority' must be one of: high, medium, low."
  ]
}
```

---

### 5.4. Update a Task (Partial or Full)

Updates one or more fields of an existing task. Most frequently used by the frontend to toggle `completed: true/false`.

* **Method:** `PATCH` (or `PUT`)
* **Path:** `/api/tasks/:id`
* **Headers:**
  * `Content-Type: application/json`
  * `Accept: application/json`

#### Request Body Schema (All Fields Optional)
Only the fields intended to change need to be provided.

##### Example 1: Toggling Completion Status
```json
{
  "completed": true
}
```

##### Example 2: Updating Details & Due Date
```json
{
  "title": "Submit Data Structures Lab 4 (Resubmission)",
  "priority": "medium",
  "dueDate": "2026-09-14T23:59:00.000Z"
}
```

#### Successful Response: `200 OK`
Returns the updated Task object with an updated `updatedAt` timestamp.

```json
{
  "id": "task-1",
  "title": "Submit Data Structures Lab 4 (Binary Search Trees)",
  "course": "CS101",
  "category": "Assignment",
  "priority": "high",
  "dueDate": "2026-09-12T23:59:00.000Z",
  "description": "Implement recursive insertion, deletion, and in-order traversal.",
  "completed": true,
  "createdAt": "2026-09-10T10:30:00.000Z",
  "updatedAt": "2026-09-10T12:00:00.000Z"
}
```

#### Error Responses

* `400 Bad Request`: If submitted fields fail validation (e.g. empty `title` or invalid `category`):
  ```json
  {
    "error": "Bad Request",
    "message": "Invalid field value provided.",
    "details": ["Field 'priority' must be one of: high, medium, low."]
  }
  ```

* `404 Not Found`: If no task exists with the given `id`:
  ```json
  {
    "error": "Not Found",
    "message": "Task with ID 'task-999' was not found."
  }
  ```

---

### 5.5. Delete a Task

Deletes an existing task by its unique identifier.

* **Method:** `DELETE`
* **Path:** `/api/tasks/:id`
* **Headers:**
  * `Accept: application/json`

#### Successful Response: `200 OK` or `204 No Content`
Both `200 OK` (returning a success message) or `204 No Content` (empty body) are acceptable. For clarity in debugging, `200 OK` with confirmation is recommended:

```json
{
  "message": "Task 'task-1' was successfully deleted.",
  "id": "task-1"
}
```

#### Error Response: `404 Not Found`
If the task does not exist:
```json
{
  "error": "Not Found",
  "message": "Task with ID 'task-999' was not found."
}
```

---

## 6. Summary of HTTP Status Codes

| Status Code | Reason | Used When |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | `GET /api/tasks`, `GET /api/tasks/:id`, `PATCH /api/tasks/:id`, `DELETE /api/tasks/:id` |
| `201 Created` | Resource created | `POST /api/tasks` |
| `204 No Content` | Alternate delete success | Optional alternate for `DELETE /api/tasks/:id` |
| `400 Bad Request` | Client validation failure | Missing required fields, invalid priority/category, or malformed JSON |
| `404 Not Found` | Resource missing | Any endpoint where `:id` cannot be found in the store |
| `500 Internal Server Error`| Server crash / failure | Unexpected unhandled server exception |

---

## 7. Integration & Testing Guide (For Lavesh)

Lavesh can write test suites validating the following end-to-end user flows:

1. **Test Initial State:** `GET /api/tasks` returns `200` with an array.
2. **Test Creation:** `POST /api/tasks` with valid payload returns `201` with generated `id`, `completed: false`, and timestamps.
3. **Test Validation:** `POST /api/tasks` with `{ "title": "" }` returns `400 Bad Request` with an informative error message.
4. **Test Status Toggle:** `PATCH /api/tasks/:id` with `{ "completed": true }` returns `200` with `completed === true`.
5. **Test Retrieval:** `GET /api/tasks/:id` returns `200` with exact task object.
6. **Test Deletion:** `DELETE /api/tasks/:id` returns `200` or `204`.
7. **Test Deletion Verification:** Subsequent `GET /api/tasks/:id` returns `404 Not Found`.

---

## 8. Backend Implementation Tips (For Dhruv)

* **Lightweight Storage:** Use an in-memory array (or a lightweight local `tasks.json` file) to store tasks during development.
* **CORS Support:** Ensure the backend enables CORS for the frontend origin (e.g., `http://localhost:5173` or `*`) to avoid cross-origin fetch errors.
* **ID Generation:** A simple timestamp string (`Date.now().toString()`) or a standard `crypto.randomUUID()` works great.
* **Default Values:** Apply default values (`course: "General"`, `priority: "medium"`, `completed: false`) on the backend if not provided in the request body.
