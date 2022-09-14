import { getUniqueListBy } from 'utils/unique-list';

/**
 * Returns true if all outcomes from calling Promise.allSettled() were rejected.
 * Returns false if AT LEAST one outcome was fulfilled.
 * @param { Array } resolvedPromises - the resolved value of Promise.allSettled()
 * @returns { Boolean }
 */
export const wereAllPromisesRejected = (resolvedPromises) => {
  const totalPromiseCount = Object.keys(resolvedPromises).length;
  let rejectedCount = 0;

  // Increment rejectedCount for every rejected promise in resolvedPromises
  for (const outcome of resolvedPromises) {
    if (outcome.status === 'rejected') rejectedCount += 1;
  }

  // All outcomes were rejected
  if (rejectedCount === totalPromiseCount) return true;

  // At least one outcome was fulfilled
  return false;
};

/**
 * For each URI in `booksRequestURIs` array, make a fetch request to Google Books API.
 
 * NOTE: try-catch is not used because errors should be handled by caller. 
 
 * @param { Array } booksRequestURIs - list of URIs to be fetched; accepts return value of getRelatedBooksRequestURIs.
 * @param { AbortSignal } abortSignal - object used to abort fetch API call when necessary
 * @returns { Array } a list where each element holds the books resulting from a successful fetch request.
 */
export const fetchBooksByMultipleURIs = async (
  booksRequestURIs,
  abortSignal
) => {
  // Fetch books per request URI and return in new fetchRequests array
  const fetchRequests = booksRequestURIs.map(async (uri) => {
    const response = await fetch(uri, { signal: abortSignal });

    /**
     * Throw error if fetch fails - i.e. status code is NOT WITHIN success range (200-299)
     * NOTE: throwing an error object in an async function is the equivalent to calling Promise.reject(reason); where the error object is the reason.
     * NOTE: The error object thrown is used for debugging only and does NOT contribute to the rendered UI
     */
    if (!response.ok) {
      const error = new Error('Fetch request failed');
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    //! DEBUG: FORCEFULLY REJECTS A PROMISE - UNCOMMENT TO TEST IF REJECTED PROMISES ARE FILTERED OUT AS EXPECTED
    /* if (index === 1) {
      const error = new Error('Fetch request failed');
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    } */

    // Parse response on success (200-299)
    return response.json();
  });

  /**
   * Ensure every fetch request has settled (i.e. resolved or rejected) before continuing
   * Promise.allSettled() returns an array of objects, representing either:
    - fulfilled promise - { status: "fulfilled", value: ... }
    - rejected promise - { status: "rejected", reason: ... }
   */
  const outcomes = await Promise.allSettled(fetchRequests);
  console.log({ outcomes });

  // If ALL fetch requests failed, throw error with message to be rendered in UI
  if (wereAllPromisesRejected(outcomes)) {
    throw new Error(
      "We're currently unable to search books data, please try again later"
    );
  }

  /**
   * At least one fetch request succeeded
   * Filter out rejected promises
   * Return list of related books if it exists, otherwise default to an empty array to indicate that no related books were found
   */
  return outcomes
    .filter((outcome) => outcome.status === 'fulfilled')
    .map((outcome) => outcome.value?.items || []);
};

/**
 * Filters out a single book from a list of books by checking against the 'id' property.
 
 * @param { Array } bookList - the array from which the book is to be removed. 
 * @param { Object } bookToRemove - the book to remove from bookList.
 * @returns { Array } the updated bookList array.
 */
export const removeBookFromList = (bookList, bookToRemove) =>
  bookList.filter((book) => book.id !== bookToRemove.id);

/**
 * Removes the following from an array of related books:
  - mutualBook (defined below)
  - duplicates of books (identified by common ids)
  
 * @param { Array } relatedBooks - a list of book objects related to mutualBook.
 * @param { Object } mutualBook - the book that shares a common property with elements of relatedBooks.
 */
export const dedupeRelatedBooks = (relatedBooks, mutualBook) => {
  // Remove mutualBook (if present)
  let updatedRelatedBooks = removeBookFromList(relatedBooks, mutualBook);

  // Remove duplicate books
  return getUniqueListBy(updatedRelatedBooks, 'id');
};

/**
 * Validate the cache by ensuring that:
 1. the cache is NOT null
 2. the cache is related to mutualBook (i.e. the book in the current view)
 3. the cached value is an array

 * NOTE: We don't check for cache.length because an empty array is a valid cached value

 * @param { Object } bookInView - the book currently being viewed by user
 * @param { Object | undefined } cache - cache of books, related to bookInView by author or category
 */
export const isCacheValid = (bookInView, cache) =>
  cache !== null && // (1)
  cache.relation === bookInView.id && // (2)
  cache.value instanceof Array; // (3)
