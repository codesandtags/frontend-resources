import { Tag as TagIcon } from "lucide-react";

interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
      <TagIcon className="h-2 w-2" />
      {label}
    </span>
  );
}
