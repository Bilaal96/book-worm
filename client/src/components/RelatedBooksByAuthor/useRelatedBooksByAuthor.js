/**
 * --- What it is ---
 * useRelatedBooksByAuthor (abbr: useRBBA) extracts the business logic for the RelatedBooksByAuthor (abbr: RBBA) component into a hook. 
 
 * useRBBA receives mutualBook - a book object from Google Books (GB) API - as an argument
 * useRBBA is responsible for:
  - fetching books related to mutualBook by author - i.e. books that share an author in common with mutualBook
  - sanitizing & returning the related books
 
 * --- How it works ---
 * For each author of mutualBook, a fetch request is made to GB API
 * Results of a successful fetch request returns an array of books related to a SINGLE author (AKA booksBySingleAuthor)
 * Each booksBySingleAuthor array returned is placed in a parent array; failed requests are excluded

 * useRBBA hook then sanitizes the fetched books like so:
 * (1) Iterates on the parent array and sanitizes each nested booksBySingleAuthor array by:
  - (a) Removing:
    - mutualBook (if present)
    - duplicates (identified by book id)
    - books that don't actually share an author (these may be related to mutualBook in some other way)
  - (b) return a limited number of books (limit is hard-coded)
 * (2) Aggregates the nested arrays by flattening the parent array into a one-dimensional array
 * (3) Removes duplicates from the flattened array
 
 * useRBBA returns the relatedBooks state object:
  - loading -> handles loading state during data fetching
  - value -> stores the sanitized result (which is also cached in sessionStorage)
  - error -> stores error object if thrown; the error message is rendered in UI by RBBA component
 
 * --- Why this approach? ---
 * An alternative approach is outlined in the useRelatedBookByAuthorAlt hook, which is technically more efficient as it uses less loops and function calls.
 * However this useRBBA hook is used in the final implementation (despite requiring more steps) because:
  (1) it returns more results
  (2) allows us to manually limit the results returned PER AUTHOR
 * Ultimately, in this specific situation the functionality is more important than the optimisation, and useRBBA returns a more balanced set of results.
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
  validateBooksRelationByAuthor,
  cacheRelatedBooksByAuthor,
  getCachedRelatedBooksByAuthor,
} from 'utils/related-books/by-author';
import { logObjectWithKeysInOrder } from 'utils/logger';

// Constants
const ACTION_TYPE_PREFIX = 'FETCH_BOOKS_BY_AUTHOR';
const MAX_BOOKS_PER_API_REQUEST = 40;
const MAX_BOOKS_PER_AUTHOR = 15;
// Books API - "special keywords": https://developers.google.com/books/docs/v1/using#PerformingSearch
const SEARCH_BY_AUTHOR = 'inauthor:';

/**
 * Hook that encapsulates fetching, data handling & caching logic for books related by author.
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

    // Invokes helper functions to fetch, dedupe & aggregate books related by authors
    // NOTE: there may be one or more author(s)
    async function getBooksByAuthor() {
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

        /**
         * fetchedBooks is a nested array
         * Each nested array (booksBySingleAuthor) contains books relating to a single author within the authors array
         * In the nested arrays:
          - remove duplicate books
          - check that the remaining books share at least one author with mutualBook
         */
        const validatedBooks = fetchedBooks.map((booksBySingleAuthor) => {
          // Remove duplicates & mutualBook (if present)
          const dedupedBooks = dedupeRelatedBooks(
            booksBySingleAuthor,
            mutualBook
          );

          // Only return books that share AT LEAST ONE author with mutualBook
          const validatedBooks = validateBooksRelationByAuthor(
            dedupedBooks,
            mutualBook
          );

          // Limit number of results returned from each array
          return validatedBooks.slice(0, MAX_BOOKS_PER_AUTHOR);
        });

        // Flatten validatedBooks and remove any remaining duplicates
        const sanitizedBooks = getUniqueListBy(validatedBooks.flat(), 'id');

        // Updated relatedBooks.value with result
        dispatch.success(sanitizedBooks);

        // Cache related books in sessionStorage
        cacheRelatedBooksByAuthor({
          relation: mutualBook.id,
          value: sanitizedBooks,
        });

        logObjectWithKeysInOrder(
          {
            authors,
            fetchedBooks,
            validatedBooks,
            sanitizedBooks,
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
      getBooksByAuthor();
    }

    // Handle unmount
    return function cleanup() {
      abortController.abort();
    };
  }, [authors, dispatch, mutualBook]);

  return relatedBooks;
}
