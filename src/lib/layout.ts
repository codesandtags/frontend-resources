/**
 * README layout configuration
 * Defines the structure and order of sections in the generated README.md
 *
 * Note: The actual layout data is stored in layout.json for runtime use.
 * This file provides TypeScript types and can be used for type checking.
 */
export interface LayoutGroup {
  group: string;
  sections: string[];
}

/**
 * Type definition for README layout
 * The actual data is loaded from layout.json at runtime
 */
export type README_LAYOUT = LayoutGroup[];
