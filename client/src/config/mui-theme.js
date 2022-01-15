import { createTheme } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";

const theme = createTheme({
    palette: {
        primary: {
            light: teal[500],
            main: teal[600],
            dark: teal[800],
        },
        secondary: {
            // https://www.rapidtables.com/web/color/purple-color.html
            main: "#8B008B",
        },
    },
});

export default theme;
