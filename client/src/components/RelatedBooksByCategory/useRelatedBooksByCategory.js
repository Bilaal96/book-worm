/**
 * ----- Overview -----
 * useRelatedBooksByCategory (abbr: useRBBC) extracts the business logic for the RelatedBooksByCategory (abbr: RBBC) component into a hook.
 
 * useRBBC receives mutualBook - a book object from Google Books (GB) API - as an argument
 * useRBBC is responsible for:
  - fetching books related to mutualBook by category - i.e. books that share a category in common with mutualBook
  - sanitizing & returning the related books
 
 * It works very similarly to the useRelatedBooksByAuthor hook, with 2 differences (for reasons described in /utils/related-books/by-category.js):
  - (1) categories data from the Google Books (GB) API is formatted 
  - (2) validation logic is tweaked to accommodate the formatted categories data 
 */
import { useEffect, useMemo } from 'react';

// Custom Hooks
import useAsyncReducer from 'hooks/useAsyncReducer';

// Utils
import { createAsyncReducer } from 'utils/create-reducer';
import { getBooksRequestURI } from 'utils/api-query-builder';
import { getUniqueListBy } from 'utils/unique-list';
import {
  fetchBooksByMultipleURIs,
  dedupeRelatedBooks,
  isCacheValid,
} from 'utils/related-books/shared';
import {
  formatBooksApiCategories,
  validateBooksRelationByCategory,
  cacheRelatedBooksByCategory,
  getCachedRelatedBooksByCategory,
} from 'utils/related-books/by-category';
import { logObjectWithKeysInOrder } from 'utils/logger';

// Constants
const ACTION_TYPE_PREFIX = 'FETCH_BOOKS_BY_CATEGORY';
const MAX_CATEGORIES = 3;
const MAX_BOOKS_PER_CATEGORY = 10;
/**
 * Books API - "special keywords": https://developers.google.com/books/docs/v1/using#PerformingSearch
 * NOTE: unlike "inauthor:" keyword used in useRelatedBooksByCategory hook, "subject:" keyword does not find accurate results so it is not used
 * const SEARCH_BY_CATEGORY = 'subject:'; 
 
 * As a workaround, a substring is extracted from 3 categories and used as a search term 
 */

/**
 * Hook that encapsulates fetching, data handling & caching logic for books related by category.
 * @param { Object } mutualBook - a book from Google Books (GB) API. The hook uses this book to fetch related books from GB API.
 */
export default function useRelatedBooksByCategory(mutualBook) {
  // Array of categories from GB API
  const categories = mutualBook.volumeInfo.categories;

  // Returns reducer with methods that handle updates to async state when relevant actions are dispatched
  const [asyncReducer] = useMemo(
    () => createAsyncReducer(ACTION_TYPE_PREFIX),
    []
  );

  // Returns state & dispatch (a means of updating state)
  const [relatedBooks, dispatch] = useAsyncReducer(
    ACTION_TYPE_PREFIX,
    asyncReducer
  );

  useEffect(() => {
    // No categories. Fail because related books cannot be fetched.
    if (!categories) return dispatch.failed({ message: 'Categories unknown' });

    // Format categories array - related books are fetched in relation to validCategories
    const validCategories = formatBooksApiCategories(
      categories,
      MAX_CATEGORIES
    );

    // AbortController - used to abort fetch if it's still pending when user switches UI tab
    const abortController = new AbortController();
    const abortSignal = abortController.signal;

    // Invokes helper functions to fetch, dedupe & aggregate books related by categories
    // NOTE: there may be one or more categories
    async function getBooksByCategory() {
      try {
        // init loading state
        dispatch.load();

        // Build request URIs to fetch data for each category
        const requestURIs = validCategories.map((category) =>
          getBooksRequestURI({ search: category })
        );

        /**
         * Requests books related per category
         * Throws error if all fetch calls fail
         * Otherwise returns results of successful fetch calls
         */
        const fetchedBooks = await fetchBooksByMultipleURIs(
          requestURIs,
          abortSignal
        );

        /**
         * fetchedBooks is a nested array
         * Each nested array (booksBySingleCategory) contains books relating to a single category within the validCategories array
         * In the nested arrays:
          - remove duplicate books
          - check that the remaining books share at least one category with mutualBook
         */
        const validatedBooks = fetchedBooks.map((booksBySingleCategory) => {
          // Remove duplicates & mutualBook (if present)
          const dedupedBooks = dedupeRelatedBooks(
            booksBySingleCategory,
            mutualBook
          );

          // Only return books that share AT LEAST ONE category with mutualBook
          const validatedBooks = validateBooksRelationByCategory(
            dedupedBooks,
            validCategories
          );

          // Limit number of results returned from each array
          return validatedBooks.slice(0, MAX_BOOKS_PER_CATEGORY);
        });

        // Flatten validatedBooks and remove any remaining duplicates
        const sanitizedBooks = getUniqueListBy(validatedBooks.flat(), 'id');

        // Updated relatedBooks.value with result
        dispatch.success(sanitizedBooks);

        // Cache related books in sessionStorage
        cacheRelatedBooksByCategory({
          relation: mutualBook.id,
          value: sanitizedBooks,
        });

        logObjectWithKeysInOrder(
          {
            categories,
            validCategories,
            fetchedBooks,
            validatedBooks,
            sanitizedBooks,
          },
          'useRelatedBooksByCategory'
        );
      } catch (err) {
        // Only updates state if fetch was NOT aborted - prevents dispatch of abort error
        if (!abortSignal.aborted) {
          console.error(err);
          dispatch.failed(err);
        }
      }
    }

    // If available, get related books from sessionStorage
    const cache = getCachedRelatedBooksByCategory();

    // Load from cache if valid, otherwise fetch related books from Google Books API
    if (isCacheValid(mutualBook, cache)) {
      console.log('> LOADED RELATED BOOKS FROM CACHE');
      dispatch.success(cache.value);
    } else {
      getBooksByCategory();
    }

    // Handle unmount
    return function cleanup() {
      abortController.abort();
    };
  }, [categories, dispatch, mutualBook]);

  return relatedBooks;
}
