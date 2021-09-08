import { Switch, Route } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";

// Pages
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";
import ReadingList from "./pages/ReadingList";

// Components
import Header from "./components/Header/Header.jsx";

import useStyles from "./styles";

function App() {
    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Header />

            {/* Routes */}
            <Container maxWidth="lg" className={classes.container}>
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
