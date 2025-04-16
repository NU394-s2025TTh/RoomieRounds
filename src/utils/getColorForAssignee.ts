import { COLORS } from '../colorPalette';

const assigneeColorMap = new Map<string, string>();
let colorIndex = 0;

export function getColorForAssignee(assignee: string): string {
  if (!assigneeColorMap.has(assignee)) {
    assigneeColorMap.set(assignee, COLORS[colorIndex]);
    colorIndex = (colorIndex + 1) % COLORS.length;
  }
  return assigneeColorMap.get(assignee)!;
}
