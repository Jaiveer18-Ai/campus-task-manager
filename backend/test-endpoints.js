const assert = require('assert');
const app = require('./server');

async function runTests() {
  console.log('===========================================================');
  console.log(' Running Contract.md Backend Integration Test Suite');
  console.log('===========================================================\n');

  // Start isolated test server on free port
  const server = app.listen(0);
  const port = server.address().port;
  const BASE_URL = `http://localhost:${port}/api/tasks`;

  let passed = 0;
  let failed = 0;

  function recordPass(testName) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  }

  function recordFail(testName, error) {
    console.error(`❌ [FAIL] ${testName}:`, error.message || error);
    failed++;
  }

  try {
    // -------------------------------------------------------------
    // Test 1: GET /api/tasks (Basic retrieval & CORS)
    // -------------------------------------------------------------
    try {
      const res = await fetch(BASE_URL);
      assert.strictEqual(res.status, 200, 'Status should be 200');
      assert.ok(res.headers.get('access-control-allow-origin'), 'CORS header should be present');

      const tasks = await res.json();
      assert.ok(Array.isArray(tasks), 'Response must be an array');
      assert.strictEqual(tasks.length, 6, 'Should load 6 initial mock tasks');

      // Verify schema of first task
      const first = tasks[0];
      assert.ok(first.id, 'Task must have an id');
      assert.ok(first.title, 'Task must have a title');
      assert.ok(first.course, 'Task must have a course');
      assert.ok(first.category, 'Task must have a category');
      assert.ok(first.priority, 'Task must have a priority');
      assert.strictEqual(typeof first.completed, 'boolean', 'Task completed must be boolean');
      assert.ok(first.createdAt, 'Task must have createdAt');
      assert.ok(first.updatedAt, 'Task must have updatedAt');

      recordPass('1. GET /api/tasks - Initial tasks loaded with full schema and CORS');
    } catch (e) {
      recordFail('1. GET /api/tasks', e);
    }

    // -------------------------------------------------------------
    // Test 2: GET /api/tasks query filters (status, course, priority, search)
    // -------------------------------------------------------------
    try {
      // Filter by status=active
      const resActive = await fetch(`${BASE_URL}?status=active`);
      const activeTasks = await resActive.json();
      assert.ok(activeTasks.every((t) => !t.completed), 'All active tasks must have completed === false');

      // Filter by status=completed
      const resCompleted = await fetch(`${BASE_URL}?status=completed`);
      const completedTasks = await resCompleted.json();
      assert.ok(completedTasks.every((t) => t.completed === true), 'All completed tasks must have completed === true');

      // Filter by course
      const resCourse = await fetch(`${BASE_URL}?course=CS101`);
      const csTasks = await resCourse.json();
      assert.ok(csTasks.every((t) => t.course === 'CS101'), 'Filtered tasks must match course');

      // Filter by priority
      const resPriority = await fetch(`${BASE_URL}?priority=high`);
      const highTasks = await resPriority.json();
      assert.ok(highTasks.every((t) => t.priority === 'high'), 'Filtered tasks must match priority');

      // Search query
      const resSearch = await fetch(`${BASE_URL}?search=Calculus`);
      const searchTasks = await resSearch.json();
      assert.ok(searchTasks.some((t) => t.title.includes('Calculus')), 'Search should find Calculus');

      recordPass('2. GET /api/tasks?query - Filtering by status, course, priority, and search');
    } catch (e) {
      recordFail('2. GET /api/tasks?query', e);
    }

    // -------------------------------------------------------------
    // Test 3: GET /api/tasks/:id (Single task & 404)
    // -------------------------------------------------------------
    try {
      const res = await fetch(`${BASE_URL}/task-1`);
      assert.strictEqual(res.status, 200);
      const task = await res.json();
      assert.strictEqual(task.id, 'task-1');

      // 404 test
      const res404 = await fetch(`${BASE_URL}/non-existent-task-id`);
      assert.strictEqual(res404.status, 404);
      const err = await res404.json();
      assert.strictEqual(err.error, 'Not Found');
      assert.ok(err.message);

      recordPass('3. GET /api/tasks/:id - Retrieve single task and 404 envelope');
    } catch (e) {
      recordFail('3. GET /api/tasks/:id', e);
    }

    // -------------------------------------------------------------
    // Test 4: POST /api/tasks (Creation & Validations)
    // -------------------------------------------------------------
    let createdTaskId = null;
    try {
      const validPayload = {
        title: 'Algorithms Homework 3 (Dynamic Programming)',
        course: 'CS101',
        category: 'Assignment',
        priority: 'high',
        dueDate: '2026-09-22T23:59:00.000Z',
        description: 'Solve knapsack and longest common subsequence.'
      };

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload)
      });

      assert.strictEqual(res.status, 201, 'Status should be 201');
      const created = await res.json();
      assert.ok(created.id.startsWith('task-'));
      assert.strictEqual(created.title, validPayload.title);
      assert.strictEqual(created.course, validPayload.course);
      assert.strictEqual(created.category, validPayload.category);
      assert.strictEqual(created.priority, validPayload.priority);
      assert.strictEqual(created.completed, false);
      assert.ok(created.createdAt);
      assert.ok(created.updatedAt);
      createdTaskId = created.id;

      // Validation test: Empty title
      const resEmpty = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '   ' })
      });
      assert.strictEqual(resEmpty.status, 400);
      const errEmpty = await resEmpty.json();
      assert.strictEqual(errEmpty.error, 'Bad Request');
      assert.ok(errEmpty.details.length > 0);

      // Validation test: Invalid priority & category
      const resInvalid = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Valid Title',
          priority: 'extreme',
          category: 'UnknownCategory'
        })
      });
      assert.strictEqual(resInvalid.status, 400);
      const errInvalid = await resInvalid.json();
      assert.strictEqual(errInvalid.details.length, 2);

      recordPass('4. POST /api/tasks - Task creation and validation rules');
    } catch (e) {
      recordFail('4. POST /api/tasks', e);
    }

    // -------------------------------------------------------------
    // Test 5: PATCH /api/tasks/:id (Partial update & validations)
    // -------------------------------------------------------------
    try {
      assert.ok(createdTaskId);
      const patchRes = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: true,
          priority: 'low'
        })
      });

      assert.strictEqual(patchRes.status, 200);
      const updated = await patchRes.json();
      assert.strictEqual(updated.completed, true);
      assert.strictEqual(updated.priority, 'low');
      assert.strictEqual(updated.title, 'Algorithms Homework 3 (Dynamic Programming)');

      // Test 400 validation on PATCH
      const patchBad = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: 'super-urgent' })
      });
      assert.strictEqual(patchBad.status, 400);

      // Test 404 on PATCH
      const patch404 = await fetch(`${BASE_URL}/non-existent-id`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
      });
      assert.strictEqual(patch404.status, 404);

      recordPass('5. PATCH /api/tasks/:id - Partial updates, validations, and 404 handling');
    } catch (e) {
      recordFail('5. PATCH /api/tasks/:id', e);
    }

    // -------------------------------------------------------------
    // Test 6: PUT /api/tasks/:id (Contract.md Section 5.4 support)
    // -------------------------------------------------------------
    try {
      assert.ok(createdTaskId);
      const putRes = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Algorithms Homework 3 (Resubmission)',
          priority: 'medium'
        })
      });

      assert.strictEqual(putRes.status, 200);
      const updatedPut = await putRes.json();
      assert.strictEqual(updatedPut.title, 'Algorithms Homework 3 (Resubmission)');
      assert.strictEqual(updatedPut.priority, 'medium');

      recordPass('6. PUT /api/tasks/:id - Alternate update method works');
    } catch (e) {
      recordFail('6. PUT /api/tasks/:id', e);
    }

    // -------------------------------------------------------------
    // Test 7: PATCH /api/tasks/:id/complete (Shorthand endpoint)
    // -------------------------------------------------------------
    try {
      const res = await fetch(`${BASE_URL}/task-3/complete`, {
        method: 'PATCH'
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.task.id, 'task-3');
      assert.strictEqual(data.task.completed, true);

      recordPass('7. PATCH /api/tasks/:id/complete - Mark complete shorthand');
    } catch (e) {
      recordFail('7. PATCH /api/tasks/:id/complete', e);
    }

    // -------------------------------------------------------------
    // Test 8: DELETE /api/tasks/:id (Deletion and verification)
    // -------------------------------------------------------------
    try {
      assert.ok(createdTaskId);
      const delRes = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'DELETE'
      });
      assert.strictEqual(delRes.status, 200);
      const delData = await delRes.json();
      assert.strictEqual(delData.id, createdTaskId);

      // Verify task is gone
      const verifyRes = await fetch(`${BASE_URL}/${createdTaskId}`);
      assert.strictEqual(verifyRes.status, 404);

      // Deleting non-existent task returns 404
      const del404 = await fetch(`${BASE_URL}/already-deleted-id`, {
        method: 'DELETE'
      });
      assert.strictEqual(del404.status, 404);

      recordPass('8. DELETE /api/tasks/:id - Successful deletion and 404 on missing task');
    } catch (e) {
      recordFail('8. DELETE /api/tasks/:id', e);
    }

    // -------------------------------------------------------------
    // Test 9: Malformed JSON handling
    // -------------------------------------------------------------
    try {
      const malformedRes = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ "title": "Incomplete json'
      });
      assert.strictEqual(malformedRes.status, 400);
      const malformedBody = await malformedRes.json();
      assert.strictEqual(malformedBody.error, 'Bad Request');

      recordPass('9. Error Middleware - Malformed JSON safely caught with 400 Bad Request');
    } catch (e) {
      recordFail('9. Error Middleware', e);
    }

    console.log('\n===========================================================');
    console.log(` Test Results: ${passed} passed, ${failed} failed`);
    console.log('===========================================================');

    if (failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    server.close();
  }
}

runTests();
