import { Heart, ExternalLink } from "lucide-react";
import { Resource } from "../types/resource";
import { Tag } from "./Tag";
import { TechIcon } from "./TechIcon";

interface ResourceCardProps {
  resource: Resource;
  likeCount: number;
  isLiked: boolean;
  onLikeToggle: () => void;
}

export function ResourceCard({
  resource,
  likeCount,
  isLiked,
  onLikeToggle,
}: ResourceCardProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-700 bg-gray-800 p-4 transition-all duration-300 hover:border-blue-500 hover:shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_0_20px_rgba(59,130,246,0.3)]">
      {/* 1. HEADER (Clickable Title with Icon) */}
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-2 flex items-center gap-2"
      >
        <div className="text-blue-400 flex-shrink-0">
          <TechIcon category={resource.category} className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex-1">
          {resource.title}
        </h3>
        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0" />
      </a>

      {/* 2. FEATURED LABEL (Conditional) */}
      {resource.isFeatured && (
        <div className="mb-2 text-xs font-medium text-yellow-400">
          ⭐ Featured
        </div>
      )}

      {/* 3. DESCRIPTION (Grows to fill space) */}
      <p className="mb-4 text-sm text-gray-400 flex-grow">
        {resource.description}
      </p>

      {/* 4. FOOTER */}
      <div className="mt-auto space-y-3">
        {/* Tag List */}
        <div className="flex flex-wrap gap-2">
          {resource.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        {/* Actions Row (Like button and future actions) */}
        <div className="flex items-center justify-end gap-4">
          {/* Like Button */}
          <button
            onClick={onLikeToggle}
            className={`flex items-center gap-1.5 text-sm ${
              isLiked
                ? "text-pink-500" // Liked state
                : "text-gray-400 hover:text-white" // Default state
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
              strokeWidth={2}
            />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
