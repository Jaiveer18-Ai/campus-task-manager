/**
 * Initial mock tasks for campus task manager.
 * Uses dynamically calculated dates so the task list feels fresh and alive.
 */

function getOffsetDate(daysOffset, hours = 17, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM for datetime-local
}

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Submit Data Structures Lab 4 (Binary Search Trees)',
    course: 'CS101',
    category: 'Assignment',
    priority: 'high',
    dueDate: getOffsetDate(0, 23, 59), // Due today
    description: 'Implement recursive insertion, deletion, and in-order traversal with unit test verification.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-2',
    title: 'Multivariable Calculus Midterm 1 Practice Exam',
    course: 'MATH201',
    category: 'Exam Prep',
    priority: 'high',
    dueDate: getOffsetDate(2, 14, 0), // Due in 2 days
    description: 'Solve chapter 14 review problems on partial derivatives and gradient vectors.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'task-3',
    title: 'Optics Experiment Lab Report & Graph Analysis',
    course: 'PHYS150',
    category: 'Project',
    priority: 'medium',
    dueDate: getOffsetDate(4, 18, 0), // Due in 4 days
    description: 'Plot Snell’s Law refraction index findings and write abstract with lab partner.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-4',
    title: 'Modernist American Poetry Reading (Ch. 4-6)',
    course: 'ENG102',
    category: 'Reading',
    priority: 'low',
    dueDate: getOffsetDate(6, 10, 0), // Due in 6 days
    description: 'Annotate key metaphors in Wallace Stevens and Robert Frost selections.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'task-5',
    title: 'Pick up validated student semester transit pass',
    course: 'Campus Life',
    category: 'Personal',
    priority: 'low',
    dueDate: getOffsetDate(-1, 16, 0), // Yesterday
    description: 'Visit the Campus Student Services desk in Union Building Room 204.',
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'task-6',
    title: 'ACM Coding Club Hackathon Team Registration',
    course: 'Club / Extracurricular',
    category: 'Project',
    priority: 'medium',
    dueDate: getOffsetDate(5, 20, 0),
    description: 'Confirm team roster of 4 members and submit project pitch outline.',
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

export const COURSE_OPTIONS = [
  'CS101',
  'MATH201',
  'PHYS150',
  'ENG102',
  'Campus Life',
  'Club / Extracurricular'
];

export const CATEGORY_OPTIONS = [
  'Assignment',
  'Exam Prep',
  'Project',
  'Reading',
  'Personal'
];
