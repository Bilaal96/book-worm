import clsx from "clsx";

// Components
import { Grid, Typography, Paper } from "@material-ui/core";
import WidthContainer from "components/WidthContainer/WidthContainer";

import useStyles from "./styles";

// Construct reusable Pitch component (containing marketing points)
const PitchTitle = ({ className, children, ...rest }) => {
    const classes = useStyles();

    return (
        <Typography
            className={clsx(classes.pitchTitle, className)}
            variant="h5"
            component="h3"
            align="center"
            {...rest}
        >
            {children}
        </Typography>
    );
};

const PitchContent = ({ children, ...rest }) => {
    const classes = useStyles();
    return (
        <Typography
            className={classes.pitchContent}
            variant="body1"
            align="center"
            {...rest}
        >
            {children}
        </Typography>
    );
};

const Pitch = ({ title, classNameSuffix, children }) => {
    const classes = useStyles();

    return (
        <Grid item xs={12} md={6}>
            <Paper className={classes.paper}>
                <PitchTitle
                    className={`${classes.pitchTitle}__${classNameSuffix}`}
                >
                    {title}
                </PitchTitle>
                <PitchContent>{children}</PitchContent>
            </Paper>
        </Grid>
    );
};

// Default home page content, shown when no searches have been made
const UserAppeal = () => {
    const classes = useStyles();

    return (
        <WidthContainer component="section" padding={{ top: 4, bottom: 2.6 }}>
            <Grid container spacing={2} direction="row">
                {/* Section Title */}
                <Grid item xs={12}>
                    <Typography
                        className={classes.heading}
                        variant="h4"
                        component="h2"
                        align="center"
                    >
                        Save lists of all the books you need for later reference
                        📚
                    </Typography>
                </Grid>

                {/* Marketing Pitch */}
                <Pitch title="👷‍♂️ Work 🔨" classNameSuffix="one">
                    Stuck at work? Exploring uncharted territory? Find the books
                    to assist you with decision making in the workplace.
                </Pitch>
                <Pitch title="📖 Study 🧠" classNameSuffix="two">
                    Are you a student or researcher? Use Book Worm to help you
                    find references for your assignments, research & theses!
                </Pitch>
                <Pitch title="✨ Passion 🔥" classNameSuffix="three">
                    Unearth the kindle that will ignite your next passion
                    project. Allow Book Worm to nurture your ideas and help you
                    to achieve your goals.
                </Pitch>
                <Pitch title="😄 Leisure 💭" classNameSuffix="four">
                    Looking for your next best read? We've got you! Live
                    vicariously through figures of the past, navigate unworldly
                    realms or melt your heart with a romance novel.
                </Pitch>
            </Grid>
        </WidthContainer>
    );
};

export default UserAppeal;
