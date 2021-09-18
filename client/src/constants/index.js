import { Home, Favorite, MenuBook } from "@material-ui/icons";

// Map for Navigation Items
// -- used in NavTop & NavDrawer
export const NAV_ITEMS_MAP = [
    { icon: <Home />, text: "Home", route: "/" },
    { icon: <Favorite />, text: "Favourites", route: "/favourites" },
    { icon: <MenuBook />, text: "Reading List", route: "/reading-list" },
];

// Max number of books to request from Google Books API
export const MAX_SEARCH_RESULTS = 20; // NOTE: limited to max of 40
