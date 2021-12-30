import { createContext } from "react";

export const MasterListContext = createContext({
    masterList: [],
    setMasterList: () => {},
    clearMasterList: () => {},
});

MasterListContext.displayName = "MasterListContext";
