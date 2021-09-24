// Components
import { Switch, Route, Redirect } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";
import Header from "components/Header/Header.jsx";

// Pages
import Home from "pages/Home";
import Favourites from "pages/Favourites";
import ReadingList from "pages/ReadingList";

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

                    <Route path="/favourites">
                        <Favourites />
                    </Route>
                    <Route path="/reading-list">
                        <ReadingList />
                    </Route>
                </Switch>
            </Container>

            {/* TODO Footer */}
        </>
    );
}

export default App;
