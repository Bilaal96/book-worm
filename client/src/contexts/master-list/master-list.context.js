import { createContext } from "react";

export const MasterListContext = createContext({
    items: [], // fetched from db
});

MasterListContext.displayName = "MasterListContext";
