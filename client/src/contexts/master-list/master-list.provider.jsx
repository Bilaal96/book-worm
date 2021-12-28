import { useState } from "react";
import { MasterListContext } from "./master-list.context";

const MasterListProvider = ({ children }) => {
    // ! TEST DATA
    const [masterList, setMasterList] = useState([
        {
            _id: 1,
            title: "Philosophy",
            description: "The biggest test of character in existence is life",
            bookIds: ["2nyKBgAAQBAJ", "suLI7RoaBEEC", "aJgoAwAAQBAJ"],
        },
        {
            _id: 2,
            title: "Web Development",
            description: "All things Web Dev",
            bookIds: ["9OfIDQAAQBAJ", "k0zFcsFA8g8C", "brYgEAAAQBAJ"],
        },
        {
            _id: 3,
            title: "Music and Pop Culture",
            description: "Stay on trend",
            bookIds: [
                "0etNdRiHWBcC",
                "kCoEAAAAMBAJ",
                "QLQ8SAAACAAJ",
                "_rkdEAAAQBAJ",
            ],
        },
    ]);

    return (
        <MasterListContext.Provider value={{ masterList, setMasterList }}>
            {children}
        </MasterListContext.Provider>
    );
};

export default MasterListProvider;
