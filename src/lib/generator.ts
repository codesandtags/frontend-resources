import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Resource } from "./resources";

// Read layout configuration from JSON file
const layoutPath = join(process.cwd(), "src/lib/layout.json");
const layoutJson = readFileSync(layoutPath, "utf-8");
const README_LAYOUT: Array<{ group: string; sections: string[] }> =
  JSON.parse(layoutJson);

/**
 * Maps JSON categories to README section names (default mappings)
 * Some categories will be refined by tags in getResourceSection()
 */
const categoryToSectionMap: Record<string, string> = {
  // Start Broad
  CSS: "CSS3 & SCSS",
  TypeScript: "JavaScript / TypeScript",

  // Core Concepts
  Accessibility: "Accessibility (A11Y)",
  Performance: "Performance",
  Security: "Security",
  PWA: "Progressive Web Apps (PWA)",

  // Frameworks & Libraries
  "UI Library": "Design Systems & UI/UX",

  // Tooling
  Testing: "Testing",
  Git: "Git",

  // Beyond the Code
  Animation: "Animation",
  "Data Visualization": "Data Visualization",
  "3D & WebGL": "3D & WebGL",
  "Platforms & Hosting": "Platforms & Hosting",
  "Public APIs": "Public APIs",
  "Design Resources": "Design Systems & UI/UX",
  Utilities: "Development Tools",
  "Web VR": "Web VR / Virtual Reality",
};

/**
 * Determines the README section for a resource based on category and tags
 */
function getResourceSection(resource: Resource): string {
  const { category, tags } = resource;
  const tagsLower = tags.map((t) => t.toLowerCase());

  // Framework-specific mappings
  if (category === "Framework") {
    // Check for backend frameworks first to avoid misclassification
    if (
      tagsLower.includes("backend") ||
      tagsLower.includes("server") ||
      (tagsLower.includes("nodejs") && !tagsLower.includes("react"))
    ) {
      // Backend frameworks should go to Development Tools in a frontend-focused repo
      return "Development Tools";
    }
    if (tagsLower.includes("react") || tagsLower.includes("nextjs")) {
      return "React Ecosystem";
    }
    if (tagsLower.includes("angular")) {
      return "Angular";
    }
    if (tagsLower.includes("vue") || tagsLower.includes("nuxt")) {
      return "Vue.js";
    }
    if (tagsLower.includes("svelte") || tagsLower.includes("sveltekit")) {
      return "Svelte";
    }
    if (tagsLower.includes("ember")) {
      return "Ember.js";
    }
    if (
      tagsLower.includes("web-components") ||
      tagsLower.includes("custom-elements")
    ) {
      return "Web Components";
    }
    if (tagsLower.includes("micro-frontends")) {
      return "Micro Front-End";
    }
    // No default - let it fall through to category mapping or general fallback
    // This requires explicit categorization to avoid misplacement
  }

  // Tool-specific mappings
  if (category === "Tool") {
    if (
      tagsLower.includes("bundler") ||
      tagsLower.includes("vite") ||
      tagsLower.includes("webpack") ||
      tagsLower.includes("rollup") ||
      tagsLower.includes("parcel") ||
      tagsLower.includes("turbopack")
    ) {
      return "Build Tools & Bundlers";
    }
    if (
      tagsLower.includes("babel") ||
      tagsLower.includes("swc") ||
      tagsLower.includes("transpiler") ||
      tagsLower.includes("compiler")
    ) {
      return "Transpiling & Compiling";
    }
    if (
      tagsLower.includes("eslint") ||
      tagsLower.includes("prettier") ||
      tagsLower.includes("stylelint") ||
      tagsLower.includes("linting") ||
      tagsLower.includes("formatting")
    ) {
      return "Linting & Formatting";
    }
    if (
      tagsLower.includes("nodejs") ||
      tagsLower.includes("npm") ||
      tagsLower.includes("yarn") ||
      tagsLower.includes("pnpm")
    ) {
      return "Development Tools";
    }
    return "Development Tools"; // Default for tools
  }

  // State Management category - check tags to determine framework-specific placement
  if (category === "State Management") {
    // Angular-specific state management (e.g., NgRx)
    if (tagsLower.includes("angular")) {
      return "Angular";
    }
    // React-specific state management (e.g., Redux, React Query)
    if (tagsLower.includes("react")) {
      return "React Ecosystem";
    }
    // Framework-agnostic libraries (e.g., RxJS) go to JavaScript/TypeScript section
    return "JavaScript / TypeScript";
  }

  // Learning resources mapping - check tags first
  // Only check Learning category, not Tool category
  if (category === "Learning") {
    // Only check for HTML5 if it's actually about HTML5, not just "html" tag
    if (tagsLower.some((tag) => tag.includes("html5"))) {
      return "HTML5";
    }
    // Check title for HTML5 specifically
    const titleLower = resource.title.toLowerCase();
    if (titleLower.includes("html5")) {
      return "HTML5";
    }
    // For general "html" tag in Learning category, check if it's HTML5 related
    if (
      tagsLower.some((tag) => tag.includes("html")) &&
      (titleLower.includes("html5") || titleLower.includes("html"))
    ) {
      return "HTML5";
    }
    if (tagsLower.some((tag) => tag.includes("css"))) {
      return "CSS3 & SCSS";
    }
    if (
      tagsLower.some(
        (tag) =>
          tag.includes("javascript") ||
          tag.includes("typescript") ||
          tag === "js"
      )
    ) {
      return "JavaScript / TypeScript";
    }
    return "Learning Resources";
  }

  // Direct category mappings (check after specific category logic)
  if (categoryToSectionMap[category]) {
    return categoryToSectionMap[category];
  }

  // Default fallback
  return "Learning Resources";
}

/**
 * Converts a section name to a markdown anchor (for Table of Contents)
 */
function sectionToAnchor(section: string): string {
  return section
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates the Table of Contents based on sections
 * Note: The header "## 📑 Table of Contents" is already in the template
 */
function generateTableOfContents(sections: Map<string, Resource[]>): string {
  const toc: string[] = [];

  README_LAYOUT.forEach((group) => {
    toc.push(`### ${group.group}\n`);
    group.sections.forEach((sectionName) => {
      if (sections.has(sectionName)) {
        toc.push(`- [${sectionName}](#${sectionToAnchor(sectionName)})`);
      }
    });
    toc.push(""); // new line after each group
  });

  return toc.join("\n");
}

/**
 * Generates markdown content for a section
 */
function generateSectionContent(
  sectionName: string,
  resources: Resource[]
): string {
  if (resources.length === 0) return "";

  const lines: string[] = [];
  lines.push(`### ${sectionName}\n`);

  // Sort resources alphabetically by title
  const sortedResources = [...resources].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  sortedResources.forEach((resource) => {
    lines.push(
      `- [${resource.title}](${resource.url}) - ${resource.description}`
    );
  });

  lines.push(""); // Empty line after section
  return lines.join("\n");
}

/**
 * Generates the main content sections
 */
function generateContentSections(sections: Map<string, Resource[]>): string {
  const content: string[] = ["---\n"];

  README_LAYOUT.forEach((group) => {
    // Check if this group has any sections with resources
    const hasResources = group.sections.some((sectionName) =>
      sections.has(sectionName)
    );

    if (hasResources) {
      content.push(`## ${group.group}\n`);
      group.sections.forEach((sectionName) => {
        if (sections.has(sectionName)) {
          content.push(
            generateSectionContent(sectionName, sections.get(sectionName)!)
          );
        }
      });
    }
  });

  return content.join("\n");
}

/**
 * Main function to generate README.md from resources.json
 */
export function generateREADME(): void {
  const rootDir = process.cwd();
  const templatePath = join(rootDir, "README.template.md");
  const outputPath = join(rootDir, "README.md");

  // Read template
  const template = readFileSync(templatePath, "utf-8");

  // Read resources from JSON file
  const resourcesPath = join(rootDir, "src/data/resources.json");
  const resourcesJson = readFileSync(resourcesPath, "utf-8");
  const resources = JSON.parse(resourcesJson) as Resource[];

  // Group resources by section
  const sections = new Map<string, Resource[]>();
  resources.forEach((resource) => {
    const section = getResourceSection(resource);
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section)!.push(resource);
  });

  // Generate Table of Contents
  const toc = generateTableOfContents(sections);

  // Generate content sections
  const content = generateContentSections(sections);

  // Find where to insert content (after "Table of Contents" section)
  const tocMarker = "## 📑 Table of Contents";
  const tocIndex = template.indexOf(tocMarker);

  if (tocIndex === -1) {
    throw new Error("Could not find 'Table of Contents' section in template");
  }

  // Find the end of the template header (before Contributing section)
  const contributingMarker = "## 🤝 Contributing";
  const contributingIndex = template.indexOf(contributingMarker);

  if (contributingIndex === -1) {
    throw new Error("Could not find 'Contributing' section in template");
  }

  // Build the final README
  const header = template.substring(0, tocIndex + tocMarker.length);
  const footer = template.substring(contributingIndex);

  const finalREADME = `${header}\n\n${toc}\n${content}\n${footer}`;

  // Write to README.md
  writeFileSync(outputPath, finalREADME, "utf-8");

  console.log("✅ README.md generated successfully!");
  console.log(`📊 Total resources: ${resources.length}`);
  console.log(`📁 Sections: ${sections.size}`);
  sections.forEach((resources, section) => {
    console.log(`   - ${section}: ${resources.length} resources`);
  });
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateREADME();
}
