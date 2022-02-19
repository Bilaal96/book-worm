import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    pageContainer: {
        position: "relative",
        display: "flex",
        flexDirection: "column",

        // Offset container from Header with margin-top
        margin: `${theme.header.height} 0 0 0`,
        // Take up remaining viewport height
        minHeight: `calc(100vh - ${theme.header.height})`,
        padding: 0,
    },
}));

// Flex container that offsets page content from Header
// Offset is required because Header has fixed position
const PageContainer = ({ children }) => {
    const classes = useStyles();

    return <main className={classes.pageContainer}>{children}</main>;
};

PageContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageContainer;
