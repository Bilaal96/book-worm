import { createTheme, responsiveFontSizes } from "@material-ui/core";

/**
 *? PREVIOUS PALETTE - for reference
 * teal[500]
 * teal[600] - import teal from "@material-ui/core/colors/teal
 * teal[800]
 * #8B008B - https://www.rapidtables.com/web/color/purple-color.html
 
 * Old colours from BookCard & BookDetails 
 * #e8d2f0 (BookCard: actionsOne; BookDetailsHead: bookActions)
 * #faf4fc (BookCard - header)
 
 *? POTENTIAL COLOURS
 * #E5DDC8 - Sand dollar
 * #C4DBE0 - Serenity
 * #c3d4d8 - Serenity Grey
 * #01949A - Teal
 * #1b9090 - Teal variant
 * #004369 - Navy Blue
 * #DB1F48 - Red Saturated
 * #C85250 - Red Tamed
 * #F7BEC0 - Rose Quartz
 * #F9F1F0 - Cream
 * #fedfd5 - Cream compliment

 ** CURRENT PALETTE
 * https://v4.mui.com/customization/color/#picking-colors
 * https://www.canva.com/colors/color-palettes/facing-forward/
 * https://www.canva.com/colors/color-palettes/cool-cream-strawberry/
 * https://www.canva.com/colors/color-palettes/in-the-blue/
 */

let theme = createTheme({
    header: {
        height: "64px",
    },
    heroBanner: {
        height: {
            min: {
                smDown: "20vh",
                smUp: "25vh",
                md: "30vh",
            },
        },
    },
    palette: {
        primary: {
            main: "#01949A",
        },
        secondary: {
            light: "#F7BEC0",
            main: "#C85250",
        },
        background: {
            default: "#c3d4d8",
            contrastText: "#ffffff",
        },
        accent: {
            // Accents to contrast default backgrounds
            light: "#F9F1F0", // hover color
            main: "#fedfd5",
        },
        error: {
            light: "#F1CED4",
            main: "#AA1945",
        },
        common: {
            subtleWhite: "#F3F3F3",
        },
    },
    zIndex: {
        fixedSpinner: 1150,
    },
    overrides: {
        /** Override MUI background:
         * https://stackoverflow.com/questions/55576512/setting-a-body-background-image-in-muithemeprovider
         * https://codesandbox.io/s/v30yq681ql?file=/src/withRoot.js
         */
        MuiCssBaseline: {
            "@global": {
                body: {
                    backgroundColor: "#c3d4d8", // fallback bg-color

                    /** SVG Gradient Colors:
                     * White: #F3F3F3
                     * Light Teal: #5BA1A3
                     * Background by: https://SVGBackgrounds.com
                     */
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(0,960,468)'%3E%3Cstop offset='0' stop-color='%23F3F3F3'/%3E%3Cstop offset='1' stop-color='%235BA1A3'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='452' height='376.7' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E\")",
                    backgroundAttachment: "fixed",
                    backgroundSize: "cover",
                },
            },
        },
        MuiTooltip: {
            tooltip: {
                fontSize: "0.8rem",
            },
        },
    },
});

// https://v4.mui.com/customization/typography/#responsive-font-sizes
theme = responsiveFontSizes(theme);

export default theme;
