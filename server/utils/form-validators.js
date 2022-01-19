import { validate as isEmail } from "email-validator";

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Empty string validator
 * Returns true if string is empty or consists of ONLY whitespace
 * Returns false otherwise
 * NOTE: trim() does not modify the string passed as arg.
 */
export const isEmptyOrWhitespace = (string) => {
    return string.length === 0 || string.trim().length === 0;
};

/**
 * Inverse of isEmptyOrWhitespace
 * Returns true if string has length after trimming leading and trailing whitespace
 * Returns false if string does not have length OR has length but is ONLY whitespace
 */
export const notEmptyOrWhitespace = (string) => {
    return string.length > 0 && string.trim().length > 0;
};

/** Checks if password contains at least one of each character type from:
 * uppercase letter
 * lowercase letter
 * digit (0 - 9)
 * special characters (one of: !@#$%^&*)

 * Returns error message if one or all character types are missing
 */
export const checkPasswordComplexity = (password) => {
    // Valid password criteria
    const criteriaMap = {
        uppercase: "an uppercase letter",
        lowercase: "a lowercase letter",
        digit: "a digit (0-9)",
        special: "a special character (one of: !@#$%^&*)",
    };
    const criteriaArr = Object.values(criteriaMap);

    // Tracks criteria that the password did not match
    let mismatches = [];

    // In password, check for absence of:
    // -- an uppercase letter
    if (!/.*[A-Z].*/.test(password)) mismatches.push(criteriaMap.uppercase);
    // -- a lowercase letter
    if (!/.*[a-z].*/.test(password)) mismatches.push(criteriaMap.lowercase);
    // -- a digit
    if (!/.*\d.*/.test(password)) mismatches.push(criteriaMap.digit);
    // -- a special character (from: !@#$%^&*)
    if (!/.*[!@#$%^&*].*/.test(password)) mismatches.push(criteriaMap.special);

    // Password met all criteria; i.e. is valid
    if (mismatches.length === 0) return true;

    // Invalid password - some or no criteria was met
    // Create array of criteria that the password DID match
    const matches = criteriaArr.filter((el) => !mismatches.includes(el));

    // Function that joins array elements into a comma-separated string
    // Then replaces last comma with "&"
    const convertArrayToStringList = (array) =>
        array.join(", ").replace(/,(?=[^,]*$)/, " &");

    // Password did not match ANY criteria, throw error
    const missingCriteria = convertArrayToStringList(mismatches);
    const noMatchMsg = `Password is missing ${missingCriteria}`;
    if (matches.length === 0) throw Error(noMatchMsg);

    // Password criteria has been partially met, throw error
    const matchingCriteria = convertArrayToStringList(matches);
    const partialMatchMsg = `${noMatchMsg}; but includes ${matchingCriteria}`;
    throw Error(partialMatchMsg);
};

/**
 * Email & password validation for a login attempt
    @param { String } email 
    @param { String } password 
 */
export const validateLoginCredentials = (email, password) => {
    const errors = {};

    // Define errors for empty or invalid email
    if (isEmptyOrWhitespace(email)) {
        errors.email = "Email is required";
    } else if (!isEmail(email)) {
        errors.email = "Please enter a valid email";
    }

    // Define errors for empty or invalid password
    if (isEmptyOrWhitespace(password)) {
        errors.password = "Password is required";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `Password must be ${MIN_PASSWORD_LENGTH} or more characters`;
    }

    /** Return object
     * errors object -> errors accumulated during validation
     * isValid boolean -> true if no errors, false otherwise
     */
    return { errors, isValid: Object.keys(errors).length === 0 };
};
