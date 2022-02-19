import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    // Flex-child of PageContainer
    widthContainer: {
        position: "relative",
        flexGrow: 1, // take up remaining space in viewport
        minHeight: "50vh",
    },
    // Optional class, added if "center" prop is passed
    centerChildren: {
        paddingTop: theme.spacing(2),

        // Center on large screens
        [theme.breakpoints.up("sm")]: {
            paddingTop: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    },
    // Allows you to overwrite default padding/margin of MUI Container
    padding: {
        paddingTop: ({ padding }) => padding?.top && theme.spacing(padding.top),
        paddingRight: ({ padding }) =>
            padding?.right && theme.spacing(padding.right),
        paddingBottom: ({ padding }) =>
            padding?.bottom && theme.spacing(padding.bottom),
        paddingLeft: ({ padding }) =>
            padding?.left && theme.spacing(padding.left),
    },
    margin: {
        // Margin right & left are determined by MUI Container
        marginTop: ({ margin }) => margin?.top && theme.spacing(margin.top),
        marginRight: ({ margin }) =>
            margin?.right && theme.spacing(margin.right),
        marginBottom: ({ margin }) =>
            margin?.bottom && theme.spacing(margin.bottom),
        marginLeft: ({ margin }) => margin?.left && theme.spacing(margin.left),
    },
}));
