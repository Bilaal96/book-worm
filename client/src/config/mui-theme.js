import { createMuiTheme } from "@material-ui/core";
import teal from "@material-ui/core/colors/teal";

const theme = createMuiTheme({
    palette: {
        primary: teal,
        secondary: {
            // https://www.rapidtables.com/web/color/purple-color.html
            main: "#8B008B",
        },
    },
});

export default theme;
