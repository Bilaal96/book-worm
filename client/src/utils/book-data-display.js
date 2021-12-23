import fallbackThumbnail from "assets/no-book-cover.jpg";

export const getBookThumbnail = (imageLinks) => {
    // Return imageLinks.thumbnail if it exists
    if (imageLinks && imageLinks.thumbnail) return imageLinks.thumbnail;

    // imageLinks is undefined (i.e. does not exist)
    return fallbackThumbnail;
};

export const getBookBrief = (apiSearchInfo) => {
    let briefPrefix = "<strong>Brief:</strong>";
    // return textSnippet if it exists
    // NOTE: we must also check for apiSearchInfo as it might not exist
    if (apiSearchInfo?.textSnippet)
        return `${briefPrefix} ${apiSearchInfo.textSnippet}`;

    // Fallback brief - apiSearchInfo or textSnippet does not exist
    return `${briefPrefix} <em>No description available</em>`;
};

export const formatAuthors = (authors) => {
    // No authors array returned, or no authors listed
    if (!authors || !authors.length) return "Author(s) Unknown";

    // Multiple authors - abbreviated
    if (authors.length > 1)
        return `By ${authors[0]} (+${authors.length - 1} more)`;

    // Single author
    return `By ${authors[0]}`;
};
