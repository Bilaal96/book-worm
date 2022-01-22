import { Route, useRouteMatch } from "react-router";

// Provider
import { SearchProvider } from "contexts/search/search.provider";
import MasterListProvider from "contexts/master-list/master-list.provider";

// Components
import BooksSearch from "components/BooksSearch/BooksSearch";
import BookDetails from "pages/BookDetails";

const Home = () => {
    const { path } = useRouteMatch();

    return (
        <>
            <SearchProvider>
                <MasterListProvider>
                    {/* match.path = /books */}
                    <Route exact path={`${path}`}>
                        <BooksSearch />
                    </Route>
                    <Route path={`${path}/:bookId`}>
                        <BookDetails />
                    </Route>
                </MasterListProvider>
            </SearchProvider>
        </>
    );
};

export default Home;
