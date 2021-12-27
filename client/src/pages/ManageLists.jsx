import { Switch, Route, useRouteMatch } from "react-router";

// Components
import { Typography } from "@material-ui/core";
import MasterList from "components/MasterList/MasterList";
import Booklist from "components/Booklist/Booklist";

import useStyles from "./styles";

const ManageLists = () => {
    const { path } = useRouteMatch();
    console.log("ManageLists", path);
    const classes = useStyles();

    return (
        <>
            <Typography
                variant="h4"
                component="h1"
                className={classes.pageHeading}
            >
                Manage Lists
            </Typography>

            {/* match.path = /manage-lists */}
            <Switch>
                <Route exact path={path}>
                    <MasterList />
                </Route>
                <Route path={`${path}/:listId`}>
                    <Booklist />
                </Route>
            </Switch>
        </>
    );
};

export default ManageLists;
