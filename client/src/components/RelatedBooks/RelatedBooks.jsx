import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";

// Custom Hooks
import useAsyncReducer from "hooks/useAsyncReducer";

// Components
import { Hidden } from "@material-ui/core";
import CustomBackdrop from "components/CustomBackdrop/CustomBackdrop";
import BookCardsList from "components/BookCardsList/BookCardsList";

// Utils
import { createAsyncReducer } from "utils/create-reducer";
import { getBooksRequestURI } from "utils/api-query-builder";

/** BOOK_RELATIONS_MAP
 * An object used to look up properties that map to the "relatedBy" prop
 * The properties retrieved are supplied as function arguments & constants throughout the RelatedBooks component
 
 * @property actionTypePrefix - prefixes name of actions dispatched to async reducer.
 * @property bookLinkKey - used to access "bookLinkValue" (see definition below).
 
 * bookLinkValue - a string value retrieved from the Book API results that represents the "link"/connection between the book being viewed and therelated books (fetched from API). For example: 
    - bookLinkKey: author --returns--> bookLinkValue: George Martin
    - bookLinkKey: category --returns--> bookLinkValue: Fantasy
 
 * @property searchPrefix - a keyword used to narrow down a query to Books API.
    - "inauthor:" - Returns results where the text following this keyword is found in the author.
    - "subject:" - Returns results where the text following this keyword is found in the category.
    - e.g. search === `subject:${volumeInfo.categories[0]}`.

 * Reference: https://developers.google.com/books/docs/v1/using#PerformingSearch

 * @property storageKey - web storage key; where "related books" are cached.
 */
const BOOK_RELATIONS_MAP = {
    author: {
        actionTypePrefix: "FETCH_BOOKS_BY_AUTHOR",
        bookLinkKey: "authors",
        searchPrefix: "inauthor:",
        storageKey: "books-by-author",
    },
    category: {
        actionTypePrefix: "FETCH_BOOKS_BY_CATEGORY",
        bookLinkKey: "categories",
        searchPrefix: "subject:",
        storageKey: "books-by-category",
    },
};

const RelatedBooks = ({ relatedBy: relation, book: targetBook }) => {
    const history = useHistory();

    // The properties returned are derived from the "relatedBy" prop (i.e. author / category)
    const { actionTypePrefix, bookLinkKey, searchPrefix, storageKey } =
        BOOK_RELATIONS_MAP[relation];

    // bookLinValue - a string value representing the relation between
    // ... the book being viewed and the related books (fetched from API)
    const bookLinkValue = useMemo(
        () =>
            targetBook.volumeInfo[bookLinkKey]
                ? targetBook.volumeInfo[bookLinkKey][0]
                : null,
        [targetBook, bookLinkKey]
    );

    // Init async state (i.e. loading, value, error)
    // Used to handle app state when fetching related books
    const [relatedBooksReducer] = createAsyncReducer(actionTypePrefix);
    const [relatedBooks, dispatch] = useAsyncReducer(
        actionTypePrefix,
        relatedBooksReducer
    );

    console.log("RELATED BOOKS:", {
        relatedBooks,
        bookLinkValue: { key: bookLinkKey, value: bookLinkValue },
        searchPrefix,
    });

    // Fetch relatedBooks; cache in web storage; determine when to load from cache
    useEffect(() => {
        const abortController = new AbortController();

        const fetchRelatedBooks = async () => {
            // bookLinkValue unknown, can't fetch without it, exit function
            if (!bookLinkValue)
                return console.log("Cannot fetch books, bookLinkValue unknown");

            // Get URI to send request to Books API
            const booksRequestURI = getBooksRequestURI({
                search: `${searchPrefix}${bookLinkValue}`,
                maxResults: 40,
            });

            try {
                dispatch.load(); // init loading state

                // Perform search for related books
                const response = await fetch(booksRequestURI, {
                    signal: abortController.signal,
                });

                // Fetch failed: HTTP status code is NOT WITHIN success range (200-299)
                if (!response.ok) {
                    const error = await response.json();
                    throw error;
                }

                // Fetch succeeded: HTTP status code is WITHIN success range (200-299)
                const searchResults = await response.json();

                /** Remove books with duplicate IDs    
                 * (1) Filter out targetBook prop from searchResults          
                 * (2) Iterate books array (searchResults.items) using reduce() method. 
                 * Initialise accumulator (of reduce()) with new instance of Map()
                 
                 * (3) On each iteration, create a map entry where:
                    - the key === book.id
                    - the value === book
                 * NOTE: This creates a map instance of unique books because a Map (just like Objects) cannot have duplicate keys.
                 
                 * (4) Get all book objects stored in the map instance by calling Map.values() method -> this returns a MapIterator
                  
                 * (5) Create an array of unique book objects using: Array.from(MapIterator)
                 */
                const uniqueBooks = Array.from(
                    searchResults.items
                        // Remove the current book being viewed
                        .filter((book) => book.id !== targetBook.id)
                        .reduce(
                            (map, book) => map.set(book.id, book),
                            new Map()
                        )
                        .values()
                );

                /** Filter Search Results
                 * Keep results with matching bookLinkValue AND different title
                  
                 * Remove results where bookLinkKey (either "authors" OR "categories") does not exist as a property
                 * Remove results that do not have the same bookLinkValue as the book being viewed (book-in-view)

                 * Remove book-in-view and duplicates of it 
                 * i.e. where result's & book-in-view's title AND bookLinkValue are identical
                 */
                const filteredBooks = uniqueBooks.filter(
                    (uniqueBook) =>
                        uniqueBook.volumeInfo[bookLinkKey]?.includes(
                            bookLinkValue
                        ) &&
                        uniqueBook.volumeInfo.title !==
                            targetBook.volumeInfo.title
                );

                //? LOG INFO - FOR TESTING
                console.log("RESULTS OF RELATED BOOKS SEARCH:", {
                    "searchResults (unfiltered)": searchResults,
                    filteredBooks,
                    "filteredBooks (specific)": filteredBooks.map((result) => ({
                        id: result.id,
                        [bookLinkKey]: result.volumeInfo[bookLinkKey],
                        title: result.volumeInfo.title,
                    })),
                });

                // Update relatedBooks.value & end loading state
                dispatch.success(filteredBooks);

                // Cache fetched books in sessionStorage
                sessionStorage.setItem(
                    storageKey,
                    JSON.stringify(filteredBooks)
                );
            } catch (err) {
                // Exception - do not log error resulting from aborted fetch
                if (!abortController.signal.aborted) {
                    console.error(err.message);
                    // Update relatedBooks.error & end loading state
                    dispatch.failed(err);
                }
            }
        };

        // Get cached "related books" array if available
        const cachedRelatedBooks = JSON.parse(
            sessionStorage.getItem(storageKey)
        );

        /**
         * Update relatedBooks.value state with cachedRelatedBooks if:
            - there are cached books from a previous invocation of fetchRelatedBooks()
         * Otherwise make a new request for related books
         */
        if (cachedRelatedBooks?.length) {
            console.log("LOADED RELATED BOOKS FROM CACHE");
            dispatch.success(cachedRelatedBooks);
        } else {
            fetchRelatedBooks();
        }

        // Cleanup async request on unmount
        // i.e. prevent pending request if user switched tabs
        return () => {
            abortController.abort();
        };
    }, [
        targetBook,
        bookLinkKey,
        bookLinkValue,
        searchPrefix,
        storageKey,
        dispatch,
    ]);

    const navigateToBookDetailsRoute = (bookId) => (e) => {
        // Clear all "related books" from cache
        sessionStorage.removeItem("books-by-author");
        sessionStorage.removeItem("books-by-category");
        // Navigate to the BookDetails page for the "related book" that is clicked
        history.push(`/books/${bookId}`);
    };

    // No bookLinkValue listed (in book.volumeInfo[bookLinkKey])
    if (!bookLinkValue) {
        return (
            <CustomBackdrop
                text={`The ${relation} of this book is unknown`}
                position="static"
            />
        );
    }

    // bookLinkValue Listed, render Loading UI
    if (relatedBooks.loading) {
        return (
            <CustomBackdrop
                text="Finding related books"
                position="static"
                spinner
            />
        );
    }

    if (relatedBooks.value?.length) {
        // relatedBooks Found
        return (
            <>
                {/* Display BookCard's in GRID format; hide at "lgUp" breakpoint */}
                <Hidden lgUp>
                    <BookCardsList
                        books={relatedBooks.value}
                        cardLayout="vertical"
                        breakpoints={{ xs: 12, sm: 6 }}
                        handleBookDetailsClick={navigateToBookDetailsRoute}
                    />
                </Hidden>

                {/* Display BookCard's in LIST format; hide at "mdDown" breakpoint */}
                <Hidden mdDown>
                    <BookCardsList
                        books={relatedBooks.value}
                        cardLayout="horizontal"
                        breakpoints={{ xs: 12 }}
                        handleBookDetailsClick={navigateToBookDetailsRoute}
                    />
                </Hidden>
            </>
        );
    } else {
        // No relatedBooks Found
        return (
            <CustomBackdrop
                text={`No books related by ${relation} can be found`}
                position="static"
            />
        );
    }
};

RelatedBooks.propTypes = {
    relatedBy: PropTypes.oneOf(["author", "category"]).isRequired,
    book: PropTypes.object.isRequired,
};

export default RelatedBooks;
