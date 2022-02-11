import { useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

// Custom Hooks
import useAsyncReducer from "hooks/useAsyncReducer";

// Components
import { Typography, Grid } from "@material-ui/core";
import BookApiListItem from "components/BookApiListItem/BookApiListItem";

// Utils
import { createAsyncReducer } from "utils/create-reducer";
import { getBooksRequestURI } from "utils/api-query-builder";

/**
 * --- derivePropsByRelation() --- 
 * The property-values of the object returned by this function:
    - differ depending on the argument provided
    - are used to calculate the related books

 * @param { string } relation - a constant that determines the value of the returned properties
 * @return { Object } with properties: 
    - actionPrefix
    - bookLinkKey
    - searchPrefix - used to filter narrow down a Books API query
        - "inauthor:" - Returns results where the text following this keyword is found in the author
        - "subject:" - Returns results where the text following this keyword is found in the category
            e.g. search === `subject:${volumeInfo.categories[0]}`
        - https://developers.google.com/books/docs/v1/using#PerformingSearch
    - storageKey
 */
const derivePropsByRelation = (relation) => {
    switch (relation) {
        case "author":
            return {
                actionTypePrefix: "FETCH_BOOKS_BY_AUTHOR",
                bookLinkKey: "authors",
                searchPrefix: "inauthor:",
                storageKey: "books-by-author",
            };
        case "category":
            return {
                actionTypePrefix: "FETCH_BOOKS_BY_CATEGORY",
                bookLinkKey: "categories",
                searchPrefix: "subject:",
                storageKey: "books-by-category",
            };
        default:
            return null;
    }
};

const RelatedBooks = ({ relatedBy: relation, book }) => {
    const history = useHistory();

    // The properties returned are derived from the "relatedBy" prop (i.e. author / category)
    const {
        actionTypePrefix, // names actions dispatched to async reducer
        bookLinkKey, // used to access "bookLink" (see below)
        searchPrefix, // special keyword used to filter Book API queries
        storageKey, // web storage key; where "related books" are cached
    } = derivePropsByRelation(relation);

    /** Definitions: bookLink & bookLinkKey
     * bookLink - a string value that represents the "link"/connection between the book being viewed and the fetched related books
     * i.e. author / category name (e.g. George Martin / Fantasy)
     
     * bookLinkKey - a string value used to access the API data to retrieve the bookLink; possible values: "authors" / "categories" 
     */
    const bookLink = useMemo(
        () =>
            book.volumeInfo[bookLinkKey]
                ? book.volumeInfo[bookLinkKey][0]
                : null,
        [book, bookLinkKey]
    );

    // Init async state (i.e. loading, value, error)
    // Used to handle app state when fetching related books
    const [relatedBooksReducer] = createAsyncReducer(actionTypePrefix);
    const [relatedBooks, dispatch] = useAsyncReducer(
        actionTypePrefix,
        relatedBooksReducer
    );

    console.log("Related Books", {
        relatedBooks,
        bookLinkKey,
        bookLink,
        searchPrefix,
    });

    // Fetch relatedBooks; cache in web storage; determine when to load from cache
    useEffect(() => {
        const abortController = new AbortController();

        // NOTE: in fetchRelatedBooks, bookLinkValue is an alias for bookLink
        const fetchRelatedBooks = async (bookLinkValue) => {
            // bookLink unknown, can't fetch without it, exit function
            if (!bookLinkValue)
                return console.log("Cannot fetch books, bookLink unknown");

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
                console.log("RelatedBooks Fetch Results", searchResults);

                /** Filter Search Results
                 * Keep results with matching bookLinkValue AND different title
                  
                 * Remove results where bookLinkKey (either "authors" OR "categories") does not exist as a property
                 * Remove results that do not have the same bookLinkValue as the book being viewed (book-in-view)

                 * Remove book-in-view and duplicates of it 
                 * i.e. where result's & book-in-view's title AND bookLinkValue are identical
                 */
                const filteredBooks = searchResults.items.filter(
                    (result) =>
                        result.volumeInfo[bookLinkKey]?.includes(
                            bookLinkValue
                        ) && result.volumeInfo.title !== book.volumeInfo.title
                );
                console.log("filteredBooks", filteredBooks);

                //? LOG INFO - FOR TESTING
                filteredBooks.map((result, index) =>
                    console.log(`${index}:`, {
                        [bookLinkKey]: result.volumeInfo[bookLinkKey],
                        title: result.volumeInfo.title,
                    })
                );

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
            fetchRelatedBooks(bookLink);
        }

        // Cleanup async request on unmount
        return () => {
            abortController.abort();
            console.log(`${storageKey} unmounted`);
        };
    }, [book, bookLinkKey, bookLink, searchPrefix, storageKey, dispatch]);

    const handleRelatedBookClick = (bookId) => (e) => {
        // Clear all "related books" from cache
        sessionStorage.removeItem("books-by-author");
        sessionStorage.removeItem("books-by-category");
        // Navigate to the BookDetails page for the "related book" that is clicked
        history.push(`/books/${bookId}`);
    };

    // No bookLink listed (in book.volumeInfo[bookLinkKey])
    if (!bookLink) {
        return (
            <Typography>{`The ${relation} of this book is unknown`}</Typography>
        );
    }

    // bookLink Listed, render Loading UI
    if (relatedBooks.loading) {
        return <Typography>Loading...</Typography>;
    }

    if (relatedBooks.value?.length) {
        // relatedBooks Found
        return (
            <Grid container spacing={2}>
                {relatedBooks.value.map((book, index) => (
                    <BookApiListItem
                        key={index}
                        book={book}
                        onClick={handleRelatedBookClick(book.id)}
                    />
                ))}
            </Grid>
        );
    } else {
        // No relatedBooks Found
        return (
            <Typography>
                {`No books related by ${relation} can be found`}
            </Typography>
        );
    }
};

RelatedBooks.propTypes = {
    relatedBy: PropTypes.string.isRequired,
    book: PropTypes.object.isRequired,
};

export default RelatedBooks;
