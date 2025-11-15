# How-To Guide

This guide explains how to work with the frontend resources repository, including how to generate the README.md file and how resources.json is used in the website.

## Table of Contents

- [Generating README.md](#generating-readmemd)
- [How resources.json is Used in the Website](#how-resourcesjson-is-used-in-the-website)
- [Adding New Resources](#adding-new-resources)
- [Resource Data Structure](#resource-data-structure)

---

## Generating README.md

The `README.md` file is automatically generated from `src/data/resources.json` using a generator script. This ensures the README stays in sync with the actual resource data.

### Quick Start

To generate the README.md file, run:

```bash
npm run generate:readme
```

This command will:

1. Read all resources from `src/data/resources.json`
2. Read the template from `README.template.md`
3. Group resources by category and map them to appropriate sections
4. Generate a Table of Contents with proper anchor links
5. Format resources as markdown bullet points
6. Insert the generated content into the template
7. Write the final `README.md` file

### How It Works

The generator (`src/lib/generator.ts`) performs the following steps:

1. **Reads Resources**: Loads all resources from `src/data/resources.json`

2. **Categorizes Resources**: Uses the `getResourceSection()` function to map each resource to a README section based on:

   - Resource category (Framework, Tool, Learning, etc.)
   - Resource tags (for more specific categorization)
   - Special rules for frameworks (React, Vue, Angular, etc.)

3. **Generates Table of Contents**: Creates a structured TOC with links to all sections, organized by main groups:

   - Start Broad (HTML5, CSS, JavaScript/TypeScript)
   - Core Concepts (Accessibility, Performance, Security, PWA)
   - Frameworks & Libraries (React, Vue, Angular, etc.)
   - Tooling (Build Tools, Testing, Linting, etc.)
   - Beyond the Code (Design Systems, Animation, Data Visualization, etc.)

4. **Generates Content Sections**:

   - Groups resources by section
   - Sorts resources alphabetically within each section
   - Formats each resource as: `- [Title](URL) - Description`

5. **Combines with Template**:
   - Reads `README.template.md` (contains header, badges, contribution guidelines, etc.)
   - Inserts generated TOC and content after the "Table of Contents" marker
   - Preserves the footer (Contributing, License sections)

### Section Mapping Logic

The generator uses intelligent mapping to place resources in the correct sections:

- **Framework resources** are split by tags:

  - React/Next.js → React Ecosystem
  - Angular → Angular
  - Vue/Nuxt → Vue.js
  - Svelte/SvelteKit → Svelte
  - etc.

- **Tool resources** are categorized by type:

  - Bundlers (Vite, Webpack, Rollup) → Build Tools & Bundlers
  - Transpilers (Babel, SWC) → Transpiling & Compiling
  - Linters (ESLint, Prettier) → Linting & Formatting
  - Node.js tools → Development Tools

- **Learning resources** are mapped to specific sections:
  - HTML5 tags → HTML5 section
  - CSS tags → CSS3 & SCSS section
  - JavaScript/TypeScript tags → JavaScript / TypeScript section
  - Others → Learning Resources section

### When to Regenerate

You should regenerate the README.md file:

- After adding new resources to `resources.json`
- After modifying existing resources (title, description, category, tags)
- After removing resources
- Before committing changes to the repository

---

## How resources.json is Used in the Website

The `src/data/resources.json` file is the **single source of truth** for all resources displayed on the website. The website uses this JSON file through a data access layer.

### Data Flow

```
resources.json → src/lib/resources.ts → Website Components
```

### Data Access Layer (`src/lib/resources.ts`)

The `resources.ts` file provides several functions to work with resources:

#### `getResources(): Resource[]`

Returns all resources from the JSON file. This is the main function used by the website.

```typescript
import { getResources } from "@/lib/resources";

const allResources = getResources();
```

#### `getResourcesByCategory(category: string): Resource[]`

Filters resources by a specific category.

```typescript
const reactResources = getResourcesByCategory("Framework");
```

#### `searchResources(query: string): Resource[]`

Searches resources by title, description, or tags (case-insensitive).

```typescript
const results = searchResources("react");
```

#### `validateResources()`

Checks for duplicate IDs and URLs in the resources file. Useful for data integrity.

```typescript
const validation = validateResources();
if (!validation.isValid) {
  console.error(
    "Duplicates found:",
    validation.duplicateIds,
    validation.duplicateUrls
  );
}
```

### Website Components

The website components use these functions to display resources:

#### Main App Component (`src/app/components/App.tsx`)

```typescript
import { getResources } from "../../lib/resources";

// Load all resources
const resources = useMemo(() => getResources(), []);

// Filter resources based on search and category
const filteredResources = useMemo(() => {
  return resources.filter((resource) => {
    const matchesSearch = /* search logic */;
    const matchesCategory = /* category filter */;
    return matchesSearch && matchesCategory;
  });
}, [resources, search, selectedCategory]);
```

#### Resource Card Component (`src/app/components/ResourceCard.tsx`)

Displays individual resource cards with:

- Resource title (linked to URL)
- Description
- Category icon (based on category)
- Tags
- Date added
- Like button (client-side only)

#### API Route (`src/app/api/resources/route.ts`)

Provides a REST API endpoint that returns all resources:

```typescript
import { getResources } from "@/lib/resources";

export async function GET() {
  const resources = getResources();
  return NextResponse.json(resources);
}
```

### Resource Structure

Each resource in `resources.json` follows this structure:

```json
{
  "id": "unique-slug-for-your-resource",
  "title": "Resource Title",
  "url": "https://resource-url.com",
  "description": "A short, one-sentence description.",
  "category": "Framework",
  "tags": ["tag1", "tag2", "tag3"],
  "addedOn": "2024-01-01"
}
```

### Available Categories

The website supports these categories (defined in `src/app/types/resource.ts`):

- Framework
- UI Library
- Tool
- Learning
- Performance
- Testing
- State Management
- CSS
- TypeScript
- Accessibility
- Security
- PWA
- Animation
- Data Visualization
- 3D & WebGL
- Platforms & Hosting
- Public APIs
- Git
- Design Resources
- Utilities
- Web VR

### Features

1. **Search Functionality**: Users can search resources by title, description, or tags
2. **Category Filtering**: Users can filter resources by category
3. **Responsive Design**: The website is fully responsive and works on all devices
4. **Client-Side Filtering**: All filtering happens in the browser for fast performance
5. **Static Site**: The website is a static Next.js site, so resources are loaded at build time

---

## Adding New Resources

To add a new resource to the website:

1. **Edit `src/data/resources.json`**:

   - Add a new object to the array
   - Follow the resource structure (see above)
   - Use a unique `id` (kebab-case slug)
   - Choose an appropriate `category`
   - Add relevant `tags`

2. **Regenerate README.md**:

   ```bash
   npm run generate:readme
   ```

3. **Test the website**:

   ```bash
   npm run dev
   ```

   - Verify the resource appears in the website
   - Check that search and filtering work correctly

4. **Validate resources** (optional):
   ```bash
   npm run test
   ```
   This runs unit tests that check for duplicates and validate the data structure.

---

## Resource Data Structure

### Required Fields

- `id` (string): Unique identifier, typically a kebab-case slug
- `title` (string): Display name of the resource
- `url` (string): Full URL to the resource
- `description` (string): One-sentence description
- `category` (string): One of the supported categories
- `tags` (string[]): Array of relevant tags
- `addedOn` (string): Date in YYYY-MM-DD format

### Best Practices

1. **IDs**: Use kebab-case, lowercase, no special characters

   - ✅ `react-documentation`
   - ❌ `React Documentation`

2. **Descriptions**: Keep them concise (one sentence), informative, and start with a capital letter

3. **Tags**: Use lowercase, relevant tags that help with search

   - Include the main technology (e.g., "react", "vue", "css")
   - Include the type (e.g., "documentation", "tutorial", "tool")
   - Include relevant concepts (e.g., "hooks", "routing", "animation")

4. **Categories**: Choose the most specific category that fits

   - Framework resources → "Framework"
   - UI component libraries → "UI Library"
   - Development tools → "Tool"
   - Learning materials → "Learning"

5. **URLs**: Always use HTTPS when available, and ensure URLs are valid

---

## Troubleshooting

### README.md not updating

- Make sure you ran `npm run generate:readme`
- Check that `resources.json` is valid JSON (no syntax errors)
- Verify the generator script completed without errors

### Resource not appearing on website

- Check that the resource is in `resources.json`
- Verify the JSON syntax is correct
- Make sure the category matches one of the supported categories
- Restart the dev server: `npm run dev`

### Duplicate resources

- Run the validation function: `validateResources()`
- Check for duplicate IDs or URLs
- Remove or merge duplicate entries

---

## Summary

- **README.md**: Generated automatically from `resources.json` using `npm run generate:readme`
- **Website**: Uses `resources.json` through `src/lib/resources.ts` functions
- **Single Source of Truth**: `src/data/resources.json` contains all resource data
- **Always regenerate README.md** after modifying `resources.json`
