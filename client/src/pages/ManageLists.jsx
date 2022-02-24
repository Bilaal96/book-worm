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
            <Switch>
                {/* MasterList - List of all user created booklists */}
                {/* path = /manage-lists */}
                <Route exact path={path}>
                    <HeroBanner
                        image={masterListHeroImage}
                        heading="Master List"
                        ctaText="The one-stop for all your booklists"
                    />
                    <WidthContainer padding={{ top: 2.6, bottom: 2.6 }}>
                        <MasterList handleListItemClick={handleListItemClick} />
                    </WidthContainer>
                </Route>

                {/* Booklist - List of all books in a single booklist */}
                {/* path = /manage-lists/:listId */}
                <Route path={`${path}/:listId`}>
                    <HeroBanner
                        image={masterListHeroImage}
                        heading="Book List"
                        ctaText="Your unique collection of books"
                    />
                    <WidthContainer padding={{ top: 2.6, bottom: 2.6 }}>
                        <Booklist />
                    </WidthContainer>
                </Route>
            </Switch>
        </>
    );
};

export default ManageLists;
