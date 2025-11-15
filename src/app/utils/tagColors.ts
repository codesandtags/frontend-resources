interface TagColorMap {
  [key: string]: {
    bg: string;
    text: string;
  };
}

export const getTagColors = (tag: string): { bg: string; text: string } => {
  const tagLower = tag.toLowerCase();

  const colorMap: TagColorMap = {
    // Blue for css, html, layout
    css: { bg: 'bg-blue-900', text: 'text-blue-300' },
    html: { bg: 'bg-blue-900', text: 'text-blue-300' },
    html5: { bg: 'bg-blue-900', text: 'text-blue-300' },
    layout: { bg: 'bg-blue-900', text: 'text-blue-300' },

    // Yellow for javascript, typescript, react
    javascript: { bg: 'bg-yellow-900', text: 'text-yellow-300' },
    typescript: { bg: 'bg-yellow-900', text: 'text-yellow-300' },
    react: { bg: 'bg-yellow-900', text: 'text-yellow-300' },

    // Green for testing
    testing: { bg: 'bg-green-900', text: 'text-green-300' },
    test: { bg: 'bg-green-900', text: 'text-green-300' },

    // Purple for accessibility
    accessibility: { bg: 'bg-purple-900', text: 'text-purple-300' },
    a11y: { bg: 'bg-purple-900', text: 'text-purple-300' },
  };

  // Default: low-contrast gray style
  const defaultColor = { bg: 'bg-gray-800', text: 'text-gray-400' };

  return colorMap[tagLower] || defaultColor;
};