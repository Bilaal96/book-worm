// Components
import { Switch, Route } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";
import Header from "components/Header/Header.jsx";

// Pages
import Home from "pages/Home/Home";
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
                    <Route path="/favourites">
                        <Favourites />
                    </Route>
                    <Route path="/reading-list">
                        <ReadingList />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Container>

            {/* TODO Footer */}
        </>
    );
}

export default App;
