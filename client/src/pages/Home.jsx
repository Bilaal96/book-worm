import { Route, useRouteMatch } from "react-router";

// Provider
import { SearchProvider } from "contexts/search/search.provider";

// Components
import BooksSearch from "components/BooksSearch/BooksSearch";
import BookDetails from "../components/BookDetails/BookDetails";

const Home = () => {
    const { path } = useRouteMatch();

    return (
        <>
            <SearchProvider>
                {/* match.path = /books */}
                <Route exact path={`${path}`}>
                    <BooksSearch />
                </Route>
                <Route path={`${path}/:bookId`}>
                    <BookDetails />
                </Route>
            </SearchProvider>
        </>
    );
};

export default Home;
