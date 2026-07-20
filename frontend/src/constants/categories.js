// Single source of truth for job categories.
// Home.jsx (category cards) and Jobs.jsx (filter dropdown) both import this,
// so a job posted under "Development" is always filterable as "Development" —
// no more mismatched category names between pages.
export const CATEGORIES = [
  { name: "Development", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📣" },
  { name: "Sales", icon: "📈" },
  { name: "Finance", icon: "💰" },
  { name: "Operations", icon: "⚙️" },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
