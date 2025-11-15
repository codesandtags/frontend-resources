import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Resource } from "./resources";

// Mock the JSON import - must be hoisted, so define inline
vi.mock("../data/resources.json", () => ({
  default: [
    {
      id: "test-resource-1",
      title: "Test Resource 1",
      url: "https://example.com/resource1",
      description: "This is a test resource for unit testing",
      category: "Learning",
      tags: ["test", "example", "learning"],
      addedOn: "2024-01-01",
    },
    {
      id: "test-resource-2",
      title: "React Documentation",
      url: "https://react.dev/",
      description: "Official React documentation and guides",
      category: "Framework",
      tags: ["react", "documentation", "javascript"],
      addedOn: "2024-01-02",
    },
    {
      id: "test-resource-3",
      title: "CSS Tricks",
      url: "https://css-tricks.com/",
      description: "The best CSS resource on the web",
      category: "CSS",
      tags: ["css", "articles", "tutorials"],
      addedOn: "2024-01-03",
    },
    {
      id: "duplicate-id",
      title: "Duplicate ID Resource",
      url: "https://example.com/unique",
      description: "Resource with duplicate ID",
      category: "Tool",
      tags: ["tool"],
      addedOn: "2024-01-04",
    },
    {
      id: "duplicate-id",
      title: "Another Duplicate ID",
      url: "https://example.com/unique2",
      description: "Another resource with same ID",
      category: "Tool",
      tags: ["tool"],
      addedOn: "2024-01-05",
    },
    {
      id: "unique-id-1",
      title: "Unique Resource 1",
      url: "https://example.com/duplicate-url",
      description: "Resource with duplicate URL",
      category: "Learning",
      tags: ["learning"],
      addedOn: "2024-01-06",
    },
    {
      id: "unique-id-2",
      title: "Unique Resource 2",
      url: "https://example.com/duplicate-url",
      description: "Another resource with same URL",
      category: "Learning",
      tags: ["learning"],
      addedOn: "2024-01-07",
    },
  ],
}));

import {
  getResources,
  validateResources,
  getResourcesByCategory,
  searchResources,
} from "./resources";

describe("resources", () => {
  describe("getResources", () => {
    it("should return all resources from JSON file", () => {
      const resources = getResources();
      expect(resources).toBeDefined();
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.length).toBeGreaterThan(0);
    });

    it("should return resources with correct structure", () => {
      const resources = getResources();
      const firstResource = resources[0];

      expect(firstResource).toHaveProperty("id");
      expect(firstResource).toHaveProperty("title");
      expect(firstResource).toHaveProperty("url");
      expect(firstResource).toHaveProperty("description");
      expect(firstResource).toHaveProperty("category");
      expect(firstResource).toHaveProperty("tags");
      expect(firstResource).toHaveProperty("addedOn");
    });

    it("should return resources with correct types", () => {
      const resources = getResources();
      const firstResource = resources[0];

      expect(typeof firstResource.id).toBe("string");
      expect(typeof firstResource.title).toBe("string");
      expect(typeof firstResource.url).toBe("string");
      expect(typeof firstResource.description).toBe("string");
      expect(typeof firstResource.category).toBe("string");
      expect(Array.isArray(firstResource.tags)).toBe(true);
      expect(typeof firstResource.addedOn).toBe("string");
    });
  });

  describe("validateResources", () => {
    it("should detect duplicate IDs", () => {
      const result = validateResources();
      expect(result.duplicateIds).toContain("duplicate-id");
      expect(result.duplicateIds.length).toBeGreaterThan(0);
    });

    it("should detect duplicate URLs", () => {
      const result = validateResources();
      expect(result.duplicateUrls).toContain("https://example.com/duplicate-url");
      expect(result.duplicateUrls.length).toBeGreaterThan(0);
    });

    it("should return isValid as false when duplicates exist", () => {
      const result = validateResources();
      expect(result.isValid).toBe(false);
    });

    it("should return all duplicate IDs in the array", () => {
      const result = validateResources();
      expect(Array.isArray(result.duplicateIds)).toBe(true);
      result.duplicateIds.forEach((id) => {
        expect(typeof id).toBe("string");
      });
    });

    it("should return all duplicate URLs in the array", () => {
      const result = validateResources();
      expect(Array.isArray(result.duplicateUrls)).toBe(true);
      result.duplicateUrls.forEach((url) => {
        expect(typeof url).toBe("string");
      });
    });

    it("should correctly count duplicate occurrences", () => {
      const result = validateResources();
      // Should find at least one duplicate ID and one duplicate URL
      expect(result.duplicateIds.length).toBeGreaterThanOrEqual(1);
      expect(result.duplicateUrls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getResourcesByCategory", () => {
    it("should return resources filtered by category", () => {
      const learningResources = getResourcesByCategory("Learning");
      expect(learningResources.length).toBeGreaterThan(0);
      learningResources.forEach((resource) => {
        expect(resource.category).toBe("Learning");
      });
    });

    it("should return empty array for non-existent category", () => {
      const resources = getResourcesByCategory("NonExistentCategory");
      expect(resources).toEqual([]);
    });

    it("should return all resources for a category that exists", () => {
      const frameworkResources = getResourcesByCategory("Framework");
      expect(frameworkResources.length).toBeGreaterThan(0);
      frameworkResources.forEach((resource) => {
        expect(resource.category).toBe("Framework");
      });
    });

    it("should handle case-sensitive category matching", () => {
      const lowerCase = getResourcesByCategory("learning");
      const upperCase = getResourcesByCategory("Learning");
      expect(lowerCase.length).not.toBe(upperCase.length);
    });
  });

  describe("searchResources", () => {
    it("should search by title", () => {
      const results = searchResources("React");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title.includes("React"))).toBe(true);
    });

    it("should search by description", () => {
      const results = searchResources("CSS");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some(
          (r) =>
            r.description.toLowerCase().includes("css") ||
            r.title.toLowerCase().includes("css")
        )
      ).toBe(true);
    });

    it("should search by tags", () => {
      const results = searchResources("test");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((r) => r.tags.some((tag) => tag.toLowerCase().includes("test")))
      ).toBe(true);
    });

    it("should be case-insensitive", () => {
      const lowerCase = searchResources("react");
      const upperCase = searchResources("REACT");
      const mixedCase = searchResources("ReAcT");

      expect(lowerCase.length).toBe(upperCase.length);
      expect(lowerCase.length).toBe(mixedCase.length);
    });

    it("should return empty array for no matches", () => {
      const results = searchResources("nonexistentsearchterm12345");
      expect(results).toEqual([]);
    });

    it("should return multiple results for partial matches", () => {
      const results = searchResources("test");
      expect(results.length).toBeGreaterThan(0);
    });

    it("should handle empty search query", () => {
      const results = searchResources("");
      // Empty query should match all resources (since empty string is included in all strings)
      expect(Array.isArray(results)).toBe(true);
    });

    it("should handle special characters in search", () => {
      const results = searchResources("test@#$%");
      expect(Array.isArray(results)).toBe(true);
    });

    it("should search across multiple fields simultaneously", () => {
      const results = searchResources("react");
      const hasTitleMatch = results.some((r) =>
        r.title.toLowerCase().includes("react")
      );
      const hasDescriptionMatch = results.some((r) =>
        r.description.toLowerCase().includes("react")
      );
      const hasTagMatch = results.some((r) =>
        r.tags.some((tag) => tag.toLowerCase().includes("react"))
      );

      expect(hasTitleMatch || hasDescriptionMatch || hasTagMatch).toBe(true);
    });
  });

  describe("Resource structure validation", () => {
    it("should ensure all resources have required fields", () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(resource.id).toBeDefined();
        expect(resource.title).toBeDefined();
        expect(resource.url).toBeDefined();
        expect(resource.description).toBeDefined();
        expect(resource.category).toBeDefined();
        expect(resource.tags).toBeDefined();
        expect(resource.addedOn).toBeDefined();
      });
    });

    it("should ensure tags is always an array", () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(Array.isArray(resource.tags)).toBe(true);
      });
    });

    it("should ensure URLs are valid strings", () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(typeof resource.url).toBe("string");
        expect(resource.url.length).toBeGreaterThan(0);
      });
    });

    it("should ensure IDs are valid strings", () => {
      const resources = getResources();
      resources.forEach((resource) => {
        expect(typeof resource.id).toBe("string");
        expect(resource.id.length).toBeGreaterThan(0);
      });
    });
  });
});

