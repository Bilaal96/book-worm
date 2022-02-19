// Components
import { Switch, Route, Redirect } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Header from "components/Header/Header.jsx";
import PageContainer from "components/PageContainer/PageContainer";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute.jsx";

// Pages
import Home from "pages/Home";
import ManageLists from "pages/ManageLists";
import SignUp from "pages/SignUp";
import Login from "pages/Login";

function App() {
    return (
        <>
            <CssBaseline />
            <Header />

            {/* Flex container that offsets page content from Header */}
            <PageContainer>
                {/* Routes */}
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

                    {/** ProtectedRoute with isLoggedIn prop
                      - prevent access to routes when user is logged in
                      */}
                    <ProtectedRoute path="/login" isLoggedIn>
                        <Login />
                    </ProtectedRoute>

                    <ProtectedRoute path="/signup" isLoggedIn>
                        <SignUp />
                    </ProtectedRoute>

                    <Route>
                        <h1>404 | NOT FOUND</h1>
                    </Route>
                </Switch>
            </PageContainer>

            {/* TODO Footer */}
        </>
    );
}

export default App;
