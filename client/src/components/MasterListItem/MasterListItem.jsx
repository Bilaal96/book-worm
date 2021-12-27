/**
 * ---------- List-item types: ----------
 *? list types are required because the components required different props
 ** BookApiListItem
 * 1) renders book data from the Books API (accepts "book" prop)
 * ! only navigates to BookDetails
 ** MasterListItem
 * 2) renders a booklist (i.e. MasterListItem)
 * 2a. adds a book to a booklist
 * 2b. navigates to the booklist, displaying all it's items

 * ----- To make reusable: ----- 
 ** (1) accept single props (title, description, authors [optional], thumbnail [optional])
 * --- Pure func ---
 *! Accepts book object as prop (containing title, desc, authors etc.)
 *? (2) Have BookApiListItem and MasterListItem generate a "book" object that follows a strict format
 *? create a component which accepts the strictly formatted book object as a prop, and displays the expected data in a "standardised" way
 *? The list types outlined above essentially wrap this strict component

 * ---------- Required List Functionalities ----------
 *! For editable list-items, add an editable prop which renders actions (such as delete)
 *! ALSO CREATE A CONFIRMATION DIALOG/MODAL COMPONENT

 *? Items/children rendered by: MasterListItem
 ** MasterList - NOTE:TBD
 *! renders all Booklists via MasterListContext -> fetched from DB
 * Appears in:
    - AddToListModal (in BooksGrid/BookCard & BookDetails)
        * onClick -> add the "target book" to the Booklist clicked
    - ManageLists Page (at ROUTE: /manage-lists)
        * onClick -> navigate to /manage-lists/:listId (SEE BookList BELOW for details of route)
        *! EDITABLE: DELETE LIST
            - Delete from DB & MasterListContext

 *? Items/children rendered by: BookApiListItem
 ** Booklist - NOTE:TBD
 *! onMount: fetch all books using IDs in bookIds array 
 *! renders each book in a single Booklist
 * Appears in: ManageLists Page (at ROUTE: /manage-lists/:listId)
 * List-item rendered by -> BookApiListItem
 * onClick -> navigate to /books/:id, render BookDetails
 *! EDITABLE: DELETE LIST[ITEM] 
    - Delete from bookIds array in -> DB & MasterListContext
 *! EDITABLE (IMPROVEMENT): EDIT CURRENT LISTS DETAILS | ADD TO ANOTHER LIST
 ** Related Books list
 * Appears in: RelatedBooks
 * List-item rendered by -> BookApiListItem
 * onClick -> navigate to /books/:id; renders BookDetails
 */

// Components
import { Grid, Paper, Typography } from "@material-ui/core";

import useStyles from "./styles.js";

const MasterListItem = ({ booklist, handleListItemClick, modal }) => {
    const { id, title, description, bookIds } = booklist;
    const classes = useStyles();
    return (
        <Grid
            onClick={handleListItemClick(id)}
            item
            xs={12}
            md={modal ? 12 : 6}
        >
            <Paper className={classes.masterListItem} elevation={2}>
                {/* Title */}
                <Typography component="h2" variant="h3">
                    {title ? `${title}` : "Unknown Title"}
                </Typography>

                {/* Description */}
                {/* <Typography
                    component="p"
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: description }}
                /> */}
                <Typography component="p" variant="body1">
                    Description: {description}
                </Typography>
                <Typography component="p" variant="body1">
                    bookIds: {bookIds.join(", ")}
                </Typography>
            </Paper>
        </Grid>
    );
};

export default MasterListItem;
