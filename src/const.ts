function getCSSVariable(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

export const Colors = {
  primary: getCSSVariable('--accent-primary'),
  secondary: getCSSVariable('--accent-secondary'),
  background: getCSSVariable('--background'),
  text: getCSSVariable('--text')
};
