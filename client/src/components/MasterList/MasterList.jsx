import { useEffect, useContext, useCallback } from "react";
import useAsyncEffect from "hooks/useAsyncEffect";

// Components
import CreateBooklistAccordion from "components/CreateBooklistAccordion/CreateBooklistAccordion";
import ContentSpinner from "components/ContentSpinner/ContentSpinner";
import { Grid } from "@material-ui/core";
import MasterListItem from "components/MasterListItem/MasterListItem";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// onMount: check if booklists is cached in localStorage

// if it is, update MasterList context, and render MasterList with MasterListItems

// if not booklists are not cached, fetch from DB (make API request)
// -- then update MasterList context, and render MasterList with MasterListItems

/**
 *! LIST ITEM -> Flex -> has ACTIONS -> which are only rendered if prop is passed -> e.g. MasterListItem actions={{delete:true, add:true}} -> if not passed fallback to a default value for actions property
 *! also use "modal" prop to give custom styles to MasterList and MasterListItem that are rendered in AddToBooklistModal
  
 * To style modal and /manage-lists differently
 *! pass modal prop to MasterList
 *! In MasterList, pass modal prop as arg. to useStyles hook
 *! this allows me to access modal in a function within makeStyles object
 *! I can use this prop to conditionally render styles
 ** NO MODAL (/manage-lists)
 ** include delete button next to each MasterListItem
 ** On small screens: MasterListItem takes up entire row width
 ** On big screens: MasterListItem takes up HALF row width
 ** MasterList SearchBar will be
 *? WITH MODAL
 *? MasterListItem takes up entire row width
 *? Hide Delete button -> modal is only used to create and add to booklists
 *! BOTH:
 *! MASTER LIST SEARCH BAR (FILTERS LIST)
 *! "CREATE NEW BOOKLIST" BUTTON -> Opens Dialog/PopupModal asking for title and description (optional) -> options cancel/create -> makes request to endpoint: POST /booklists
 */
const MasterList = ({ handleListItemClick, modal }) => {
    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);

    /** fetchAllBooklists
     * Passed as argument to useAsyncEffect below 
     * Fetch current user's booklists from database 
        - On component mount
        - When new accessToken is received (due to refresh request) 
     */
    const fetchAllBooklists = useCallback(async () => {
        // Only attempt request if accessToken is present
        if (!accessToken) throw Error("Unauthorized user");

        // Do not fetch if masterList already exists
        if (masterList?.length) return null;

        // Attempt data fetch
        try {
            const response = await fetch("http://localhost:5000/booklists", {
                headers: { Authorization: `Bearer ${accessToken}` },
                credentials: "include",
            });

            if (!response.ok)
                throw Error(`Error: ${response.status} ${response.statusText}`);

            const booklists = await response.json();
            return booklists;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }, [accessToken, masterList]);

    // Track state during and after data fetch
    const booklists = useAsyncEffect(fetchAllBooklists);

    // Update MasterList with fetched data
    useEffect(() => {
        if (booklists.value !== null) setMasterList(booklists.value);
    }, [booklists.value, setMasterList]);

    // Log masterList value; when fetched from DB or loaded from localStorage
    useEffect(() => {
        if (booklists.value !== null) {
            console.log("MASTER LIST (FETCHED)", masterList);
        } else {
            console.log("MASTER LIST (DEFAULT / FROM CACHE)", masterList);
        }
    }, [booklists.value, masterList]);

    if (booklists.loading)
        return (
            <ContentSpinner
                text="Loading your lists"
                open={true}
                size={60}
                position={modal ? "static" : "absolute"}
                rounded
            />
        );

    return (
        <>
            {/* TODO Search / filter lists */}

            {/* Accordion containing form to create new list */}
            <CreateBooklistAccordion />

            <Grid container spacing={2}>
                {masterList
                    .filter((booklist) => {
                        /* TODO */
                        /* If search input has a value, filter list */
                        /* if (input.length) {} */
                        return true;
                    })
                    .map((booklist, index) => (
                        <MasterListItem
                            key={booklist._id}
                            booklist={booklist}
                            onListItemClick={handleListItemClick}
                            modal={modal}
                        />
                    ))}
            </Grid>
        </>
    );
};

export default MasterList;
