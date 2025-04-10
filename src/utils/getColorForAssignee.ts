import { COLORS } from '../colorPalette';

function simpleHash(str: string): number {
  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function getColorForAssignee(assignee: string): string {
  const index = simpleHash(assignee.toLowerCase()) % COLORS.length;
  return COLORS[index];
}
