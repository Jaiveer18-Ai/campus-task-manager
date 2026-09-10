/**
 * Initial mock tasks for campus task manager.
 * Fully compliant with docs/API_CONTRACT.md schema.
 */

function getOffsetDate(daysOffset, hours = 17, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString(); // Full ISO 8601 timestamp compliant with API contract
}

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Pick up validated student semester transit pass',
    course: 'Campus Life',
    category: 'Personal',
    priority: 'low',
    dueDate: getOffsetDate(-1, 10, 30), // Yesterday
    description: 'Visit the Campus Student Services desk in Union Building Room 204.',
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'task-2',
    title: 'Submit Data Structures Lab 4 (Binary Search Trees)',
    course: 'CS101',
    category: 'Assignment',
    priority: 'high',
    dueDate: getOffsetDate(0, 18, 29), // Due today
    description: 'Implement recursive insertion, deletion, and in-order traversal with unit test verification.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-3',
    title: 'Prepare for Midterm Exam',
    course: 'MATH201',
    category: 'Exam Prep',
    priority: 'high',
    dueDate: getOffsetDate(2, 9, 0), // In 2 days
    description: 'Review chapters 1-5, practice past papers, and solve sample problems.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'task-4',
    title: "Read and Analyze 'The Great Gatsby'",
    course: 'ENG102',
    category: 'Reading',
    priority: 'medium',
    dueDate: getOffsetDate(4, 23, 59), // In 4 days
    description: 'Complete analysis notes and be ready for class discussion.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'task-5',
    title: 'Optics Experiment Lab Report & Graph Analysis',
    course: 'PHYS150',
    category: 'Project',
    priority: 'medium',
    dueDate: getOffsetDate(6, 18, 0), // In 6 days
    description: 'Plot Snell’s Law refraction index findings and write abstract with lab partner.',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'task-6',
    title: 'ACM Coding Club Hackathon Team Registration',
    course: 'Club',
    category: 'Project',
    priority: 'low',
    dueDate: getOffsetDate(5, 20, 0),
    description: 'Confirm team roster of 4 members and submit project pitch outline.',
    completed: true,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const COURSE_OPTIONS = [
  'CS101',
  'MATH201',
  'PHYS150',
  'ENG102',
  'Campus Life',
  'Club',
  'General'
];

export const CATEGORY_OPTIONS = [
  'Assignment',
  'Exam Prep',
  'Project',
  'Reading',
  'Personal'
];
