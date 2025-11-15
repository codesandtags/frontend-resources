import { Heart, ExternalLink } from "lucide-react";
import { Resource } from "../types/resource";
import { Tag } from "./Tag";
import { TechIcon } from "./TechIcon";

interface ResourceCardProps {
  resource: Resource;
  onLike: (id: string) => void;
}

export function ResourceCard({ resource, onLike }: ResourceCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 transition-all hover:border-gray-600 hover:shadow-lg hover:shadow-black/20">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400">
            <TechIcon category={resource.category} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {resource.title}
            </h3>
            {/* <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-700/20 text-slate-300 text-right">
              {resource.category}
            </span> */}
          </div>
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400 transition-colors"
        >
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      <p className="text-gray-300 mb-4">{resource.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      <div className="flex justify-between items-center text-sm">
        <button
          onClick={() => onLike(resource.id)}
          className="flex items-center gap-1 text-gray-400 hover:text-pink-400 transition-colors"
        >
          <Heart className="h-4 w-4" />
          <span>{resource.likes || 0}</span>
        </button>
        <span className="text-gray-500">
          Added on {new Date(resource.addedOn).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
