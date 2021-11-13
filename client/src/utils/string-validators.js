/**
 * Empty string validator
 * Returns true if string is empty or consists of only whitespace
 * Returns false otherwise
 * NOTE: trim() does not modify the string passed as arg.
 */
export const isEmptyString = (string) => {
    return string.length === 0 && string.trim().length === 0;
};

/**
 * Search String Validator
 * NOTE: Any operations that mutate the original searchString should be done with a copy of the searchString
 */
export const isValidSearchString = (searchString) => {
    if (!isEmptyString(searchString)) {
        return true; // NOT empty - valid search string
    } else {
        return false; // empty - invalid search string
    }
};
