import { useHistory } from "react-router-dom";

const MasterList = () => {
    const history = useHistory();

    return (
        <div>
            Master List
            <button onClick={() => history.push("/manage-lists/123")}>
                To Booklist /123
            </button>
        </div>
    );
};

export default MasterList;
