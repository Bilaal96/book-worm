/**
 * Validates that the books in the `booksToValidate` list share AT LEAST ONE author in common with `mutualBook`. Filters out books that do not share an author with `mutualBook`.
 
 * @param { Array } booksToValidate - a list of book objects fetched from Google Books (GB) API in relation to `mutualBook` by author.
 * @param { Object } mutualBook - a book object (from GB API); it holds a categories array that is used to determine which items in `booksToValidate` are valid.
 * @returns { Array } list of books that share AT LEAST ONE author in common with mutualBook.
 
 * Adapted from: https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
 */
export const validateBooksRelationByAuthor = (booksToValidate, mutualBook) => {
  // Callback passed to booksToValidate.filter() below
  const booksShareAnAuthor = (book) => {
    if (
      // authors property does NOT exist
      !book.volumeInfo.authors ||
      // authors property is NOT an Array
      !(book.volumeInfo.authors instanceof Array)
    )
      return false;

    /**
     * Array.some(testFn) returns true if ANY element passes the test function provided, and false otherwise
     
     *The test function below returns TRUE if a single value in the `book.volumeInfo.authors` array exists in the `mutualBook.volumeInfo.authors` array
     * Otherwise it returns FALSE
     */
    return book.volumeInfo.authors.some((author) =>
      mutualBook.volumeInfo.authors.includes(author)
    );
  };

  // Return validated array of books (i.e. books related to a mutualBook by author)
  return booksToValidate.filter(booksShareAnAuthor);
};

/** 
 * --- Why caching is necessary ---
 * Caching related books data ensures that it is not re-fetched when:
  - a user switches between the tabs (of the BookDetailsTabs component)
  - the most recently cached data is related to the book currently being viewed

 * --- Why sessionStorage? ---
 * Related books are cached in sessionStorage using the key defined below
 * A session is created per browser tab / window
 * Using session storage ensures that the data:
  - persists on page reloads / restores
  - is cleared after tab / window close

 * NOTE: Using local storage in attempt to persist related books data would quickly exceed local storage limit 

 * --- Shape of cached data ---
 * The cache is an object with the following properties:
  - value: the fetched & sanitized related books data from Google Books API 
  - relation: the id of the book to which the fetched books are related 
  
 * --- Validating the cache ---
 * The cache is valid if:
  - it is NOT null
  - cache.relation is EQUAL TO the ID of the book currently being viewed
  - cache.value is an array - empty or filled
 */
const BY_AUTHOR_CACHE_KEY = 'related-books-by-author';

export const cacheRelatedBooksByAuthor = (value) =>
  sessionStorage.setItem(BY_AUTHOR_CACHE_KEY, JSON.stringify(value));

export const getCachedRelatedBooksByAuthor = () =>
  JSON.parse(sessionStorage.getItem(BY_AUTHOR_CACHE_KEY));

export const clearCachedRelatedBooksByAuthor = () =>
  sessionStorage.removeItem(BY_AUTHOR_CACHE_KEY);
