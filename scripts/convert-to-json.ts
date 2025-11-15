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

// Parse each resource object
const resourcePattern = /\{\s*id:\s*generateId\(["']([^"']+)["']\),\s*title:\s*["']([^"']+)["'],\s*description:\s*["']([^"']+)["'],\s*url:\s*["']([^"']+)["'],\s*category:\s*["']([^"']+)["'],\s*tags:\s*\[([^\]]+)\],\s*likes:\s*\d+,\s*dateAdded:\s*["']([^"']+)["'],\s*iconName:[^}]+\}/g;

let match;
while ((match = resourcePattern.exec(resourcesText)) !== null) {
  const id = match[1]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const title = match[2];
  const description = match[3];
  const url = match[4];
  const category = match[5];
  const tagsStr = match[6];
  const dateAdded = match[7];

  // Parse tags
  const tags = tagsStr
    .split(",")
    .map((t) => t.trim().replace(/["']/g, ""))
    .filter((t) => t.length > 0);

  resources.push({
    id,
    title,
    url,
    description,
    category,
    tags,
    addedOn: dateAdded,
  });
}

// Write to JSON file
const outputPath = join(process.cwd(), "src/data/resources.json");
writeFileSync(outputPath, JSON.stringify(resources, null, 2), "utf-8");

console.log(`✅ Converted ${resources.length} resources to JSON`);
console.log(`📁 Output: ${outputPath}`);

