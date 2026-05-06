"use client";

import { useState, type FormEvent } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`,
      "_blank",
      "noopener,noreferrer"
    );
    setQuery("");
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center glass-card px-4 py-3 gap-3">
          <svg
            className="w-5 h-5 text-zinc-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar no Google..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim()}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            Buscar
          </button>
        </div>
      </div>
    </form>
  );
}
