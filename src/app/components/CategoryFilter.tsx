import { Category } from "../types/resource";

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelect: (category: Category | null) => void;
}

const categories: Category[] = [
  // 1. Fundamentals
  "CSS",
  "TypeScript",
  // 2. Frameworks & Ecosystem
  "Framework",
  "UI Library",
  "State Management",
  // 3. Core Concepts
  "Accessibility",
  "Performance",
  "Testing",
  "Security",
  // 4. Tools & Types
  "Tool",
  "Learning",
  "Design Resources",
  "PWA",
  "Animation",
  "Data Visualization",
  "3D & WebGL",
  "Platforms & Hosting",
  "Public APIs",
  "Git",
  "Utilities",
  "Web VR",
];

export function CategoryFilter({
  selectedCategory,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
          ${
            !selectedCategory
              ? "bg-blue-600 text-white"
              : "bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-800"
          }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
            ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-800"
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
