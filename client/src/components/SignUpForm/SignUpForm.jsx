import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Grid, TextField, Button, Link, Typography } from "@material-ui/core";
import FormWrapper from "components/FormWrapper/FormWrapper";

import useStyles from "./styles";

const SignUpForm = () => {
    const classes = useStyles();

    const [userCredentials, setUserCredentials] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    console.log(userCredentials);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserCredentials({
            ...userCredentials,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // make post request to create User in db
        // if request is successful, clear inputs state and redirect
        // to either Home/Manage Lists page (TBD)
        console.log("Submit");
    };

    return (
        <FormWrapper title="Sign Up">
            <form onSubmit={handleSubmit}>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email Address"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            autoComplete="email"
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
