import {
    Home,
    MenuBook,
    LockOpen,
    PowerSettingsNew,
    Edit,
} from "@material-ui/icons";

// Map for Navigation Items
// -- used in NavTop & NavDrawer
// -- NOTE: for isExact prop: https://stackoverflow.com/questions/39189640/react-router-index-route-always-active
export const EXPERIMENTAL_NAV_ITEMS_MAP = {
    // Not affected by user state - always rendered
    base: [
        {
            routeName: "/books",
            isExact: true,
            text: "Home",
            icon: <Home />,
        },
        {
            routeName: "/manage-lists",
            isExact: false,
            text: "Manage Lists",
            icon: <MenuBook />,
        },
    ],
    // Rendered if no user (i.e. logged out)
    noUser: [
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
    ],
    // Rendered if user exists (i.e. logged in)
    user: [
        {
            routeName: "/logout",
            isExact: false,
            text: "Log Out",
            icon: <PowerSettingsNew />,
        },
    ],
};

export const NAV_ITEMS_MAP = [
    {
        routeName: "/books",
        isExact: true,
        text: "Home",
        icon: <Home />,
    },
    {
        routeName: "/manage-lists",
        isExact: false,
        text: "Manage Lists",
        icon: <MenuBook />,
    },
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
        // icon: <ArrowUpward />,
        icon: <Edit />,
    },
    {
        routeName: "/", // temporary - simulate logout
        isExact: true, // temporary - simulate logout
        text: "Log Out",
        // icon: <Lock />,
        icon: <PowerSettingsNew />,
    },
];

// Max number of books to request from Google Books API
export const MAX_RESULTS_PER_PAGE = 20; // NOTE: API is limited to max of 40

// Highest possible number of pages to show in pagination
export const MAX_PAGE_LIMIT = 10;
