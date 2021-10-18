import { useMemo, useEffect } from "react";
import PropTypes from "prop-types";

// Custom Hooks
import useAsyncReducer from "hooks/useAsyncReducer";

// Components
import { Typography } from "@material-ui/core";

// Utils
import { getBooksRequestURI } from "utils/api-query-builder";

/**
 * --- derivePropsByRelation() --- 
 * The properties of the object returned by this function:
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
                actionPrefix: "FETCH_MORE_BY_AUTHOR",
                bookLinkKey: "authors",
                searchPrefix: "inauthor:",
                storageKey: "books-by-author",
            };
        case "category":
            return {
                actionPrefix: "FETCH_MORE_BY_CATEGORY",
                bookLinkKey: "categories",
                searchPrefix: "subject:",
                storageKey: "books-by-category",
            };
        default:
            return null;
    }
};

const RelatedBooks = ({ relatedBy: relation, book }) => {
    // The properties returned are derived from the "relatedBy" prop (i.e. author / category)
    const {
        actionPrefix, // determines name of actions dispatched to async reducer
        bookLinkKey, // used to access "bookLink" (see below)
        searchPrefix, // special keyword used to filter Book API queries
        storageKey, // the web storage key, where the related books are cached
    } = derivePropsByRelation(relation);

    // bookLink is the value that represents the link/connection between fetched books and the book being viewed
    // bookLinkKey (i.e. authors / categories) is used to access the API data to retrieve the bookLink
    const bookLink = useMemo(
        () =>
            book.volumeInfo[bookLinkKey]
                ? book.volumeInfo[bookLinkKey][0]
                : null,
        [book, bookLinkKey]
    );

    // Creates reducer with state and provides a means to update it
    const [relatedBooks, dispatchStart, dispatchSuccess, dispatchFailed] =
        useAsyncReducer(actionPrefix);

    console.log("Related Books", {
        relatedBooks,
        bookLinkKey,
        bookLink,
        searchPrefix,
    });

    useEffect(() => {
        const abortController = new AbortController();

        const fetchRelatedBooks = async (bookLinkValue) => {
            // bookLink unknown (i.e. null), do not make fetch request, exit function
            if (!bookLinkValue)
                return console.log("Cannot fetch books, bookLink unknown");

            // Build request URI, where search is made using "searchPrefix" & "bookLinkValue"
            const booksRequestURI = getBooksRequestURI({
                search: `${searchPrefix}${bookLinkValue}`,
                maxResults: 40,
            });
            console.log({ booksRequestURI });

            try {
                dispatchStart(); // init loading state

                // Perform search for related books
                const response = await fetch(booksRequestURI, {
                    signal: abortController.signal,
                });
                const searchResults = await response.json();
                console.log(searchResults);

                /** Filter Search Results
                 * Retain results with bookLinkValue AND different title
                    
                 * i.e. Remove
                    - books that do not have the same bookLinkValue 
                    - duplicates (i.e. books with same title and bookLinkValue)
                 */
                const filteredBooks = searchResults.items.filter(
                    (result) =>
                        // filter out results where authors/categories array: is undefined / does not include bookLinkValue
                        result.volumeInfo[bookLinkKey]?.includes(
                            bookLinkValue
                        ) &&
                        // filter out the currently viewed book and duplicates (i.e. has same title and bookLinkValue)
                        result.volumeInfo.title !== book.volumeInfo.title
                );

                //? LOG INFO - FOR TESTING
                filteredBooks.map((result, index) =>
                    console.log(`${index}:`, {
                        [bookLinkKey]: result.volumeInfo[bookLinkKey],
                        title: result.volumeInfo.title,
                    })
                );

                // Update relatedBooks.value & end loading state
                dispatchSuccess(filteredBooks);

                // Cache fetched books in sessionStorage
                sessionStorage.setItem(
                    storageKey,
                    JSON.stringify(filteredBooks)
                );
            } catch (err) {
                // Exception - do not log error resulting from aborted fetch
                if (!abortController.signal.aborted) {
                    console.error(err);
                    // Update relatedBooks.error & end loading state
                    dispatchFailed(err);
                }
            }
        };

        // Load cached results if available
        const cachedRelatedBooks = JSON.parse(
            sessionStorage.getItem(storageKey)
        );

        /**
         * Update relatedBooks.results state with cachedRelatedBooks if:
            - there are cached books from a previous invocation of fetchRelatedBooks()
            - the cached books share the same bookLink as the currently viewed book
         * Otherwise make a new request for related books
         */
        if (
            cachedRelatedBooks?.length &&
            bookLink &&
            cachedRelatedBooks[0].volumeInfo[bookLinkKey].includes(bookLink)
        ) {
            dispatchSuccess(cachedRelatedBooks);
        } else {
            fetchRelatedBooks(bookLink);
        }

        // Cleanup async request on unmount
        return () => {
            abortController.abort();
        };
    }, [
        book,
        bookLinkKey,
        bookLink,
        searchPrefix,
        storageKey,
        dispatchStart,
        dispatchSuccess,
        dispatchFailed,
    ]);

    // No bookLink listed (in book.volumeInfo[bookLinkKey])
    if (!bookLink) {
        return (
            <Typography>{`The ${relation} of this book is unknown`}</Typography>
        );
    }

    // bookLink Listed, render Loading UI
    if (relatedBooks.isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (relatedBooks.value?.length) {
        // relatedBooks Found
        return relatedBooks.value.map((book, index) => {
            const { title, authors, description } = book.volumeInfo;
            return (
                <ul key={index}>
                    <li>
                        {`${title} by ${authors}`}
                        <ul>{description && <li>{description}</li>}</ul>
                    </li>
                </ul>
            );
        });
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
