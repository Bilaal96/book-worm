import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import { Paper, AppBar, Tabs, Tab, Typography } from '@material-ui/core';
import TabPanel from 'components/TabPanel/TabPanel';
import RelatedBooksByAuthor from 'components/RelatedBooksByAuthor/RelatedBooksByAuthor';
import RelatedBooksByCategory from 'components/RelatedBooksByCategory/RelatedBooksByCategory';

import useStyles from './styles';

// Constants
/**
 * Create an object that maps to the index of an MUI Tab component
    -> e.g. { 1: 1, 2: 2, 3: 3 }
    -> TABS_MAP[1] = 1, TABS_MAP[2] = 2 etc 
  
 * Appropriately adjust NUM_OF_TABS to increase/decrease the number of tab indexes generated 
 */
const NUM_OF_TABS = 3;
const TABS_MAP = Array.from({ length: NUM_OF_TABS }, (_, i) => i + 1).reduce(
  (acc, curr) => ({ ...acc, [curr]: curr }),
  {}
);

// Accessibility props
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const BookDetailsTabs = ({ book }) => {
  const location = useLocation();
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(TABS_MAP[1]);

  // Reset selected tab on path change
  useEffect(() => {
    setSelectedTab(TABS_MAP[1]);
  }, [location.pathname]);

  // Passed to MUI Tabs component
  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  return (
    <Paper className={classes.paper} elevation={2}>
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
            value={TABS_MAP[1]}
            label="Description"
            wrapped
            {...a11yProps(TABS_MAP[1])}
          />
          <Tab
            value={TABS_MAP[2]}
            label="More By Author"
            wrapped
            {...a11yProps(TABS_MAP[2])}
          />
          <Tab
            value={TABS_MAP[3]}
            label="More In Category"
            wrapped
            {...a11yProps(TABS_MAP[3])}
          />
        </Tabs>
      </AppBar>

      {/** TabPanel props
       * selectedTab is compared to index prop
       * if equal, the Tab renders; otherwise Tab does not render
       */}
      {/* One - Description */}
      <TabPanel value={selectedTab} index={TABS_MAP[1]}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: book.volumeInfo?.description
              ? book.volumeInfo.description
              : 'No description available',
          }}
        />
      </TabPanel>

      {/* Two - Books By Author */}
      <TabPanel value={selectedTab} index={TABS_MAP[2]}>
        {/* <RelatedBooks relatedBy="author" book={book} /> */}
        <RelatedBooksByAuthor mutualBook={book} />
      </TabPanel>

      {/* Three - Books By Category */}
      <TabPanel value={selectedTab} index={TABS_MAP[3]}>
        <RelatedBooksByCategory mutualBook={book} />
      </TabPanel>
    </Paper>
  );
};

BookDetailsTabs.propTypes = {
  book: PropTypes.object.isRequired,
};

export default BookDetailsTabs;
