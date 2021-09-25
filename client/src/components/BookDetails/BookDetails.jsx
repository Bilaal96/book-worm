import { useParams } from "react-router";

// Contexts
import { useSearchContext } from "contexts/search/search.context";

// Components
import { Typography } from "@material-ui/core";

/** KNOWN ISSUE
 *! Search Context does persist on page refresh, or when app is opened in new window
 ** Potential solution: persist search results to Local Storage, and check for data on app load/refresh

 * ALSO, create "BookNotFound" component to show when bookId does not exist in search results
 */
const BookDetails = () => {
    const [search] = useSearchContext();
    const { bookId } = useParams(); // ID of book being viewed

    // Get book from search results with ID matching param (/:bookId)
    const book = search.results?.items.find((book) => book.id === bookId);

    console.log("search (BookDetails):", search);
    console.log({ book });

    return (
        <div>
            <Typography variant="h2" component="h1" align="center">
                Book Details
            </Typography>
            <Typography variant="h2" component="h1" align="center">
                {book
                    ? book.volumeInfo.title
                    : "No book data | does not persist on Refresh"}
            </Typography>
        </div>
    );
};

export default BookDetails;
