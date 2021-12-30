import { useLocalStorage } from "hooks/useWebStorage";
import { MasterListContext } from "./master-list.context";

const MasterListProvider = ({ children }) => {
    // Initialise masterList from localStorage
    // Default to empty array if it does not exist in localStorage
    // The methods provided keep state and localStorage in-sync on updates
    const [masterList, setMasterList, clearMasterList] = useLocalStorage(
        "master-list",
        []
    );

    return (
        <MasterListContext.Provider
            value={{
                masterList,
                setMasterList,
                clearMasterList,
            }}
        >
            {children}
        </MasterListContext.Provider>
    );
};

export default MasterListProvider;
