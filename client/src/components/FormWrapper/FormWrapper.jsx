import { Container, Paper, Typography } from "@material-ui/core";
import useStyles from "./styles";

const FormWrapper = ({ children, title }) => {
    const classes = useStyles();

    return (
        // <div className={classes.formWrapper}>
        <Container className={classes.formWrapper} maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                {title && (
                    <Typography
                        className={classes.title}
                        component="h2"
                        variant="h4"
                        align="center"
                    >
                        {title}
                    </Typography>
                )}
                {children}
            </Paper>

            {/* </div> */}
        </Container>
    );
};

export default FormWrapper;
