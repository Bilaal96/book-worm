/** Google Books 4 Main Concepts
 * https://developers.google.com/books/docs/v1/getting_started?authuser=1#background
 
 * Volumes -> data on a book or magazine
 * Bookshelf -> collection of Volumes
    -> comes with built-in bookshelves - some filled by user, some with AI suggestions
    -> on Google Books site (only) users can:
        - manually CRUD their own bookshelves
        - make a bookshelf private or public
 * Review - star rating & text - user can submit one per volume
 * Reading Position - last read position in a Volume for a user
    -> one per Volume
    -> does not exist until a user opens a Volume
    -> can store detailed position info (private to user) - down to the resolution of a word
 */
import { useState } from "react";
import { useSnackbar } from "notistack";

// Custom Hooks
import useSearchContext from "hooks/useSearchContext.js";

// Components
import HeroBanner from "components/HeroBanner/HeroBanner";
import SearchBar from "components/SearchBar/SearchBar";
import SearchResultsPagination from "components/SearchResultsPagination/SearchResultsPagination";
import SearchResults from "components/SearchResults/SearchResults";

// Utils
import { getBooksRequestURI } from "utils/api-query-builder";

// Assets
import heroImage from "assets/home-hero-image-medium.jpg";

// Initialises selectedPage state - the currently selected page
const getInitialSelectedPage = () => {
    const cachedResultsPage = JSON.parse(
        sessionStorage.getItem("results-page")
    );

    // Restore last clicked "page" if cached in sessionStorage
    if (cachedResultsPage) return cachedResultsPage;

    // Otherwise, default to page 1
    return 1;
};

const BooksSearch = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [selectedPage, setSelectedPage] = useState(getInitialSelectedPage);
    const [search, dispatchSearch] = useSearchContext();

    console.log("BooksSearch", {
        searchContext: search,
        selectedPage,
    });

    /**
     * ----- fetchBooks() -----
     * Builds Request URI - see getBooksRequestURI() below
     * Makes an async request for Books API data (using URI) 
     * Updates the SearchContext during and after the async request
     * Caches results of the request in sessionStorage
     
     * --- getBooksRequestURI() ---
     * Builds and returns a URI that targets the Google Books API 
     
     * @param { object } configurableParams - query parameters as key-value pairs 
     
     * configurableParams REQUIRES a "search" property
     * Additional properties (set internally by getBooksRequestURI) have default values 
     * Default properties can be overridden if specified in configurableParams 
     * See "src/helpers/api-query-builder.js" for details
     */
    async function fetchBooks(configurableParams) {
        console.log("fetchBooks", { configurableParams });

        // Build URI to fetch books from
        const booksRequestURI = getBooksRequestURI(configurableParams);

        try {
            // Enter loading state
            dispatchSearch.load();

            // Fetch books from Google Books API
            const response = await fetch(booksRequestURI);

            // Fetch failed: HTTP status code is NOT WITHIN success range (200-299)
            if (!response.ok) {
                const error = await response.json();

                // Set "search-results" item in sessionStorage to null
                // SearchBar checks for null value to determine when to display "Results found" snackbar notification
                sessionStorage.setItem("search-results", JSON.stringify(null));

                throw error;
            }

            // Fetch succeeded: HTTP status code is WITHIN success range (200-299)
            const books = await response.json();
            // console.log("fetchBooks response:", books);

            // Update SearchContext with fetched data, and exit loading state
            dispatchSearch.success(books);

            // Cache fetched books in sessionStorage
            sessionStorage.setItem("search-results", JSON.stringify(books));
        } catch (err) {
            console.error(err.message);
            // update SearchContext with error, and exit loading state
            dispatchSearch.failed(err);

            // Default enqueueSnackbar() arguments
            const snackbar = {
                message: err.message,
                options: { variant: "error" },
            };

            // "No results found" notification
            if (err.code === 404) {
                snackbar.message =
                    "No results found 🤷‍♂️ try searching for something else";
                snackbar.options = { variant: "default" };
            }

            // Internal Server Error notification
            if (err.code === 500) {
                snackbar.message =
                    "Search failed 🤔. If this problem persists, please try again later.";
            }

            // Display notification
            enqueueSnackbar(snackbar.message, snackbar.options);
        }
    }

    /**
     * Compose Pagination Component
        - React Docs - Composition Pattern Example:
        - https://reactjs.org/docs/context.html#before-you-use-context
     */
    const ResultsPagination = (
        <SearchResultsPagination
            fetchBooks={fetchBooks}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pageCount={10}
            isFetchingBooks={search.loading}
        />
    );

    return (
        <>
            <HeroBanner
                image={heroImage}
                heading="Discover"
                ctaText="From the largest online collection of literature"
            >
                {/* Search Bar */}
                <SearchBar
                    fetchBooks={fetchBooks}
                    setSelectedPage={setSelectedPage}
                />
            </HeroBanner>

            {/* Renders appropriate UI based on Books API search results */}
            <SearchResults resultsPagination={ResultsPagination} />
        </>
    );
};

export default BooksSearch;
