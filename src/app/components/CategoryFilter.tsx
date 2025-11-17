import { Category } from "../types/resource";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategories: Set<Category>;
  onToggle: (category: Category) => void;
  onClear: () => void;
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
  selectedCategories,
  onToggle,
  onClear,
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          Categories
          {selectedCategories.size > 0 && (
            <span className="text-xs font-normal text-gray-400">
              ({selectedCategories.size} selected)
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {selectedCategories.size > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col space-y-2 max-h-[60vh] overflow-y-auto">
          {categories.map((category) => {
            const isSelected = selectedCategories.has(category);
            return (
              <label
                key={category}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(category)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-gray-300 flex-1">{category}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
