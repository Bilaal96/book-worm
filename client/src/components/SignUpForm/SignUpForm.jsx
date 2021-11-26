import { useState, useContext, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { AuthContext } from "contexts/auth/auth.context";
import FormWrapper from "components/FormWrapper/FormWrapper";
import { Grid, TextField, Button, Link, Typography } from "@material-ui/core";

import validate from "utils/auth-form-validators";

import useStyles from "./styles";

const SignUpForm = () => {
    const classes = useStyles();
    const history = useHistory();

    const { setAuth } = useContext(AuthContext);

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
        console.log("-- validateForm() --");
        const { firstName, lastName, email, password } = formValues;
        const errors = {};

        // Validate formValues, update errors object if any values are invalid
        validate.textField(
            { firstName },
            errors,
            "Please enter your first name"
        );
        validate.textField({ lastName }, errors, "Please enter your last name");
        validate.email(email, errors);
        validate.password(password, errors);

        // Update formErrors state
        setFormErrors(errors);

        // Derive boolean return value -> indicates if form input is valid
        const isValid = Object.keys(errors).length === 0;
        console.log("isValid", isValid);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("--- Signup submit ---");

        // Determine if user input is valid
        const isValid = validateForm(formFields);

        if (isValid) {
            // Form passed client validation, make sign-up request
            try {
                const response = await fetch(
                    "http://localhost:5000/auth/signup",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(formFields),
                    }
                );
                const data = await response.json();

                // Request failed, update errors state
                if (data.errors) setFormErrors(data.errors);

                // Request succeeded
                if (data.user) {
                    console.log("SIGNUP SUCCESS", data);

                    // Update AuthContext with retrieved user
                    setAuth({
                        user: data.user,
                        isAuthenticated: true,
                    });

                    // Clear form inputs
                    setFormFields({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                    });

                    // Redirect
                    history.replace("/manage-lists");
                }
            } catch (err) {
                // Request error - e.g. wrong endpoint / server error
                console.log(err);
            }
        }
    };

    return (
        <FormWrapper title="Sign Up">
            <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
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
