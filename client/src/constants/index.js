import { Home, Favorite, MenuBook } from "@material-ui/icons";

// Map for Navigation Items
// -- used in NavTop & NavDrawer
export const NAV_ITEMS_MAP = [
    { icon: <Home />, text: "Home", route: "/" },
    { icon: <Favorite />, text: "Favourites", route: "/favourites" },
    { icon: <MenuBook />, text: "Reading List", route: "/reading-list" },
];

// Max number of books to request from Google Books API
export const MAX_RESULTS_PER_PAGE = 20; // NOTE: API is limited to max of 40

// Highest possible number of pages to show in pagination
export const MAX_PAGE_LIMIT = 10;
