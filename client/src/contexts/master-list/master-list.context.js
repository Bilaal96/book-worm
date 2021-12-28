import { createContext } from "react";

export const MasterListContext = createContext({
    masterList: [], // fetched from db
    setMasterList: () => {},
});

MasterListContext.displayName = "MasterListContext";
