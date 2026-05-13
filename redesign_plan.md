# Navigation and Sidebar Redesign Plan

## 1. Sidebar Redesign
- **Layout**: Increase width to 260px for better readability.
- **Styling**: 
  - Use a clean, white background with a subtle right border (`1px solid #e5e7eb`).
  - Remove the large left margin (`50px`) and use a more standard layout.
  - Improve item spacing and padding.
- **Icons**: 
  - Continue using existing SVGs but ensure they are consistently sized (20x20px).
  - Improve hover and active states with a subtle background highlight and color change.
- **Functionality**:
  - Ensure the sidebar is sticky or has a fixed height with internal scrolling if needed.

## 2. Header Redesign
- **Layout**: 
  - Height: 70px.
  - Flexbox layout with `justify-content: space-between`.
- **Styling**:
  - White background with a subtle bottom shadow.
  - Modernize the user profile and credit display (use pill-shaped badges for credits).
- **Logo**: Ensure it's properly aligned and sized.

## 3. Technical Changes
- **CSS**: 
  - Introduce CSS variables for primary colors and spacing.
  - Refactor `.sidebar` and `.navbar` classes in `styles.css`.
- **JSX**:
  - Update `SideMenu.jsx` to use a more semantic structure.
  - Update `Header.jsx` for the new layout.
  - Adjust `_app.js` or `Content.jsx` if global layout spacing needs to change.

## 4. Implementation Steps
1.  Update `styles.css` with new variables and base styles for nav/sidebar.
2.  Modify `Header.jsx` for the new header design.
3.  Modify `SideMenu.jsx` for the new sidebar design.
4.  Adjust global layout in `_app.js` to accommodate the new sidebar width.
