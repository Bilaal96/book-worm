import { useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useAsyncEffect from "hooks/useAsyncEffect";

// Components
import { Grid } from "@material-ui/core";
import MasterListItem from "components/MasterListItem/MasterListItem";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// onMount: check if booklists is cached in localStorage

// if it is, update MasterList context, and render MasterList with MasterListItems

// if not booklists are not cached, fetch from DB (make API request)
// -- then update MastertList context, and render MasterList with MasterListItems
const MasterList = () => {
    const history = useHistory();
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

    useEffect(() => {
        if (booklists.value !== null) {
            // Update & log MasterList with fetched data
            console.log("MASTER LIST (FETCHED)", masterList);
            setMasterList(booklists.value);
        } else {
            // Log when read from localStorage
            console.log("MASTER LIST (FROM CACHE)", masterList);
        }
    }, [booklists.value, masterList, setMasterList]);

    // Navigate to: /manage-lists/:listId
    // Where all items in a single list are displayed
    //! For reusability, could pass this function as a prop to MasterList
    //! i.e. so that MasterListItem in modal can have its own functionality
    const handleListItemClick = (listId) => (e) => {
        history.push(`/manage-lists/${listId}`);
    };

    if (booklists.loading) return <h1>LOADING...</h1>;

    return (
        <>
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
                            handleListItemClick={handleListItemClick}
                        />
                    ))}
            </Grid>
        </>
    );
};

export default MasterList;
