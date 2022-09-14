import { getUniqueList } from 'utils/unique-list';

/**
 * Formats the categories list of a book from Google Books (GB) API to return the first 3 categories.
 * @param { Array } apiCategories - a list of categories to format. 
 * @param { Number } categoriesCount - the number of categories to return. Defaults to length of apiCategories array.
 * @returns { Array } formatted list of categories
 * --- 
 * #### Why Is This Necessary
 * Some Categories list are really long, for example:
    - book title: Test Your IQ
    - categories: Business & Economics / Careers / General, Games & Activities / Logic & Brain Teasers, Study Aids / Tests (Other), Psychology / Cognitive Psychology & Cognition, Self-Help / General
  
 * In useRelatedBooksByCategory, a single category is used as the search parameter in request to GB API
 * Even if we only take the first segment ([1] / 2 / 3) of each category:
  - duplicates remain -> resulting in duplicate requests
  - too many requests are sent at once to GB API
 
 * #### The Compromises Made
 * To work around this:
  - (1) take the first segment of each category
    - e.g where categories === "1 / 2 / 3" select [1] / 2 / 3
  - (2) remove duplicates
  - (3) limit the number of requests to the FIRST 3 categories in the array

 * With this implementation, passing the above categories list as argument to formatBooksApiCategories() would return:
    - [ "Business & Economics", "Games & Activities", "Study Aids", "Self-Help"]
  
 * Specifying a non-default value as the categoriesCount argument will limit the size of the returned array.
 * Continuing with the above example, passing categoriesCount === 2 returns:
  - [ "Business & Economics", "Games & Activities" ]
 */
export const formatBooksApiCategories = (
  apiCategories,
  categoriesCount = apiCategories.length
) => {
  // Get array of the first segment of each category string
  const categories = apiCategories.map((category) => category.split(' / ')[0]);

  // Remove duplicates & return first 3 categories
  return getUniqueList(categories).slice(0, categoriesCount);
};

/**
 * A "mutualBook" is a book from Google Books (GB) API that additional books are fetched in relation to.
 * It is the purpose of this function to ensure that each of the additionally fetched books share AT LEAST ONE category with "mutualBook". The books that DO NOT meet this criteria are removed from the returned list of books.
 
 * @param { Array } booksToValidate - a list of book objects to validate.
 * @param { Array } validCategories - the return value of formatBooksApiCategories. This list holds the criteria by which valid relationships with a "mutualBook" are determined.   
 * @returns { Array } list of books that share at least one category in common with "mutualBook"
 
 * Adapted from: https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript

 * ---

 * #### Why Validation of Categories is Required
 * Some books fetched from GB API do not share an author with the mutualBook.
 * So we must manually ensure that each book fetched shares AT LEAST ONE category with mutualBook.
 
 * #### Validation Logic Explained
 * mutualBook's categories array is mapped to a new array containing the FIRST SEGMENT/SUBSTRING of a category (i.e. an array of custom formatted categories).
 * For example, where one category of a book from GB API may be "Business & Economics / Careers / General", we select the first segment using array.split(' / ') method; i.e. "Business & Economics".
 * As a consequence of this workaround, when validating the relation between a fetched book & mutualBook, we must check if a value in categories array exists as a SUBSTRING of the mutualBook's categories array.
 * E.g. look for "Business & Economics" within each element of mutualBook.volumeInfo.categories array.
 
 * #### Array.includes vs String.includes
 * Array.includes -> checks if EXACT VALUE passed exists as ELEMENT. It does not match a substring of an element (e.g. ["drag", "brag", "pragmatic"].includes("rag") === false).
 * String.includes -> checks if SUBSTRING passed exists in STRING (e.g. "brag".includes("rag") === true).
 
 * As we're checking for a SUBSTRING within ELEMENT of fetchedBook.volumeInfo.categories, this function makes use of the String.includes function.
 */
export const validateBooksRelationByCategory = (
  booksToValidate,
  validCategories
) => {
  // Returns true, if at least one validCategory is a substring of category
  const isValidCategory = (category) =>
    validCategories.some((validCategory) => category.includes(validCategory));

  // Callback passed to booksToValidate.filter() below
  const booksShareACategory = (book) => {
    if (
      // categories property does NOT exist
      !book.volumeInfo.categories ||
      // categories property is NOT an Array
      !(book.volumeInfo.categories instanceof Array)
    )
      return false;

    // returns true if AT LEAST ONE element in validCategories is a substring of AT LEAST ONE category of a book in booksToValidate array
    return book.volumeInfo.categories.some(isValidCategory);
  };

  // Return validated array of books (i.e. books related to a mutualBook by category)
  return booksToValidate.filter(booksShareACategory);
};

// Caching in Session Storage - details outlined in ./by-author.js
const BY_CATEGORY_CACHE_KEY = 'related-books-by-category';

export const cacheRelatedBooksByCategory = (value) =>
  sessionStorage.setItem(BY_CATEGORY_CACHE_KEY, JSON.stringify(value));

export const getCachedRelatedBooksByCategory = () =>
  JSON.parse(sessionStorage.getItem(BY_CATEGORY_CACHE_KEY));

export const clearCachedRelatedBooksByCategory = () =>
  sessionStorage.removeItem(BY_CATEGORY_CACHE_KEY);
