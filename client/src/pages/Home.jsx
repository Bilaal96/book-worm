import { Route, useRouteMatch } from "react-router";
import BooksSearch from "components/BooksSearch/BooksSearch";
import BookDetails from "../components/BookDetails/BookDetails";

const Home = () => {
    const { path } = useRouteMatch();

    return (
        <>
            {/* match.path = /books */}
            <Route exact path={`${path}`}>
                <BooksSearch />
            </Route>
            <Route path={`${path}/:bookId`}>
                <BookDetails book={{ test: "route matched" }} />
            </Route>
        </>
    );
};

export default Home;
