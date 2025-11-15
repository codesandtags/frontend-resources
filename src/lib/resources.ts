import resourcesData from "../data/resources.json" assert { type: "json" };

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string; // Will be validated/cast to Category type in app layer
  tags: string[];
  addedOn: string;
  isFeatured?: boolean;
}

/**
 * Get all resources from the JSON file
 */
export function getResources(): Resource[] {
  return resourcesData as Resource[];
}

/**
 * Validate resources for duplicates
 * Returns an object with duplicate IDs and URLs
 */
export function validateResources(): {
  duplicateIds: string[];
  duplicateUrls: string[];
  isValid: boolean;
} {
  const resources = getResources();
  const idMap = new Map<string, number>();
  const urlMap = new Map<string, number>();
  const duplicateIds: string[] = [];
  const duplicateUrls: string[] = [];

  resources.forEach((resource) => {
    // Check for duplicate IDs
    const idCount = idMap.get(resource.id) || 0;
    idMap.set(resource.id, idCount + 1);
    if (idCount === 1) {
      duplicateIds.push(resource.id);
    }

    // Check for duplicate URLs
    const urlCount = urlMap.get(resource.url) || 0;
    urlMap.set(resource.url, urlCount + 1);
    if (urlCount === 1) {
      duplicateUrls.push(resource.url);
    }
  });

  return {
    duplicateIds,
    duplicateUrls,
    isValid: duplicateIds.length === 0 && duplicateUrls.length === 0,
  };
}

/**
 * Get resources by category
 */
export function getResourcesByCategory(category: string): Resource[] {
  return getResources().filter((resource) => resource.category === category);
}

/**
 * Search resources by query
 */
export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase();
  return getResources().filter(
    (resource) =>
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
