import { useEffect, useState } from 'react';
import { DEFAULT_SEARCH_DEBOUNCE_DELAY } from '../constants/searchConstants.js';

/**
 * Hook to debounce search input to avoid excessive filtering/API calls
 * @param {string} searchQuery - The search query to debounce
 * @param {number} delay - Debounce delay in milliseconds (default: DEFAULT_SEARCH_DEBOUNCE_DELAY)
 * @returns {string} The debounced search query
 *
 * @example
 * const [searchInput, setSearchInput] = useState('');
 * const debouncedQuery = useDebouncedSearch(searchInput);
 *
 * useEffect(() => {
 *   // This runs after user stops typing
 *   performExpensiveFilter(debouncedQuery);
 * }, [debouncedQuery]);
 */
export const useDebouncedSearch = (searchQuery, delay = DEFAULT_SEARCH_DEBOUNCE_DELAY) => {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, delay]);

  return debouncedQuery;
};

