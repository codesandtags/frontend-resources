import { Resource as BaseResource } from "../../lib/resources";

export interface Resource extends BaseResource {
  category: Category;
  // Computed fields for display
  likes?: number;
}

export type Category =
  | "Framework"
  | "UI Library"
  | "Tool"
  | "Learning"
  | "Performance"
  | "Testing"
  | "State Management"
  | "CSS"
  | "TypeScript"
  | "Accessibility"
  | "Security"
  | "PWA"
  | "Animation"
  | "Data Visualization"
  | "3D & WebGL"
  | "Platforms & Hosting"
  | "Public APIs"
  | "Git"
  | "Design Resources"
  | "Utilities"
  | "Web VR";
