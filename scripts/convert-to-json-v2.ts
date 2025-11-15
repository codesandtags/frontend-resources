import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Read the resources.ts file
const resourcesPath = join(process.cwd(), "src/app/data/resources.ts");
const content = readFileSync(resourcesPath, "utf-8");

// Extract the resources array content
const arrayMatch = content.match(/export const resources: Resource\[\] = \[([\s\S]*)\];/);
if (!arrayMatch) {
  throw new Error("Could not find resources array");
}

const resourcesText = arrayMatch[1];
const resources: any[] = [];

// Split by resource objects (look for id: generateId)
const resourceBlocks = resourcesText.split(/(?=\s*\{\s*id:\s*generateId)/).filter(block => block.trim().length > 0);

for (const block of resourceBlocks) {
  try {
    // Extract id
    const idMatch = block.match(/id:\s*generateId\(["']([^"']+)["']\)/);
    if (!idMatch) continue;
    const id = idMatch[1]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Extract title
    const titleMatch = block.match(/title:\s*["']([^"']+)["']/);
    if (!titleMatch) continue;
    const title = titleMatch[1];

    // Extract description (handle multi-line)
    const descMatch = block.match(/description:\s*["']([^"']+)["']/);
    if (!descMatch) {
      // Try multi-line format
      const descMultiMatch = block.match(/description:\s*["']([^"']*(?:\n[^"']*)*)["']/);
      if (!descMultiMatch) continue;
    }
    const description = descMatch ? descMatch[1] : block.match(/description:\s*["']([^"']*(?:\n[^"']*)*)["']/)?.[1] || "";

    // Extract URL
    const urlMatch = block.match(/url:\s*["']([^"']+)["']/);
    if (!urlMatch) continue;
    const url = urlMatch[1];

    // Extract category
    const categoryMatch = block.match(/category:\s*["']([^"']+)["']/);
    if (!categoryMatch) continue;
    const category = categoryMatch[1];

    // Extract tags
    const tagsMatch = block.match(/tags:\s*\[([^\]]+)\]/);
    if (!tagsMatch) continue;
    const tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim().replace(/["']/g, ""))
      .filter((t) => t.length > 0);

    // Extract dateAdded
    const dateMatch = block.match(/dateAdded:\s*["']([^"']+)["']/);
    if (!dateMatch) continue;
    const dateAdded = dateMatch[1];

    resources.push({
      id,
      title,
      url,
      description: description.replace(/\n/g, " ").trim(),
      category,
      tags,
      addedOn: dateAdded,
    });
  } catch (error) {
    console.warn(`Failed to parse resource block: ${error}`);
  }
}

// Write to JSON file
const outputPath = join(process.cwd(), "src/data/resources.json");
writeFileSync(outputPath, JSON.stringify(resources, null, 2), "utf-8");

console.log(`✅ Converted ${resources.length} resources to JSON`);
console.log(`📁 Output: ${outputPath}`);

