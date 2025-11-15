import { useState, useMemo, useEffect } from "react";
import { Github, PlusCircle, Star } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ResourceCard } from "./ResourceCard";
import { CategoryFilter } from "./CategoryFilter";
import type { Category } from "../types/resource";

import { getResources } from "../../lib/resources";
import { supabase } from "../../lib/supabase";
import Image from "next/image";

function App() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [likeCounts, setLikeCounts] = useState<Map<string, number>>(new Map());
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    async function fetchData() {
      // Sign in anonymously if not already signed in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Sign in anonymously
        const { error: authError } = await supabase.auth.signInAnonymously();
        if (authError) {
          console.error("Error signing in anonymously:", authError);
          // If anonymous auth is not enabled, this will fail
          // User needs to enable it in Supabase Dashboard > Authentication > Providers > Anonymous
        }
      }

      // A) Fetch all public like counts
      const { data: countsData } = await supabase
        .from("resources")
        .select("id, like_count");

      if (countsData) {
        const countsMap = new Map(
          countsData.map((r) => [r.id, r.like_count || 0])
        );
        setLikeCounts(countsMap);
      }

      // B) Fetch this user's (anonymous) likes
      // Get session again after potential sign-in
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession) {
        const { data: likesData } = await supabase
          .from("likes")
          .select("resource_id")
          .eq("user_id", currentSession.user.id);

        if (likesData) {
          const likesSet = new Set(likesData.map((l) => l.resource_id));
          setUserLikes(likesSet);
        }
      }
    }

    fetchData();
  }, []);

  const resources = useMemo(() => getResources(), []);

  const filteredResources = useMemo(() => {
    const filtered = resources.filter((resource) => {
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

    // Sort by isFeatured first, then by date (newest first)
    return filtered.sort((a, b) => {
      // 1. Sort by isFeatured (true comes first)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 2. If both are featured or not featured, sort by date (newest first)
      return new Date(b.addedOn).getTime() - new Date(a.addedOn).getTime();
    });
  }, [resources, search, selectedCategory]);

  const handleLikeToggle = async (resourceId: string) => {
    try {
      // Ensure user is authenticated (sign in anonymously if needed)
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Sign in anonymously
        const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) {
          console.error("Error signing in anonymously:", authError);
          return; // Exit early if auth fails
        }
        session = authData.session;
      }

      // A) Optimistic UI Update (Instant feedback)
      const isCurrentlyLiked = userLikes.has(resourceId);
      const newLikedSet = new Set(userLikes);
      const newLikeCounts = new Map(likeCounts);
      const currentCount = likeCounts.get(resourceId) || 0;

      if (isCurrentlyLiked) {
        newLikedSet.delete(resourceId);
        newLikeCounts.set(resourceId, Math.max(0, currentCount - 1)); // Prevent negative
      } else {
        newLikedSet.add(resourceId);
        newLikeCounts.set(resourceId, currentCount + 1);
      }

      setUserLikes(newLikedSet);
      setLikeCounts(newLikeCounts);

      // B) Call the secure backend Edge Function
      const { error } = await supabase.functions.invoke("toggle-like", {
        body: { resource_id: resourceId },
        headers: {
          Authorization: `Bearer ${session!.access_token}`,
        },
      });

      if (error) {
        throw error; // This will be caught by the catch block
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // TODO: Revert optimistic update on error
    }
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
              <span className="text-sm sm:text-lg font-semibold text-white leading-tight">
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
          {filteredResources.map((resource) => {
            // Get the dynamic data
            const count = likeCounts.get(resource.id) || 0;
            const isLiked = userLikes.has(resource.id);

            return (
              <ResourceCard
                key={resource.id}
                resource={{
                  ...resource,
                  category: resource.category as Category,
                }}
                likeCount={count}
                isLiked={isLiked}
                onLikeToggle={() => handleLikeToggle(resource.id)}
              />
            );
          })}
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
