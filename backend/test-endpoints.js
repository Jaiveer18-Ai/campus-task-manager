const assert = require('assert');
const app = require('./server');

async function runTests() {
  console.log('--- Starting Contract.md Compliant API Verification ---\n');

  // Start test server on random free port
  const server = app.listen(0);
  const port = server.address().port;
  const BASE_URL = `http://localhost:${port}/api/tasks`;

  let passed = 0;
  let failed = 0;

  try {
    // 1. GET /api/tasks (List all tasks)
    try {
      const res = await fetch(BASE_URL);
      assert.strictEqual(res.status, 200);
      const tasks = await res.json();
      assert.ok(Array.isArray(tasks), 'Tasks should be an array');
      assert.strictEqual(tasks.length, 6, 'Should start with 6 initial mock tasks');
      
      const t = tasks[0];
      assert.ok(t.id && t.title && t.course && t.category && t.priority && t.createdAt && t.updatedAt);
      console.log('✅ [PASS] 1. GET /api/tasks - Initial tasks loaded matching Contract.md');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 1. GET /api/tasks:', err.message);
      failed++;
    }

    // 2. GET /api/tasks with filters (status and search)
    try {
      const resStatus = await fetch(`${BASE_URL}?status=completed`);
      const completedTasks = await resStatus.json();
      assert.ok(completedTasks.every(t => t.completed === true));

      const resSearch = await fetch(`${BASE_URL}?search=Calculus`);
      const searchTasks = await resSearch.json();
      assert.ok(searchTasks.some(t => t.title.includes('Calculus')));

      console.log('✅ [PASS] 2. GET /api/tasks?query - Filter & Search support verified');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 2. GET /api/tasks?query:', err.message);
      failed++;
    }

    // 3. GET /api/tasks/:id (Single task)
    try {
      const res = await fetch(`${BASE_URL}/task-1`);
      assert.strictEqual(res.status, 200);
      const task = await res.json();
      assert.strictEqual(task.id, 'task-1');

      // Test 404
      const res404 = await fetch(`${BASE_URL}/non-existent-task`);
      assert.strictEqual(res404.status, 404);
      const errBody = await res404.json();
      assert.strictEqual(errBody.error, 'Not Found');

      console.log('✅ [PASS] 3. GET /api/tasks/:id - Found task & verified 404 envelope');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 3. GET /api/tasks/:id:', err.message);
      failed++;
    }

    // 4. POST /api/tasks (Create task with Contract.md schema)
    let createdTaskId = null;
    try {
      const payload = {
        title: 'Chemistry Organic Lab Synthesis',
        course: 'CHEM101',
        category: 'Assignment',
        priority: 'high',
        dueDate: '2026-09-22T17:00:00.000Z',
        description: 'Prepare reaction flasks and safety equipment.'
      };

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert.strictEqual(res.status, 201);
      const newTask = await res.json();
      assert.ok(newTask.id.startsWith('task-'));
      assert.strictEqual(newTask.title, payload.title);
      assert.strictEqual(newTask.course, payload.course);
      assert.strictEqual(newTask.category, payload.category);
      assert.strictEqual(newTask.priority, payload.priority);
      assert.strictEqual(newTask.completed, false);
      assert.ok(newTask.createdAt && newTask.updatedAt);

      createdTaskId = newTask.id;

      // Test 400 Bad Request
      const badRes = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' })
      });
      assert.strictEqual(badRes.status, 400);
      const badBody = await badRes.json();
      assert.strictEqual(badBody.error, 'Bad Request');
      assert.ok(badBody.details && badBody.details.length > 0);

      console.log('✅ [PASS] 4. POST /api/tasks - Created task & verified 400 validation envelope');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 4. POST /api/tasks:', err.message);
      failed++;
    }

    // 5. PATCH /api/tasks/:id (Partial updates)
    try {
      assert.ok(createdTaskId);
      const patchRes = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: 'medium', completed: true })
      });

      assert.strictEqual(patchRes.status, 200);
      const updated = await patchRes.json();
      assert.strictEqual(updated.priority, 'medium');
      assert.strictEqual(updated.completed, true);

      console.log('✅ [PASS] 5. PATCH /api/tasks/:id - Partial update successful');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 5. PATCH /api/tasks/:id:', err.message);
      failed++;
    }

    // 6. DELETE /api/tasks/:id
    try {
      assert.ok(createdTaskId);
      const delRes = await fetch(`${BASE_URL}/${createdTaskId}`, {
        method: 'DELETE'
      });
      assert.strictEqual(delRes.status, 200);
      const delBody = await delRes.json();
      assert.strictEqual(delBody.id, createdTaskId);

      // Verify task is deleted
      const checkRes = await fetch(`${BASE_URL}/${createdTaskId}`);
      assert.strictEqual(checkRes.status, 404);

      console.log('✅ [PASS] 6. DELETE /api/tasks/:id - Deletion verified');
      passed++;
    } catch (err) {
      console.error('❌ [FAIL] 6. DELETE /api/tasks/:id:', err.message);
      failed++;
    }

    console.log(`\n--- Test Summary: ${passed} passed, ${failed} failed ---`);
    if (failed > 0) process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
