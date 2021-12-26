import { useState } from "react";
import { MasterListContext } from "./master-list.context";

const MasterListProvider = ({ children }) => {
    // ! TEST DATA
    const [items, setItems] = useState([
        {
            title: "Philosophy",
            description: "The biggest test of character in existence is life",
            bookIds: [1, 2, 3, 4, 5],
        },
        {
            title: "Web Development",
            description: "All things Web Dev",
            bookIds: [6, 7, 8, 9],
        },
        {
            title: "Music and Pop Culture",
            description: "Stay on trend",
            bookIds: [1, 4, 9, 10],
        },
    ]);

    return (
        <MasterListContext.Provider value={{ items, setItems }}>
            {children}
        </MasterListContext.Provider>
    );
};

export default MasterListProvider;
