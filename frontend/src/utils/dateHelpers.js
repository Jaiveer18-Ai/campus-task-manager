/**
 * Helper utilities for student task due dates, deadlines, and status chips
 */

export function formatDueDate(dateString) {
  if (!dateString) return '';
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
  if (isCompleted) {
    return {
      label: '',
      urgency: 'completed',
      chipLabel: 'Completed',
      chipVariant: 'completed'
    };
  }

  if (!dateString) {
    return { label: '', urgency: 'none', chipLabel: null, chipVariant: 'none' };
  }

  const due = new Date(dateString);
  const now = new Date();

  // Day comparison
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.round((dueDay - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    const text = overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`;
    return {
      label: text,
      urgency: 'urgent',
      chipLabel: 'Overdue',
      chipVariant: 'urgent'
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due today',
      urgency: 'urgent',
      chipLabel: 'Due Today',
      chipVariant: 'urgent'
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due tomorrow',
      urgency: 'soon',
      chipLabel: 'In 1 day',
      chipVariant: 'soon'
    };
  } else if (diffDays <= 3) {
    return {
      label: `In ${diffDays} days`,
      urgency: 'soon',
      chipLabel: `In ${diffDays} days`,
      chipVariant: 'soon'
    };
  } else {
    return {
      label: `In ${diffDays} days`,
      urgency: 'upcoming',
      chipLabel: `In ${diffDays} days`,
      chipVariant: 'upcoming'
    };
  }
}
