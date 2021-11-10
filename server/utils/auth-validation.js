import { validate as isEmail } from "email-validator";

/**
 * Empty string validator
 * Returns true if string is empty or consists of only whitespace
 * Returns false otherwise
 */
const isEmptyString = (string) => string.trim().length === 0;

/**
 * Email & password validation for a login attempt
    @param { String } email 
    @param { String } password 
 */
export const validateLoginCredentials = (email, password) => {
    const errors = {};

    // Define errors for empty or invalid email
    if (isEmptyString(email)) {
        errors.email = "Please enter an email";
    } else if (!isEmail(email)) {
        errors.email = "Please enter a valid email";
    }

    // Define errors for empty or invalid password
    if (isEmptyString(password)) {
        errors.password = "Please enter a password";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    }

    /** Return object
     * errors object -> errors accumulated during validation
     * isValid boolean -> true if no errors, false otherwise
     */
    return { errors, isValid: Object.keys(errors).length === 0 };
};
