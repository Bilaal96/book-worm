import { useLocalStorage } from "hooks/useWebStorage";
import { MasterListContext } from "./master-list.context";

const MasterListProvider = ({ children }) => {
    /**
     * Initialise masterList from localStorage
     * Default to empty array if it does not exist in localStorage
     * Each element in the masterList array represents a single booklist  
     
     * The setMasterList & clearMasterList methods provided keep state
       and localStorage in-sync on updates 
     */
    const [masterList, setMasterList, clearMasterList] = useLocalStorage(
        "master-list",
        []
    );

    // Retrieve a single booklist by ID from masterList
    const getBooklistById = (targetBooklistId) => {
        const targetBooklist = masterList.find(
            (booklist) => booklist._id === targetBooklistId
        );
        if (targetBooklist) return targetBooklist;
        return null;
    };

    return (
        <MasterListContext.Provider
            value={{
                masterList,
                setMasterList,
                clearMasterList,
                getBooklistById,
            }}
        >
            {children}
        </MasterListContext.Provider>
    );
};

export default MasterListProvider;
