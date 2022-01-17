import { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { AuthContext } from "contexts/auth/auth.context";
import FormWrapper from "components/FormWrapper/FormWrapper";
import { Grid, TextField, Button, Link, Typography } from "@material-ui/core";

import validate from "utils/form-validators";

import useStyles from "./styles";

const LoginForm = () => {
    const classes = useStyles();
    const location = useLocation();

    const { authenticate } = useContext(AuthContext);

    const [formFields, setFormFields] = useState({
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
        const { email, password } = formValues;
        const errors = {};

        // Validate formValues, update errors object if any values are invalid
        validate.email(email, errors);
        validate.password(password, errors);

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
                    You must login to access this page
                </Typography>
            )}

            <form onSubmit={handleLogin} noValidate>
                <Grid container spacing={2}>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            type="password"
                            variant="outlined"
                            required
                            fullWidth
                            autoComplete="current-password"
                            helperText={formErrors.password}
                            error={formErrors.hasOwnProperty("password")}
                        />
                    </Grid>
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
