const assert = require('assert');
const app = require('./server');

async function runTests() {
  console.log('--- Starting Campus Task Manager API Verification ---\n');

  // Start temporary server on a random free port for isolated testing
  const server = app.listen(0);
  const port = server.address().port;
  const BASE_URL = `http://localhost:${port}/api/tasks`;

  let passed = 0;
  let failed = 0;

  try {
    // -------------------------------------------------------------
    // Test 1: GET /api/tasks
    // -------------------------------------------------------------
    try {
      const res = await fetch(BASE_URL);
      assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
      const tasks = await res.json();
      assert.ok(Array.isArray(tasks), 'Expected response to be an array');
      assert.ok(tasks.length >= 1, 'Expected at least 1 initial task');
      
      const sample = tasks[0];
      assert.ok('id' in sample, 'Task missing "id" property');
      assert.ok('title' in sample, 'Task missing "title" property');
      assert.ok('subject' in sample, 'Task missing "subject" property');
      assert.ok('dueDate' in sample, 'Task missing "dueDate" property');
      assert.ok('completed' in sample, 'Task missing "completed" property');

      console.log('✅ [PASS] 1. GET /api/tasks - Returned all tasks with correct schema');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 1. GET /api/tasks:', err.message);
      failed++;
    }

    // -------------------------------------------------------------
    // Test 2: POST /api/tasks
    // -------------------------------------------------------------
    let createdTaskId = null;
    try {
      const newTaskPayload = {
        title: 'Physics Lab Report',
        subject: 'Physics',
        dueDate: '2026-09-25'
      };

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskPayload)
      });

      assert.strictEqual(res.status, 201, `Expected status 201, got ${res.status}`);
      const createdTask = await res.json();

      assert.ok(createdTask.id, 'Created task is missing an "id"');
      assert.strictEqual(createdTask.title, newTaskPayload.title);
      assert.strictEqual(createdTask.subject, newTaskPayload.subject);
      assert.strictEqual(createdTask.dueDate, newTaskPayload.dueDate);
      assert.strictEqual(createdTask.completed, false, 'New task should default to completed = false');

      createdTaskId = createdTask.id;
      console.log('✅ [PASS] 2. POST /api/tasks - Created new task successfully');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 2. POST /api/tasks:', err.message);
      failed++;
    }

    // -------------------------------------------------------------
    // Test 3: PATCH /api/tasks/:id/complete
    // -------------------------------------------------------------
    try {
      assert.ok(createdTaskId, 'Cannot test PATCH without a created task ID');
      const res = await fetch(`${BASE_URL}/${createdTaskId}/complete`, {
        method: 'PATCH'
      });

      assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
      const data = await res.json();
      assert.ok(data.task, 'Response missing updated task');
      assert.strictEqual(data.task.id, createdTaskId);
      assert.strictEqual(data.task.completed, true, 'Task completed should be true');

      console.log('✅ [PASS] 3. PATCH /api/tasks/:id/complete - Marked task as completed');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 3. PATCH /api/tasks/:id/complete:', err.message);
      failed++;
    }

    // -------------------------------------------------------------
    // Test 4: DELETE /api/tasks/:id
    // -------------------------------------------------------------
    try {
      assert.ok(createdTaskId, 'Cannot test DELETE without a created task ID');
      const res = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'DELETE'
      });

      assert.strictEqual(res.status, 200, `Expected status 200, got ${res.status}`);
      const data = await res.json();
      assert.strictEqual(data.deletedTask.id, createdTaskId);

      // Verify it is actually gone
      const verifyRes = await fetch(BASE_URL);
      const remainingTasks = await verifyRes.json();
      const exists = remainingTasks.some((t) => t.id === createdTaskId);
      assert.strictEqual(exists, false, 'Deleted task still present in list');

      console.log('✅ [PASS] 4. DELETE /api/tasks/:id - Deleted task successfully');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 4. DELETE /api/tasks/:id:', err.message);
      failed++;
    }

    console.log(`\n--- Test Summary: ${passed} passed, ${failed} failed ---`);

    if (failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    server.close();
  }
}

runTests();
