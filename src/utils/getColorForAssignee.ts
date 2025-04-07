import { COLORS } from '../colorPalette';
import { Chore } from '../types';

export function getColorForAssignee(assignee: string, chores: Chore[]): string {
  // Check if the assignee already has a color
  const existing = chores.find(
    (c) => c.assignee.toLowerCase() === assignee.toLowerCase(),
  );
  if (existing) return existing.color;

  // Get used colors
  const usedColors = chores.map((c) => c.color);

  // Find a color that hasn't been used
  const unused = COLORS.find((color) => !usedColors.includes(color));

  // Use unused if available, or fallback to gray
  return unused || 'bg-gray-500';
}
