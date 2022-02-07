import { Switch, Route, useRouteMatch, useHistory } from "react-router";

// Components
import { Typography } from "@material-ui/core";
import MasterList from "components/MasterList/MasterList";
import Booklist from "components/Booklist/Booklist";

import useStyles from "./styles";

const ManageLists = () => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const classes = useStyles();

    const handleListItemClick = (listId) => (e) => {
        // Navigate to: /manage-lists/:listId
        // Where all items in a single list are displayed
        history.push(`/manage-lists/${listId}`);
    };

    return (
        <>
            <Switch>
                {/* match.path = /manage-lists */}
                <Route exact path={path}>
                    <Typography
                        variant="h4"
                        component="h1"
                        className={classes.pageHeading}
                    >
                        Manage Lists
                    </Typography>
                    <MasterList handleListItemClick={handleListItemClick} />
                </Route>
                <Route path={`${path}/:listId`}>
                    <Booklist />
                </Route>
            </Switch>
        </>
    );
};

export default ManageLists;
