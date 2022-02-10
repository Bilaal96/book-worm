import { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

// Context
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { Grid, TextField, Link, Typography } from "@material-ui/core";
import FormWrapper from "components/FormWrapper/FormWrapper";
import PasswordField from "components/PasswordField/PasswordField";
import AsyncButton from "components/AsyncButton/AsyncButton";

// Utils
import validate from "utils/form-validators";

import useStyles from "./styles";
import { LockOpen } from "@material-ui/icons";

const LoginForm = () => {
    const classes = useStyles();
    const location = useLocation();

    const { authenticate, authInProgress } = useContext(AuthContext);

    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
    });
    const [formErrors, setFormErrors] = useState({});

    //! DEV-ONLY
    useEffect(() => {
        if (Object.keys(formErrors).length > 0) {
            console.log("FORM ERRORS:", formErrors);
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
        const { email, password } = formValues;
        const errors = {};

        // Validate formValues, update errors object if any values are invalid
        validate.email(email, errors);
        validate.loginPassword(password, errors);

        // Update formErrors state
        setFormErrors(errors);

        // Derive boolean return value -> indicates if form input is valid
        const isValid = Object.keys(errors).length === 0;
        console.log("isValid", isValid);
        return isValid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("--- Login Submit ---");

        // Determine if user input is valid
        const formIsValid = validateForm(formFields);

        if (formIsValid) {
            // Form passed client validation, make login request
            const authErrors = await authenticate("login", formFields);
            // Login failed, update formErrors state
            if (authErrors) setFormErrors(authErrors);
        }
    };

    return (
        <FormWrapper title="Log In">
            {/* Display message if redirected from a ProtectedRoute component */}
            {location.state?.isProtected && (
                <Typography
                    className={classes.protectedRouteMessage}
                    align="center"
                >
                    You must login to access that page
                </Typography>
            )}

            {/* Display message if redirected due to expired session */}
            {location.state?.sessionExpired && (
                <Typography
                    className={classes.protectedRouteMessage}
                    align="center"
                >
                    Your session has expired, please log back in to continue
                </Typography>
            )}

            <form onSubmit={handleLogin} noValidate>
                <Grid container spacing={2}>
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
                            autoFocus
                            helperText={formErrors.email}
                            error={formErrors.hasOwnProperty("email")}
                            disabled={authInProgress}
                        />
                    </Grid>

                    {/* Password */}
                    <Grid item xs={12}>
                        <PasswordField
                            onChange={handleChange}
                            name="password"
                            autoComplete="current-password"
                            fullWidth
                            helperText={formErrors.password}
                            error={formErrors.hasOwnProperty("password")}
                            disabled={authInProgress}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <AsyncButton
                            className={classes.submit}
                            type="submit"
                            color="secondary"
                            variant="contained"
                            fullWidth
                            startIcon={<LockOpen />}
                            loading={authInProgress}
                        >
                            {authInProgress ? "Logging in" : "Submit"}
                        </AsyncButton>
                    </Grid>

                    {/* Link to Sign Up form */}
                    <Grid item>
                        <Typography>
                            Don't have an account?{" "}
                            <Link component={RouterLink} to="/signup">
                                Sign up here
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </FormWrapper>
    );
};

export default LoginForm;
