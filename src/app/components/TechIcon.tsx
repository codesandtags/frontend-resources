import {
  Code,
  Book,
  Gauge,
  Accessibility,
  Shield,
  Zap,
  Layout,
  TestTube,
  Database,
  Palette,
  Globe,
  FileCode,
  GitBranch,
  Image as ImageIcon,
  Box,
  Layers,
  Rocket,
  Webhook,
  Sparkles,
  Monitor,
} from "lucide-react";

interface TechIconProps {
  category: string;
  className?: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Framework: Code,
  "UI Library": Layout,
  Tool: Box,
  Learning: Book,
  Performance: Gauge,
  Testing: TestTube,
  "State Management": Database,
  CSS: Palette,
  TypeScript: FileCode,
  Accessibility: Accessibility,
  Security: Shield,
  PWA: Zap,
  Animation: Sparkles,
  "Data Visualization": Monitor,
  "3D & WebGL": Layers,
  "Platforms & Hosting": Rocket,
  "Public APIs": Webhook,
  Git: GitBranch,
  "Design Resources": ImageIcon,
  Utilities: Globe,
  "Web VR": Layers,
};

export function TechIcon({ category, className = "h-6 w-6" }: TechIconProps) {
  const IconComponent = categoryIcons[category] || Code;

  return <IconComponent className={className} />;
}
