import { useEffect, useState } from 'react';

/**
 * Hook to debounce search input to avoid excessive filtering/API calls
 * @param {string} searchQuery - The search query to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: 300ms)
 * @returns {string} The debounced search query
 *
 * @example
 * const [searchInput, setSearchInput] = useState('');
 * const debouncedQuery = useDebouncedSearch(searchInput, 300);
 *
 * useEffect(() => {
 *   // This runs 300ms after user stops typing
 *   performExpensiveFilter(debouncedQuery);
 * }, [debouncedQuery]);
 */
export const useDebouncedSearch = (searchQuery, delay = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, [searchQuery, delay]);

  return debouncedQuery;
};

