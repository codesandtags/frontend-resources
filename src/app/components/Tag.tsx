import { Tag as TagIcon } from "lucide-react";
import { getTagColors } from "../utils/tagColors";

interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  const { bg, text } = getTagColors(label);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <TagIcon className="h-2 w-2" />
      {label}
    </span>
  );
}
