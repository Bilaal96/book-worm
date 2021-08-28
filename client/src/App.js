import { useState, useEffect } from "react";

import { Switch, Route } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";

// Pages
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";
import ReadingList from "./pages/ReadingList";

// Components
import Header from "./components/Header/Header.jsx";

import useStyles from "./styles";

/** Google Books 4 Main Concepts
 * https://developers.google.com/books/docs/v1/getting_started?authuser=1#background
 
 * Volumes -> data on a book or magazine
 * Bookshelf -> collection of Volumes
    -> comes with built-in bookshelves - some filled by user, some with AI suggestions
    -> on Google Books site (only) users can:
        - manually CRUD their own bookshelves
        - make a bookshelf private or public
 * Review - star rating & text - user can submit one per volume
 * Reading Position - last read position in a Volume for a user
    -> one per Volume
    -> does not exist until a user opens a Volume
    -> can store detailed position info (private to user) - down to the resolution of a word
 */
function App() {
    const classes = useStyles();
    // Move to context later, so I can access throughout app & don't have to drill props
    // https://reactjs.org/docs/context.html
    // https://www.youtube.com/watch?v=5LrDIWkK_Bc
    const [books, setBooks] = useState([]);

    // Fetch from Google Books API & set books to local state
    // https://developers.google.com/books/docs/v1/reference?authuser=1
    // -- requires app auth
    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await fetch("http://localhost:5000/test");
                const data = response.json();
                console.log({ data });
                return data;
            } catch (err) {
                console.error("fetchBooks ERROR: ", err);
            }
        }

        const fetchedBooks = fetchBooks();
        // setBooks(fetchedBooks);
    }, []);

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

            {/* Footer */}
        </>
    );
}

export default App;
