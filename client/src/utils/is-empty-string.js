/**
 * Empty string validator
 * Returns true if string is empty or consists of only whitespace
 * Returns false otherwise
 */
export default function isEmptyString(string) {
    return string.trim().length === 0;
}
