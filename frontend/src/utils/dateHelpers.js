/**
 * Helper utilities for student task due dates and deadlines
 */

export function formatDueDate(dateString) {
  if (!dateString) return 'No due date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getDueStatus(dateString, isCompleted) {
  if (!dateString || isCompleted) return { label: '', urgency: 'none' };
  
  const due = new Date(dateString);
  const now = new Date();
  
  // Set both to start of day for accurate day-difference calculation
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      urgency: 'urgent'
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due today',
      urgency: 'urgent'
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due tomorrow',
      urgency: 'soon'
    };
  } else if (diffDays <= 3) {
    return {
      label: `Due in ${diffDays} days`,
      urgency: 'soon'
    };
  } else {
    return {
      label: `Due in ${diffDays} days`,
      urgency: 'normal'
    };
  }
}
