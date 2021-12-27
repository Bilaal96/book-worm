import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

// Components
import { Grid } from "@material-ui/core";
import MasterListItem from "components/MasterListItem/MasterListItem";

// Context
import { MasterListContext } from "contexts/master-list/master-list.context";

const MasterList = () => {
    const history = useHistory();
    const masterList = useContext(MasterListContext);

    // onMount: check if booklists is cached in localStorage

    // if it is, update MasterList context, and render MasterList with MasterListItems

    // if not booklists are not cached, fetch from DB (make API request)
    // -- then update MastertList context, and render MasterList with MasterListItems
    useEffect(() => {}, []);

    // Navigate to: /manage-lists/:listId
    // Where all items in a single list are displayed
    //! For reusability, could pass this function as a prop to MasterList
    //! i.e. so that MasterListItem in modal can have its own functionality
    const handleListItemClick = (listId) => (e) => {
        history.push(`/manage-lists/${listId}`);
    };

    return (
        <>
            <Grid container spacing={2}>
                {masterList.items
                    .filter((booklist) => {
                        /* TODO */
                        /* If search input has a value, filter list */
                        /* if (input.length) {} */
                        return true;
                    })
                    .map((booklist, index) => (
                        <MasterListItem
                            key={booklist.id}
                            booklist={booklist}
                            handleListItemClick={handleListItemClick}
                        />
                    ))}
            </Grid>
        </>
    );
};

export default MasterList;
