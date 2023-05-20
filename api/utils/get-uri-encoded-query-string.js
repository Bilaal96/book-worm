/**
 * Generates an encoded URI query string, using the key-value pairs of queryParams arg.
 * String returned should be appended to a url string, after the "?"
 */
export default function getURIEncodedQueryString(queryParams) {
    return Object.entries(queryParams)
        .map(
            ([queryParam, value]) =>
                `${queryParam}=${encodeURIComponent(value)}`
        )
        .join("&");
}
