import { useState } from "react";
import PropTypes from "prop-types";

// Components
import { Paper, AppBar, Tabs, Tab, Typography } from "@material-ui/core";
import TabPanel from "components/TabPanel/TabPanel";
import RelatedBooks from "components/RelatedBooks/RelatedBooks";

import useStyles from "./styles";

// IMPORT NEEDED COMPONENTS
// CREATE CHANGE HANDLER
// https://v4.mui.com/components/tabs/#wrapped-labels

// Accessibility props
function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        "aria-controls": `scrollable-auto-tabpanel-${index}`,
    };
}

const BookDetailsTabs = ({ book }) => {
    const { volumeInfo } = book;

    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState("one");

    const handleTabChange = (event, newTab) => {
        setSelectedTab(newTab);
    };

    return (
        <Paper className={classes.cssLayoutContainer} elevation={2}>
            <div className={classes.root}>
                <AppBar position="static">
                    {/* Clickable Tabs */}
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        aria-label="Book details and similar books"
                        variant="scrollable"
                        scrollButtons="on"
                    >
                        <Tab
                            value="one"
                            label="Description"
                            wrapped
                            {...a11yProps("one")}
                        />
                        <Tab
                            value="two"
                            label="More By Author"
                            wrapped
                            {...a11yProps("two")}
                        />
                        <Tab
                            value="three"
                            label="More In Category"
                            wrapped
                            {...a11yProps("three")}
                        />
                    </Tabs>
                </AppBar>

                {/** TabPanel props
                 * selectedTab is compared to index prop
                 * if equal, the Tab renders
                 * if not equal, tab remains hidden (not rendered)
                 */}
                {/* One - Description */}
                <TabPanel value={selectedTab} index="one">
                    <Typography variant="body1">
                        {volumeInfo.description
                            ? volumeInfo.description
                            : "No description available"}
                    </Typography>
                </TabPanel>

                {/* Two - Books By Author */}
                <TabPanel value={selectedTab} index="two">
                    <RelatedBooks relatedBy="author" book={book} />
                </TabPanel>

                {/* Three - Books By Category */}
                <TabPanel value={selectedTab} index="three">
                    <RelatedBooks relatedBy="category" book={book} />
                </TabPanel>
            </div>
        </Paper>
    );
};

BookDetailsTabs.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookDetailsTabs;
