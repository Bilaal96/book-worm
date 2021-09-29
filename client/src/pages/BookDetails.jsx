import { useState, useEffect } from "react";
import { useParams } from "react-router";

// Components
import { Typography } from "@material-ui/core";

const BookDetails = () => {
    // Access bookId Route Param - aliased as bookIdParam
    const { bookId: bookIdParam } = useParams();
    const [book, setBook] = useState(null);
    console.log("BookDetails", { bookIdParam, book });

    // On mount
    useEffect(() => {
        // Retrieve "search-results" cached in sessionStorage
        const cachedSearchResults = JSON.parse(
            sessionStorage.getItem("search-results")
        );
        console.log("BookDetails (cachedSearchResults)", cachedSearchResults);

        // Find book in cached results with an ID matching the "/:bookId" route param
        const selectedBook = cachedSearchResults?.items.find(
            (book) => book.id === bookIdParam
        );

        // Set local book state; if book is not found, set to undefined
        setBook(selectedBook);
    }, [bookIdParam]);

    return (
        <>
            <Typography variant="h2" component="h1" align="center">
                Book Details
            </Typography>

            {book ? (
                <Typography variant="h3" component="h2" align="center">
                    {book.volumeInfo.title}
                </Typography>
            ) : (
                <Typography
                    variant="h2"
                    component="h1"
                    align="center"
                    color="textSecondary"
                >{`Book (with ID: ${bookIdParam}) does not exist`}</Typography>
            )}
        </>
    );
};

export default BookDetails;
