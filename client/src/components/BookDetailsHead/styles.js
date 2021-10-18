import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    // Container
    cssLayoutContainer: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
        // gridTemplateColumns: "1fr",
        // gridTemplateAreas: `
        //     'actions'
        //     'image'
        //     'info'
        // `,

        [theme.breakpoints.up("sm")]: {
            flexDirection: "row",
            gap: "10px",
            // gridTemplateAreas: `
            //     'actions image . . .'
            //     'info info info info info'
            // `,
        },
    },

    // Grid Items
    // -- Buttons
    bookActions: {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        justifyContent: "center",
        gridArea: "actions",
        order: 2,
        backgroundColor: "#e8d2f0",

        [theme.breakpoints.up("sm")]: {
            flexDirection: "column",
            width: "48px",
            gap: "10px",
            justifyContent: "normal",
            order: 1,
        },
    },
    iconButtons: {
        borderRadius: "4px",
    },
    googlePlayIcon: {
        width: "20px",
        height: "20px",
        /**
         * MUI icons are 24x24 by default, so we add:
         * 2px margin-top and bottom - to compensate for smaller size
         * 4px margin-left to center icon
         */
        margin: "2px 0 2px 4px",
    },

    // -- Image
    bookCover: {
        margin: "20px auto",
        backgroundImage: ({ bookThumbnail }) => `url(${bookThumbnail})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        minWidth: "200px",
        gridArea: "image",
        order: 1,

        [theme.breakpoints.up("sm")]: {
            margin: "0",
            order: 2,
            // paddingTop: "75%",
        },
    },

    // -- Info
    bookInfo: {
        gridArea: "info",
        order: 3,
    },
}));
