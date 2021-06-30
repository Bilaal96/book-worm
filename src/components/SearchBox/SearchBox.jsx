import React from 'react';

import { InputBase } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

import useStyles from './styles';

const SearchBox = () => {
  const classes = useStyles();

  return (
    <div className={classes.searchBox}>
      <SearchIcon className={classes.searchIcon} />

      <InputBase className={classes.searchInput} placeholder="Search..." />
    </div>
  );
};

export default SearchBox;
