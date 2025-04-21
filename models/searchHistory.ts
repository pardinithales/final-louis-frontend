import { ParsedResponseType } from '@/api/louisService';

const HISTORY_KEY = 'louis_search_history';

// Maximum number of history items to keep
const MAX_HISTORY = 20;

// Simplified version for storing history in memory for now
// In a real app, use AsyncStorage or a similar solution
let searchHistory: ParsedResponseType[] = [];

export const addSearchToHistory = (result: ParsedResponseType): void => {
  // Check if we already have this query
  const existingIndex = searchHistory.findIndex(item => item.query === result.query);
  
  if (existingIndex >= 0) {
    // Remove the existing entry
    searchHistory.splice(existingIndex, 1);
  }
  
  // Add new entry at the beginning
  searchHistory.unshift(result);
  
  // Limit the history size
  if (searchHistory.length > MAX_HISTORY) {
    searchHistory = searchHistory.slice(0, MAX_HISTORY);
  }
};

export const getSearchHistory = (): ParsedResponseType[] => {
  return [...searchHistory];
};

export const clearSearchHistory = (): void => {
  searchHistory = [];
};