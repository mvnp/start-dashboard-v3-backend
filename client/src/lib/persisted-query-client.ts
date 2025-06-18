import { QueryClient } from "@tanstack/react-query";

// Custom persistence manager for React Query without external dependencies
export class QueryPersistenceManager {
  private static CACHE_KEY = 'barberpro-query-cache';
  private static MAX_AGE = 1000 * 60 * 30; // 30 minutes

  static saveQueryData(queryClient: QueryClient) {
    try {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      // Filter out stale or error queries
      const validQueries = queries
        .filter(query => query.state.status === 'success' && query.state.data)
        .map(query => ({
          queryKey: query.queryKey,
          data: query.state.data,
          timestamp: Date.now(),
        }));

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(validQueries));
    } catch (error) {
      console.warn('Failed to save query cache:', error);
    }
  }

  static restoreQueryData(queryClient: QueryClient) {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return;

      const queries = JSON.parse(cached);
      const now = Date.now();

      queries.forEach((query: any) => {
        // Only restore data that's not too old
        if (now - query.timestamp < this.MAX_AGE) {
          queryClient.setQueryData(query.queryKey, query.data);
        }
      });
    } catch (error) {
      console.warn('Failed to restore query cache:', error);
      localStorage.removeItem(this.CACHE_KEY);
    }
  }

  static clearCache() {
    localStorage.removeItem(this.CACHE_KEY);
  }
}