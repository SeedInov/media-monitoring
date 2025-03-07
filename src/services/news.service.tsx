// NewsService.ts
// @ts-nocheck
import {
  countrySentimentType,
  sentimentDistributionType,
  sentimentStatsType
} from '@/lib/types/news';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

/**
 * This service handles:
 *  1) Fetching all news with filters (pagination + infinite scroll).
 *  2) Fetching distinct values for a given field (country, language, etc.).
 */

const NewsService = () => {
  /**
   * Convert your filter state into the URL query parameters
   * the server expects for GET /news
   */
  function buildQueryString(filters, pageParam = 0) {
    const qs = new URLSearchParams();

    // Example: limit=30, offset=pageParam
    const limit = 30;
    qs.set('limit', String(limit));
    qs.set('offset', String(pageParam));

    // country[]=val
    if (filters.outletCountries && filters.outletCountries.length > 0) {
      filters.outletCountries.forEach((c) => qs.append('country', c));
    }

    // language[]=val
    if (filters.language && filters.language.length > 0) {
      filters.language.forEach((lang) => qs.append('language', lang));
    }

    // sentiment[]=val
    if (filters.sentiment && filters.sentiment.length > 0) {
      filters.sentiment.forEach((s) => qs.append('sentiment', s));
    }

    // meta_site_name[]=val (for outlets)
    if (filters.outlets && filters.outlets.length > 0) {
      filters.outlets.forEach((o) => qs.append('meta_site_name', o));
    }

    // If user typed text in a “search” field
    if (filters.searchText) {
      qs.set('search', filters.searchText);

      // If you also want to specify where that text is searched:
      // e.g. search_fields[]=title&search_fields[]=summary
      qs.append('search_fields[]', 'title');
      qs.append('search_fields[]', 'summary');
    }

    // If your backend supports excludeTags in some form:
    // e.g. not_in_fields[]=tags with “search” as the tags to exclude
    if (filters.excludeTags && filters.excludeTags.length > 0) {
      // This is hypothetical and depends on how your server side is set up
      qs.append('not_in_fields[]', 'tags');
      // We put all excludeTags joined by space (or any logic your backend expects)
      qs.set('search', filters.excludeTags.join(' '));
    }

    return qs.toString();
  }

  /**
   * 1) Main infinite query to fetch articles with the given filters
   */
  const useFetchAllNews = (filters) => {
    async function fetchArticles({ pageParam = 0 }) {
      // Build the query string from current filters + the offset
      const queryString = buildQueryString(filters, pageParam);
      const url = `https://fdcc-175-107-225-195.ngrok-free.app/api/news?${queryString}`;

      const res = await fetch(url, {
        headers: { 'ngrok-skip-browser-warning': '69420' }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch articles: ${res.statusText}`);
      }

      // Adjust depending on how your backend returns data.
      // If it returns an array, just return res.json().
      // If it returns { data: [], total: 100 }, adapt accordingly:
      const data = await res.json();
      return data; // e.g. [article1, article2, ...] or { data: [...], total: 123 }
    }

    return useInfiniteQuery({
      // The query key includes “filters” so that if filters change, this query is invalidated
      queryKey: ['news', filters],
      queryFn: ({ pageParam = 0 }) => fetchArticles({ pageParam }),
      // Next page param logic:
      getNextPageParam: (lastPage, allPages) => {
        // If the server returned fewer than 30 items, we assume no more pages
        if (!Array.isArray(lastPage) || lastPage.length < 30) return undefined;
        return allPages.length * 30; // next offset
      }
    });
  };

  /**
   * 2) Distinct values for a given field
   *   e.g. useFetchDistinctValues("country") -> ["United States","France",...]
   */
  const useFetchDistinctValues = (field) => {
    return useQuery({
      queryKey: ['distinct', field],
      queryFn: async () => {
        const res = await fetch(
          `https://fdcc-175-107-225-195.ngrok-free.app/api/news/distinct?field=${field}`,
          {
            headers: { 'ngrok-skip-browser-warning': '69420' }
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch distinct values for field=${field}`);
        }
        return res.json(); // e.g. ["United States","Germany","Spain"]
      }
    });
  };
  const useFetchDistinctOutlets = (filters) => {
    return useQuery({
      // Include outletCountries in the queryKey so it refetches when countries change
      queryKey: ['distinct-outlets', filters.outletCountries],
      queryFn: async () => {
        const qs = new URLSearchParams();
        qs.set('field', 'meta_site_name');

        // If user selected countries, append them
        if (filters.outletCountries && filters.outletCountries.length > 0) {
          filters.outletCountries.forEach((c) => qs.append('country', c));
        }

        // Example: /news/distinct?field=meta_site_name&country=India&country=Pakistan
        const url = `https://fdcc-175-107-225-195.ngrok-free.app/api/news/distinct?${qs.toString()}`;

        const res = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': '69420' }
        });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch distinct outlets: ${res.status} ${res.statusText}`
          );
        }
        return res.json(); // e.g. ["CNN","BBC","Al Jazeera","Dawn.com","TimesOfIndia"]
      }
    });
  };

  const useFetchSentimentAggregateByDate = () => {
    return useQuery({
      // Include 'from' in the queryKey to refetch when the date changes
      queryKey: ['sentiment-by-date'],
      queryFn: async (): Promise<sentimentStatsType> => {
        // Get the first day of the previous month in YYYY-MM-DD format
        const today = new Date();
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const formattedFrom = firstDayOfLastMonth.toISOString().split('T')[0]; // YYYY-MM-DD format

        // API URL with the 'from' query parameter
        const url = `https://fdcc-175-107-225-195.ngrok-free.app/api/news/aggregate/sentiment/date?from=${formattedFrom}`;

        const res = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': '69420' }
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch sentiment data: ${res.status} ${res.statusText}`
          );
        }

        return res.json();
      }
    });
  };

  const useFetchOverallSentimentAggregate = () => {
    return useQuery({
      // Include 'from' in the queryKey to refetch when the date changes
      queryKey: ['sentiment-aggregate'],
      queryFn: async (): Promise<sentimentDistributionType> => {
        // Get the first day of the previous month in YYYY-MM-DD format
        const today = new Date();
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const formattedFrom = firstDayOfLastMonth.toISOString().split('T')[0]; // YYYY-MM-DD format

        // API URL with the 'from' query parameter
        const url = `https://fdcc-175-107-225-195.ngrok-free.app/api/news/aggregate/sentiment`;

        const res = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': '69420' }
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch sentiment data: ${res.status} ${res.statusText}`
          );
        }

        return res.json();
      }
    });
  };

  const useFetchSentimentAggregateByCountry = () => {
    return useQuery({
      // Include 'from' in the queryKey to refetch when the date changes
      queryKey: ['sentiment-aggregate-country'],
      queryFn: async (): Promise<countrySentimentType[]> => {
        // Get the first day of the previous month in YYYY-MM-DD format
        const today = new Date();
        const firstDayOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const formattedFrom = firstDayOfLastMonth.toISOString().split('T')[0]; // YYYY-MM-DD format

        // API URL with the 'from' query parameter
        const url = `https://fdcc-175-107-225-195.ngrok-free.app/api/news/aggregate/sentiment/country`;

        const res = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': '69420' }
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch sentiment data: ${res.status} ${res.statusText}`
          );
        }

        return res.json();
      }
    });
  };

  const useHandleCrawlNews = () => {
    return useMutation({
      mutationFn: async (query: string) => {
        const url = `https://fdcc-175-107-225-195.ngrok-free.app/api/news?url=${query}`;

        const res = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': '69420' }
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch news data: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        return Array.isArray(data) && data.length > 0; // Returns true if data exists, false otherwise
      }
    });
  };

  return {
    useFetchAllNews,
    useFetchDistinctValues,
    useFetchDistinctOutlets,
    useFetchSentimentAggregateByDate,
    useFetchOverallSentimentAggregate,
    useFetchSentimentAggregateByCountry,
    useHandleCrawlNews
  };
};

export default NewsService;
