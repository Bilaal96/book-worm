import { Home, Favorite, MenuBook } from "@material-ui/icons";

// Map for Navigation Items
// -- used in NavTop & NavDrawer
// -- NOTE: for isExact prop: https://stackoverflow.com/questions/39189640/react-router-index-route-always-active
export const NAV_ITEMS_MAP = [
    {
        routeName: "/books",
        isExact: true,
        text: "Home",
        icon: <Home />,
    },
    {
        routeName: "/favourites",
        isExact: false,
        text: "Favourites",
        icon: <Favorite />,
    },
    {
        routeName: "/reading-list",
        isExact: false,
        text: "Reading List",
        icon: <MenuBook />,
    },
];

// Max number of books to request from Google Books API
export const MAX_RESULTS_PER_PAGE = 20; // NOTE: API is limited to max of 40

// Highest possible number of pages to show in pagination
export const MAX_PAGE_LIMIT = 10;
