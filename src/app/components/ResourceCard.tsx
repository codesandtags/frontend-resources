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
  const originalTags = resource.tags;
  const displayTags = resource.isFeatured
    ? ['⭐ Featured', ...originalTags]
    : originalTags;

  return (
    <div
      className="relative bg-gray-800 rounded-xl border border-transparent p-6 transition-all hover:shadow-lg hover:shadow-black/20 flex flex-col"
    >
      {/* Like button in top-right corner */}
      <button
        onClick={onLikeToggle}
        className={`absolute top-4 right-4 flex items-center gap-1 bg-gray-800 rounded px-3 py-1.5 transition-colors z-10 ${
          isLiked
            ? "text-pink-400 hover:text-pink-300"
            : "text-gray-400 hover:text-pink-400"
        } hover:bg-gray-700`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-sm">{likeCount}</span>
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-4 pr-20">
          <div className="flex items-start gap-3">
            <div className="text-blue-400">
              <TechIcon category={resource.category} />
            </div>
            <div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mb-2 hover:text-blue-400 transition-colors"
              >
                <h3 className="text-xl font-semibold text-white">
                  {resource.title}
                </h3>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
              {/* <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-700/20 text-slate-300 text-right">
                {resource.category}
              </span> */}
            </div>
          </div>
        </div>

        <p className="text-gray-300 mb-4">{resource.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => {
          if (tag === '⭐ Featured') {
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium bg-yellow-400 text-gray-900"
              >
                {tag}
              </span>
            );
          }
          return <Tag key={tag} label={tag} />;
        })}
      </div>
    </div>
  );
}
