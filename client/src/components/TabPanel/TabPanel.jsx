import PropTypes from "prop-types";

import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    tabContent: {
        backgroundColor: theme.palette.background.default,
    },
}));

// The box/panel in which the data for a specific tab is shown
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className={classes.tabContent} p={2}>
                    {children}
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default TabPanel;
