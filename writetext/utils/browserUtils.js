/**
 * Checks if the browser window is not maximized
 * @returns {boolean} Returns true if the window is not maximized, false otherwise
 */
export const isWindowNotMaximized = () => {
  // Check if window is available (for SSR compatibility)
  if (typeof window === 'undefined') {
    return false;
  }

  // Get the screen dimensions
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  // Get the window dimensions
  const windowWidth = window.outerWidth || window.innerWidth;
  const windowHeight = window.outerHeight || window.innerHeight;

  // Calculate the difference between screen and window dimensions
  const widthDiff = screenWidth - windowWidth;
  const heightDiff = screenHeight - windowHeight;

  // Account for typical browser UI elements (approximately)
  const browserUIWidth = 16;  // Scrollbar, borders, etc.
  const browserUIHeight = 100; // Address bar, tabs, etc.

  // Window is considered maximized if it's very close to screen size
  return (
    widthDiff > browserUIWidth ||
    heightDiff > browserUIHeight
  );
}; 