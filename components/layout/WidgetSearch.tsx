"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface WidgetSearchProps {
  categories: string[];
  onFilter: (searchText: string, selectedCategories: string[]) => void;
}

export default function WidgetSearch({ categories, onFilter }: WidgetSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitFilter = useCallback(
    (text: string, cats: string[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onFilter(text, cats);
      }, 300);
    },
    [onFilter]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    emitFilter(value, selectedCategories);
  };

  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    emitFilter(inputValue, next);
  };

  const handleOpen = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClose = useCallback(() => {
    setExpanded(false);
    setInputValue("");
    setSelectedCategories([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onFilter("", []);
  }, [onFilter]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded) handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded, handleClose]);

  // Close on click outside
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (expanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [expanded, handleClose]);

  if (!expanded) {
    return (
      <div className="flex justify-end mb-3">
        <button
          onClick={handleOpen}
          aria-label="Open search"
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262633] transition-colors"
        >
          <i className="ri-search-line text-lg" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mb-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm">
        <i className="ri-search-line text-gray-400 dark:text-gray-500 text-lg flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search widgets…"
          className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
        />
        {(inputValue || selectedCategories.length > 0) && (
          <button
            onClick={() => {
              setInputValue("");
              setSelectedCategories([]);
              emitFilter("", []);
              inputRef.current?.focus();
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <i className="ri-close-line text-lg" />
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategories.includes(cat)
                  ? "bg-magenta text-white"
                  : "bg-gray-100 dark:bg-[#262633] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2e2e40]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
