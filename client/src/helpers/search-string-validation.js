export const isValidSearchString = (searchString) => {
    let mutableSearchString = searchString;
    // check if string still has length after trimming whitespace
    if (mutableSearchString.length && mutableSearchString.trim().length) {
        return true;
    } else {
        return false;
    }
};
