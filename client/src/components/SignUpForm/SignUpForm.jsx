import { useState, useContext, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";

// Context
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { Grid, TextField, Button, Link, Typography } from "@material-ui/core";
import FormWrapper from "components/FormWrapper/FormWrapper";
import PasswordField from "components/PasswordField/PasswordField";

// Utils
import validate from "utils/form-validators";

import useStyles from "./styles";

const SignUpForm = () => {
    const classes = useStyles();

    const { authenticate } = useContext(AuthContext);

    const [formFields, setFormFields] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState({});

    //! DEV-ONLY
    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            console.log("FORM ERRORS (CLIENT)", formErrors);
        } else {
            console.log("NO CLIENT ERRORS");
        }
    }, [formErrors]);

    // Sync user input and state
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Remove input-specific error when user starts to type
        if (formErrors.hasOwnProperty(name)) {
            // Delete error from a copy of the errors state
            // As state should not be directly modified
            const errorsCopy = Object.assign({}, formErrors);
            delete errorsCopy[name];
            // Assign modified copy as the new errors state
            setFormErrors(errorsCopy);
        }

        setFormFields({
            ...formFields,
            [name]: value,
        });
    };

    // Validates inputs, constructs errors object and updates errors state
    const validateForm = (formValues) => {
        console.log("Validating form values...");
        const { firstName, lastName, email, password } = formValues;
        const errors = {};

        // Validate formValues, update errors object if any values are invalid
        validate.name({ firstName }, errors, "First");
        validate.name({ lastName }, errors, "Last");

        validate.email(email, errors);
        validate.signupPassword(password, errors);

        // Update formErrors state
        setFormErrors(errors);

        // Derive boolean return value -> indicates if form input is valid
        const isValid = Object.keys(errors).length === 0;
        console.log("isValid", isValid);
        return isValid;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("--- Signup submit ---");

        // Determine if user input is valid
        const formIsValid = validateForm(formFields);

        if (formIsValid) {
            // Form passed client validation, make sign-up request
            const authErrors = await authenticate("signup", formFields);
            // Sign-up failed, update formErrors state
            if (authErrors) setFormErrors(authErrors);
        }
    };

    return (
        <FormWrapper title="Sign Up">
            <form onSubmit={handleSignUp} noValidate>
                <Grid container spacing={2}>
                    {/* First Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            autoComplete="fname"
                            autoFocus
                            helperText={formErrors.firstName}
                            error={formErrors.hasOwnProperty("firstName")}
                        />
                    </Grid>

                    {/* Last Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            autoComplete="lname"
                            helperText={formErrors.lastName}
                            error={formErrors.hasOwnProperty("lastName")}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            autoComplete="email"
                            helperText={formErrors.email}
                            error={formErrors.hasOwnProperty("email")}
                        />
                    </Grid>

                    {/* Password */}
                    <Grid item xs={12}>
                        <PasswordField
                            onChange={handleChange}
                            name="password"
                            autoComplete="new-password"
                            fullWidth
                            helperText={formErrors.password}
                            error={formErrors.hasOwnProperty("password")}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            className={classes.submit}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            fullWidth
                        >
                            Submit
                        </Button>
                    </Grid>

                    {/* Link to Login form */}
                    <Grid item>
                        <Typography>
                            Already have an account?{" "}
                            <Link component={RouterLink} to="/login">
                                Login here
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </FormWrapper>
    );
};

export default SignUpForm;
