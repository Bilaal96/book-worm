import { Public, ListAlt, LockOpen, Edit } from "@material-ui/icons";

// Select API URL based on environment variables
export const BOOK_WORM_API_URI =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_PROD_API_URI
        : process.env.REACT_APP_DEV_API_URI;
console.log({ BOOK_WORM_API_URI });

/** Pagination
 * Max number of books to request from Google Books API
 * NOTE: API is limited to max of 40
 */
export const MAX_RESULTS_PER_PAGE = 20;

// Highest possible number of pages to show in pagination
export const MAX_PAGE_LIMIT = 10;

/** Navigation Maps
 * Properties of a NAV_MAP map to the component rendered as the navigation link in NavTop / NavDrawer
 
 * NavDrawer -> navigation link rendered as MUI ListItem 
 * NavTop -> navigation link rendered as MUI Button  
 */
// Links that are ALWAYS rendered
export const NAV_MAP_BASE = [
    {
        // routeName: must be /books to get activeClassName styles
        // SEE: https://stackoverflow.com/questions/39189640/react-router-index-route-always-active
        routeName: "/books",
        isExact: true,
        text: "Discover",
        icon: <Public />,
    },
    {
        routeName: "/manage-lists",
        isExact: false,
        text: "Manage Lists",
        icon: <ListAlt />,
    },
];

// Links that are only rendered when user is NOT logged in
export const NAV_MAP_AUTH = [
    {
        routeName: "/login",
        isExact: false,
        text: "Log In",
        icon: <LockOpen />,
    },
    {
        routeName: "/signup",
        isExact: false,
        text: "Sign Up",
        icon: <Edit />,
    },
];

// All Links to render when user is not logged in
export const NAV_MAP_GUEST = NAV_MAP_BASE.concat(NAV_MAP_AUTH);
