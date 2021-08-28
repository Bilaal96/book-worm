import { Typography } from "@material-ui/core";

import SearchBox from "components/SearchBox/SearchBox";

import useStyles from "./styles";

const Home = () => {
    const classes = useStyles();

    return (
        <main>
            <Typography
                variant="h4"
                component="h1"
                className={classes.pageHeading}
            >
                Home
            </Typography>
            {/* Search Box */}
            <SearchBox />

            {/* Grid of Books
             * Mobile: 1 per row
             * desktop: 3-4 per row
             */}
        </main>
    );
};

export default Home;
