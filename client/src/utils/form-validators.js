import { isEmptyOrWhitespace } from "./string-validators";

const MIN_PASSWORD_LENGTH = 8;

/**
 * ----- Client-side Form Validation -----
 * --- Generic TextField Validation --- 
 * Validate user input for a required text field
    @param { Object } textFieldObj - key-value pair used to access field name & value
    @param { Object } errors - object to append any errors to
    @param { String } errorMessage - the message to display if field is invalid 
 */
const validateTextField = (textFieldObj, errors, errorMessage) => {
    // Extract property name and value pair from textFieldObj
    const [textFieldProp, textFieldVal] = Object.entries(textFieldObj)[0];

    // Validation checks occur on textFieldVal
    if (isEmptyOrWhitespace(textFieldVal)) {
        // Set error property with name of related field in which error occurred
        // Assign custom errorMessage (passed as arg.) to error property
        errors[textFieldProp] = errorMessage;
    }
};

/**
 * --- Name Field Validation ---
 * A flexible name field validator that can be reused for first/middle/last or any other combo of names
    @param { Object } nameFieldObj - key-value pair used to access field name & value
    @param { Object } errors - object to append any errors to
    @param { String } position - the position of a name; e.g. "First", "Middle", "Last" - should be capitalized
 */
const validateName = (nameFieldObj, errors, position = "") => {
    const [nameProp, nameVal] = Object.entries(nameFieldObj)[0];

    // Specific "First name"/"Last name" or generic "Name"
    const nameType = position.length ? position + " name" : "Name";

    // Name field is empty
    if (nameVal.length === 0) {
        errors[nameProp] = `${nameType} is required`;
        return;
    }

    // Name field only contains whitespace
    if (nameVal.trim().length === 0) {
        errors[nameProp] = `Please enter a valid ${nameType.toLowerCase()}`;
    }
};

/**
 * --- Email / Password Field Validation ---
    @param { String } email|password - string representation of field 
    @param { Object } errors - object to append any errors to
 */
const validateEmail = (email, errors) => {
    // Used to check for correct email syntax
    // Does not allow spaces, or more than one @ symbol
    // Simplest acceptable form: _@_._
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isEmptyOrWhitespace(email)) {
        // Email field is empty
        errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
        // Email format is invalid
        errors.email = "Please enter a valid email";
    }
};

const validateLoginPassword = (password, errors) => {
    if (isEmptyOrWhitespace(password)) {
        // Password field is empty
        errors.password = "Password is required";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        // Password format is too short
        // Error also lists complexity requirements
        errors.password = `Password must be ${MIN_PASSWORD_LENGTH} or more characters`;
    }
};

// NOTE: Signup form password validator checks for complexity to ensure that user enters a secure password
const validateSignupPassword = (password, errors) => {
    if (password.length === 0) {
        // Password field is empty
        errors.password = "Password is required";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
        // Password format is too short
        // Error also lists complexity requirements
        errors.password = `Password must be ${MIN_PASSWORD_LENGTH} or more characters and include at least one of each from: uppercase letter, lowercase letter, digit (0-9) & special character (!@#$%^&*)`;
    } else {
        // Check if password meets complexity requirements
        const errorMessage = checkPasswordComplexity(password);
        // Return error if requirements were not met
        if (errorMessage.length) errors.password = errorMessage;
    }
};

/** 
 * --- Password Complexity Checker ---
 * Checks if password contains at least one of each character type from:
 * uppercase letter
 * lowercase letter
 * digit (0 - 9)
 * special characters (one of: !@#$%^&*)

 * Returns error message if one or all character types are missing
 * This helps to ensure users enter secure passwords
 */
function checkPasswordComplexity(password) {
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
    if (mismatches.length === 0) return "";

    // Invalid password - some or no criteria was met
    // Create array of criteria that the password DID match
    const matches = criteriaArr.filter((el) => !mismatches.includes(el));

    // Function that joins array elements into a comma-separated string
    // Then replaces last comma with "&"
    const convertArrayToStringList = (array) =>
        array.join(", ").replace(/,(?=[^,]*$)/, " &");

    // Password did not match ANY criteria, return error
    const missingCriteria = convertArrayToStringList(mismatches);
    const noMatchMsg = `Password is missing ${missingCriteria}`;
    if (matches.length === 0) return noMatchMsg;

    // Password criteria has been partially met, return error
    const matchingCriteria = convertArrayToStringList(matches);
    const partialMatchMsg = `${noMatchMsg}; but includes ${matchingCriteria}`;
    return partialMatchMsg;
}

const validators = {
    textField: validateTextField,
    name: validateName,
    email: validateEmail,
    loginPassword: validateLoginPassword,
    signupPassword: validateSignupPassword,
};

export default validators;
