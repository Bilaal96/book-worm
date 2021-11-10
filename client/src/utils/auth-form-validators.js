import isEmptyString from "./is-empty-string";

/**
 * ----- Client-side Form Validation -----
 * --- Generic TextField Validation --- 
 * Validate user input for a required text field

 @param { Object } textFieldObject - key-value pair used to access field name & value
 @param { Object } errors - object to append any errors to
 @param { String } errorMessage - the message to display if field is invalid 
 */
const validateTextField = (textFieldObject, errors, errorMessage) => {
    // Extract property name and value pair from textFieldObject
    const [textFieldName, textFieldValue] = Object.entries(textFieldObject)[0];

    // Validation checks occur on textFieldValue
    if (isEmptyString(textFieldValue)) {
        // Set error property with name of related field in which error occurred
        // Assign custom errorMessage (passed as arg.) to error property
        errors[textFieldName] = errorMessage;
    }
};

/**
 * --- Specialised Field Validation ---
    @param { String } email|password - string representation of field 
    @param { Object } errors - object to append any errors to
 */
const validateEmail = (email, errors) => {
    // Used to check for correct email syntax
    // Does not allow spaces, or more than one @ symbol
    // Simplest acceptable form: _@_._
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isEmptyString(email)) {
        // Email field is empty
        errors.email = "Please enter an email";
    } else if (!emailRegex.test(email)) {
        // Email format is invalid
        errors.email = "Please enter a valid email";
    }
};

const validatePassword = (password, errors) => {
    if (isEmptyString(password)) {
        // Password field is empty
        errors.password = "Please enter a password";
    } else if (password.length < 6) {
        // Password format is too short
        errors.password = "Password must be at least 6 characters long";
    }
};

const validators = {
    textField: validateTextField,
    email: validateEmail,
    password: validatePassword,
};

export default validators;
