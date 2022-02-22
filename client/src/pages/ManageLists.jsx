import { Switch, Route, useRouteMatch, useHistory } from "react-router";

// Components
import HeroBanner from "components/HeroBanner/HeroBanner";
import WidthContainer from "components/WidthContainer/WidthContainer";
import MasterList from "components/MasterList/MasterList";
import Booklist from "components/Booklist/Booklist";

// Assets
import masterListHeroImage from "assets/master-list-hero-image.jpg";

const ManageLists = () => {
    const { path } = useRouteMatch();
    const history = useHistory();

    const handleListItemClick = (listId) => (e) => {
        // Navigate to: /manage-lists/:listId
        // Where all items in a single list are displayed
        history.push(`/manage-lists/${listId}`);
    };

    return (
        <>
            <HeroBanner
                image={masterListHeroImage}
                heading="Master List"
                ctaText="The one-stop for all your books"
            />

            {/* NOTE: match.path = /manage-lists */}
            <Switch>
                <Route exact path={path}>
                    <WidthContainer padding={{ top: 2.6 }}>
                        {/* List of all user created booklists */}
                        <MasterList handleListItemClick={handleListItemClick} />
                    </WidthContainer>
                </Route>

                <Route path={`${path}/:listId`}>
                    <WidthContainer padding={{ top: 2.6 }}>
                        {/* List of all books in a single booklist */}
                        <Booklist />
                    </WidthContainer>
                </Route>
            </Switch>
        </>
    );
};

export default ManageLists;
