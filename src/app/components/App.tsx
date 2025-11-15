import { useState, useMemo, useEffect } from "react";
import { Github, PlusCircle, Star } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ResourceCard } from "./ResourceCard";
import { CategoryFilter } from "./CategoryFilter";
import type { Category } from "../types/resource";

import { getResources } from "../../lib/resources";
import Image from "next/image";

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [githubStars, setGithubStars] = useState<number | null>(null);

  useEffect(() => {
    // Fetch GitHub stars count
    const fetchGithubStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/codesandtags/frontend-documentation"
        );
        if (response.ok) {
          const data = await response.json();
          setGithubStars(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars:", error);
      }
    };

    fetchGithubStars();
  }, []);

  const resources = useMemo(() => getResources(), []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase()) ||
        resource.tags.some((tag: string) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || resource.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [resources, search, selectedCategory]);

  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Frontend Resources"
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold text-white">
                Frontend Resources
              </span>
              <span className="border rounded-md px-2 text-xs text-slate-500 border-slate-500">
                BETA
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/codesandtags/frontend-documentation"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <Github className="h-5 w-5" />
                <span className="hidden sm:inline">GitHub</span>
                {githubStars !== null && (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{githubStars.toLocaleString()}</span>
                  </span>
                )}
              </a>
              <a
                href="https://github.com/codesandtags/frontend-resources/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="hidden sm:inline">Add Resource</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-white"></h1>
          </div>

          <div className="space-y-4">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={{
                ...resource,
                category: resource.category as Category,
                likes: (likes[resource.id] || 0),
              }}
              onLike={handleLike}
            />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No resources found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
