/**
 * ---------- List-item types: ----------
 *? list types are required because the components required different props
 ** BookApiListItem
 * 1) renders book data from the Books API (accepts "book" prop)
 * ! only navigates to BookDetails
 ** MasterListItem
 * 2) renders a booklist (i.e. MasterListItem)
 * 2a. adds a book to a booklist
 * 2b. navigates to the booklist, displaying all its items

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
 *! onMount: render all books in a list via masterList
 * Appears in: ManageLists Page (at ROUTE: /manage-lists/:listId)
 * List-item rendered by -> BookApiListItem
 * onClick -> navigate to /books/:id, render BookDetails
 *! EDITABLE: DELETE LIST[ITEM] 
    - Delete from books array in -> DB & MasterListContext
 *! EDITABLE (IMPROVEMENT): EDIT CURRENT LISTS DETAILS | ADD TO ANOTHER LIST
 ** Related Books list
 * Appears in: RelatedBooks
 * List-item rendered by -> BookApiListItem
 * onClick -> navigate to /books/:id; renders BookDetails
 */

import { useState, useContext } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context.js";
import { MasterListContext } from "contexts/master-list/master-list.context.js";

// Components
import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal";

import useStyles from "./styles.js";

const MasterListItem = ({
    booklist,
    onListItemClick: handleListItemClick,
    modal,
}) => {
    const { accessToken, user } = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);

    const { _id, title, description, books, userId: booklistOwner } = booklist;
    const styleProps = { modal };
    const classes = useStyles(styleProps);

    const [openModal, setOpenModal] = useState(false);

    const deleteBooklist = async () => {
        try {
            // Prevent user from requesting deletion of a list they do not own
            if (user.id !== booklistOwner) throw Error("Unauthorized request");

            // User owns booklist, send request to delete it
            const response = await fetch(
                `http://localhost:5000/booklists/${_id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            // Request to delete booklist failed
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            // Request to delete booklist succeeded
            // Update masterList by filtering out the deleted booklist
            const updatedMasterList = masterList.filter(
                (list) => list._id !== _id
            );

            setMasterList(updatedMasterList); // causes MasterList to re-render
            console.log(`Delete booklist with id: ${_id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <ConfirmActionModal
                title="Delete Booklist"
                openModal={openModal}
                setOpenModal={setOpenModal}
                buttons={{
                    positive: { text: "Yes", action: deleteBooklist },
                    negative: { text: "No" },
                }}
            >
                <Typography
                    style={{ fontSize: "18px", padding: "14px 28px" }}
                    variant="body1"
                >
                    Are you sure you want to permanently delete this booklist
                    and all of its content?
                </Typography>
            </ConfirmActionModal>

            <Grid item xs={12}>
                <Paper className={classes.masterListItem} elevation={2}>
                    {/* Booklist Details & Actions Container */}
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        {/* Booklist Details */}
                        <Grid
                            item
                            xs={modal ? 12 : 11}
                            className={classes.details}
                            onClick={handleListItemClick(_id)}
                        >
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
                                Id of books stored:{" "}
                                {books.map((book) => book.id).join(", ")}
                            </Typography>
                        </Grid>

                        {/* Booklist Actions (ManageLists page only) */}
                        {modal ? null : (
                            <Grid item xs={1}>
                                <Grid container justifyContent="center">
                                    <IconButton
                                        className={classes.deleteButton}
                                        onClick={() => setOpenModal(true)}
                                    >
                                        <Delete fontSize="large" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </>
    );
};

export default MasterListItem;
