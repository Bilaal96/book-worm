import { createContext } from "react";

export const MasterListContext = createContext({
    masterList: [],
    setMasterList: () => {},
    clearMasterList: () => {},
    getBooklistById: () => {},
});

MasterListContext.displayName = "MasterListContext";
