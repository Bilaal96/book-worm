import { useState, useEffect } from "react";
import { useParams } from "react-router";

// Custom Hooks
import useAsyncReducer from "hooks/useAsyncReducer";
import useSearchContext from "hooks/useSearchContext.js";

// Components
import { Grid, Typography } from "@material-ui/core";
import HeroBanner from "components/HeroBanner/HeroBanner";
import WidthContainer from "components/WidthContainer/WidthContainer";
import CustomBackdrop from "components/CustomBackdrop/CustomBackdrop";
import BookDetailsHead from "components/BookDetailsHead/BookDetailsHead";
import BookDetailsBody from "components/BookDetailsBody/BookDetailsBody";
import AddToBooklistModal from "components/AddToBooklistModal/AddToBooklistModal";

// Utils
import { createAsyncReducer } from "utils/create-reducer";

// Assets
import heroImage from "assets/book-details-hero-image.jpg";

const BookDetailsWrapper = ({ children, ...containerProps }) => (
    <>
        <HeroBanner image={heroImage} heading="Book Details" />
        <WidthContainer {...containerProps}>{children}</WidthContainer>
    </>
);

const BookDetails = () => {
    // Access bookId Route Param - aliased as bookIdParam
    const { bookId: bookIdParam } = useParams();
    const [search] = useSearchContext();

    // Controls whether AddToBooklistModal is showing or not
    const [openModal, setOpenModal] = useState(false);

    // Init async state (i.e. loading, value, error)
    // Used to handle app state when fetching single book to display details
    const actionTypePrefix = "GET_BOOK_BY_ID";
    const [bookReducer] = createAsyncReducer(actionTypePrefix);
    const [book, dispatch] = useAsyncReducer(actionTypePrefix, bookReducer);

    console.log("BookDetails", {
        "book (async reducer)": book,
        "bookIdParam (route param)": bookIdParam,
        "search (context)": search,
    });

    // Retrieve Book Details on mount, using bookIdParam
    useEffect(() => {
        dispatch.load(); // init loading state

        // If selected book has been previously viewed by user
        // retrieve book from "viewed-books" cache in sessionStorage
        const viewedBooks = JSON.parse(sessionStorage.getItem("viewed-books"));
        if (viewedBooks && viewedBooks[bookIdParam]) {
            console.log("Retrieved from CACHE", viewedBooks[bookIdParam]);
            dispatch.success(viewedBooks[bookIdParam]);
            return;
        }

        // Book has not been viewed before (doesn't exist in aforementioned cache)
        // Retrieve book from search context
        const bookByIdFromResults = search.results?.items.find(
            (book) => book.id === bookIdParam
        );
        if (bookByIdFromResults) {
            console.log("Retrieved from CONTEXT", bookByIdFromResults);
            dispatch.success(bookByIdFromResults); // update reducer state

            // mark book as viewed - cache in sessionStorage as "viewed-books"
            const newViewedBooks = {
                ...viewedBooks,
                [bookByIdFromResults.id]: bookByIdFromResults,
            };

            sessionStorage.setItem(
                "viewed-books",
                JSON.stringify(newViewedBooks)
            );

            return;
        }

        /**
         * The above functionality prevents having to re-fetch data, and reduces loading screens/wait time
         * fetchBookById() is a fail-safe in case the preceding code fails
         
         * @param { string } id - unique identifier for a book
         * @param { Object } abortSignal - used to abort fetch on component unmount 
         * @param { string } [serverDomain] - defaults to localhost but can be changed depending on app environment (i.e. dev/production)
         */
        async function fetchBookById(
            id,
            abortSignal,
            serverDomain = "http://localhost:5000"
        ) {
            try {
                // fetch a single book at the route /:bookId
                const response = await fetch(`${serverDomain}/books/${id}`, {
                    signal: abortSignal,
                });

                // Fetch failed: HTTP status code is NOT WITHIN success range (200-299)
                if (!response.ok) {
                    const error = await response.json();
                    throw error;
                }

                // Fetch succeeded: HTTP status code is WITHIN success range (200-299)
                const bookById = await response.json();
                dispatch.success(bookById); // update reducer state
                return;
            } catch (err) {
                if (!abortSignal.aborted) {
                    console.error(err.message);
                    dispatch.failed(err); // update reducer state
                }
            }
        }

        // Fetch book
        const abortController = new AbortController();
        fetchBookById(bookIdParam, abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [bookIdParam, dispatch, search]);

    // Render loading UI
    if (book.loading) {
        return (
            <BookDetailsWrapper component="section">
                <CustomBackdrop
                    withSpinner
                    text="Loading details"
                    open={true}
                    size={60}
                    position="absolute"
                    rounded
                />
            </BookDetailsWrapper>
        );
    }

    // Render error UI
    if (book.error) {
        return (
            <BookDetailsWrapper padding={{ top: 2.6, bottom: 2.6 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    align="center"
                    color="textSecondary"
                >{`Book (with ID: ${bookIdParam}) does not exist`}</Typography>
            </BookDetailsWrapper>
        );
    }

    // Render retrieved Book Details
    if (book.value) {
        return (
            <BookDetailsWrapper padding={{ top: 2.6, bottom: 2.6 }}>
                <AddToBooklistModal
                    book={book.value}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <BookDetailsHead
                            book={book.value}
                            setOpenModal={setOpenModal}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <BookDetailsBody book={book.value} />
                    </Grid>
                </Grid>
            </BookDetailsWrapper>
        );
    }

    // Something must be returned when there is no value/error (i.e. on mount)
    return null;
};

export default BookDetails;
