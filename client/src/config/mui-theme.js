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
});

// https://v4.mui.com/customization/typography/#responsive-font-sizes
theme = responsiveFontSizes(theme);

export default theme;
