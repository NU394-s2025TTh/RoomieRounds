export function formatDueDate(day: string): string {
  const now = new Date();
  const due = new Date(day);
  const diffInDays = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const timeString = due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (diffInDays === 0) {
    return `Today at ${timeString}`;
  } else if (diffInDays === 1) {
    return `Tomorrow at ${timeString}`;
  } else if (diffInDays > 1) {
    return `Due in ${diffInDays} days at ${timeString}`;
  } else if (diffInDays === -1) {
    return `Yesterday at ${timeString}`;
  } else {
    return `Overdue by ${Math.abs(diffInDays)} days`;
  }
}
