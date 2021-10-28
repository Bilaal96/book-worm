// Components
import { Switch, Route, Redirect } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";
import Header from "components/Header/Header.jsx";

// Pages
import Home from "pages/Home";
import ManageLists from "pages/ManageLists";
import SignUp from "pages/SignUp";
import Login from "pages/Login";

import useStyles from "./styles";

function App() {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Header />

            {/* Routes */}
            <Container
                maxWidth="lg"
                className={classes.pageContainer}
                component="main"
            >
                <Switch>
                    {/* Home */}
                    {/* Redirect root path to /books */}
                    <Route exact path="/">
                        <Redirect to="/books" />
                    </Route>
                    <Route path="/books">
                        <Home />
                    </Route>
                    {/* Protected Route 
                        - only available to logged in users 
                        - if no user, redirect to login */}
                    <Route path="/manage-lists">
                        <ManageLists />
                    </Route>

                    {/* Conditionally Rendered
                        - if user, render Logout
                        - if no user, render Login & SignUp  */}
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/signup">
                        <SignUp />
                    </Route>
                </Switch>
            </Container>

            {/* TODO Footer */}
        </>
    );
}

export default App;
