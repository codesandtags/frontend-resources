// src/app/not-found.tsx

import Link from 'next/link'

import { FileSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center text-white px-4">
      {/* We use min-h-[calc(100vh-200px)] to roughly center the content
        in the available space below the header/filter bar.
      */}
      <FileSearch
        size={96}
        className="text-gray-500 mb-6"
        strokeWidth={1}
      />
      <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-4">
        Resource Not Found
      </h2>
      <p className="text-lg text-gray-400 mb-8 max-w-md">
        Oops! The page you're looking for seems to have been misplaced,
        or it doesn't exist.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors"
      >
        Explore All Resources
      </Link>
    </div>
  )
}

