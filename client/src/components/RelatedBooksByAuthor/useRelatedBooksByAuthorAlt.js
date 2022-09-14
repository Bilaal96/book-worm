/**
 * --- Overview ---
 * This useRelatedBooksByAuthorAlt hook (abbr: useRBBA-alt) outlines an alternate & more optimal approach to useRelatedBooksByAuthor (abbr: useRBBA)
 * useRBBA-alt uses less loops & function calls than useRBBA
 
 * NOTE: For context and a full explanation of the hooks' purpose, see useRBBA  
 
 * --- How it works ---
 * (1) Fetch books potentially related to mutualBook -> returns fetchedBook -> a nested arrays of books 
 * (2) Flatten the fetchedBooks array
 * (3) Remove duplicates
 * (4) Remove books that don't share an author with mutualBook
 
 * --- Comparing useRBBA-alt to useRBBA ---
 * Because the array is flattened FIRST, useRBBA-alt is able to remove duplicates in one step. 
 * In contrast useRBBA must dedupe each nested array, then dedupe once more after flattening the nested array. 
 
 * useRBBA-alt does NOT have the option to select x number of results returned per author, whereas useRBBA DOES
 */

import { useEffect, useMemo } from 'react';

// Custom Hooks
import useAsyncReducer from 'hooks/useAsyncReducer';

// Utils
import { createAsyncReducer } from 'utils/create-reducer';
import { getBooksRequestURI } from 'utils/api-query-builder';
import {
  fetchBooksByMultipleURIs,
  dedupeRelatedBooks,
  isCacheValid,
} from 'utils/related-books/shared';
import {
  validateBooksRelationByAuthor,
  cacheRelatedBooksByAuthor,
  getCachedRelatedBooksByAuthor,
} from 'utils/related-books/by-author';
import { logObjectWithKeysInOrder } from 'utils/logger';

// Constants
const ACTION_TYPE_PREFIX = 'FETCH_BOOKS_BY_AUTHOR';
const MAX_BOOKS_PER_API_REQUEST = 40;
// Books API - "special keywords": https://developers.google.com/books/docs/v1/using#PerformingSearch
const SEARCH_BY_AUTHOR = 'inauthor:';

/**
 * Hook that encapsulates fetching & caching logic for books related by author
 * @param { Object } mutualBook - a book from Google Books (GB) API. The hook uses this book to fetch related books from GB API.
 */
export default function useRelatedBooksByAuthor(mutualBook) {
  // Array of authors - related books are fetched in relation to this array
  const authors = mutualBook.volumeInfo.authors;

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
    // No authors. Fail because related books cannot be fetched.
    if (!authors) return dispatch.failed({ message: 'Author(s) unknown' });

    // AbortController - used to abort fetch if it's still pending when user switches UI tab
    const abortController = new AbortController();
    const abortSignal = abortController.signal;

    /**
     * Invokes helper functions to fetch, dedupe & aggregate books related by authors.
     * NOTE: there may be one or more author(s)
     */
    async function getRelatedBooks() {
      try {
        // init loading state
        dispatch.load();

        // Build request URIs to fetch data for each author
        const requestURIs = authors.map((author) =>
          getBooksRequestURI({
            search: `${SEARCH_BY_AUTHOR}${author}`,
            maxResults: MAX_BOOKS_PER_API_REQUEST,
          })
        );

        /**
         * Requests books related per author
         * Throws error if all fetch calls fail
         * Otherwise returns results of successful fetch calls
         */
        const fetchedBooks = await fetchBooksByMultipleURIs(
          requestURIs,
          abortSignal
        );

        // flatten results - i.e. merge/aggregate nested arrays
        // dedupe - remove duplicates
        const dedupedBooks = dedupeRelatedBooks(
          fetchedBooks.flat(),
          mutualBook
        );

        // Only return books that have a valid relation to mutualBook
        // i.e. return a book if it shares AT LEAST ONE author with mutualBook
        const validatedBooks = validateBooksRelationByAuthor(
          dedupedBooks,
          mutualBook
        );

        // Updated relatedBooks.value with result
        dispatch.success(validatedBooks);

        // Cache related books in sessionStorage
        cacheRelatedBooksByAuthor({
          relation: mutualBook.id,
          value: validatedBooks,
        });

        logObjectWithKeysInOrder(
          {
            authors,
            fetchedBooks,
            dedupedBooks,
            validatedBooks,
          },
          'useRelatedBooksByAuthor'
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
    const cache = getCachedRelatedBooksByAuthor();

    // Load from cache if valid, otherwise fetch related books from Google Books API
    if (isCacheValid(mutualBook, cache)) {
      console.log('> LOADED RELATED BOOKS FROM CACHE');
      dispatch.success(cache.value);
    } else {
      getRelatedBooks();
    }

    // Handle unmount
    return function cleanup() {
      abortController.abort();
    };
  }, [authors, dispatch, mutualBook]);

  return relatedBooks;
}
