// Components
import { Switch, Route, Redirect } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";
import Header from "components/Header/Header.jsx";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute.jsx";

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
                    {/* Redirect root path to /books */}
                    <Route exact path="/">
                        <Redirect to="/books" />
                    </Route>
                    <Route path="/books">
                        <Home />
                    </Route>

                    {/** Protected Route 
                      - only available to logged in users 
                      - if no user, redirect to login 
                      */}
                    <ProtectedRoute path="/manage-lists">
                        <ManageLists />
                    </ProtectedRoute>

                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/signup">
                        <SignUp />
                    </Route>

                    <Route>
                        <h1>404 | NOT FOUND</h1>
                    </Route>
                </Switch>
            </Container>

            {/* TODO Footer */}
        </>
    );
}

export default App;
