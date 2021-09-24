import { Typography } from "@material-ui/core";

const BookDetails = ({ book }) => {
    return (
        <div>
            <Typography variant="h2" component="h1" align="center">
                Book Details
            </Typography>
            <Typography variant="h2" component="h1" align="center">
                {book.test}
            </Typography>
        </div>
    );
};

export default BookDetails;
