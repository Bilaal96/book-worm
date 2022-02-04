import { useState, useContext } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Button,
} from "@material-ui/core";
import { ExpandMore, AddCircleOutlined } from "@material-ui/icons";

// Utils
import validate from "utils/form-validators";

import useStyles from "./styles";

const CreateBooklistAccordion = () => {
    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);

    const [expanded, setExpanded] = useState(false);
    const [formFields, setFormFields] = useState({
        title: "",
        description: "",
    });
    const [formErrors, setFormErrors] = useState({});

    const styleProps = { expanded };
    const classes = useStyles(styleProps);

    const handleAccordionExpansion = (e, isExpanded) => {
        setExpanded(isExpanded);
    };

    const handleFormFieldChange = (e) => {
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

    const clearFormFields = () => {
        setFormFields({
            title: "",
            description: "",
        });
        setFormErrors({});
    };

    const resetAccordion = (e) => {
        clearFormFields();
        setExpanded(false); // close/retract accordion
    };

    // Validates inputs, constructs errors object and updates errors state
    const validateForm = (formValues) => {
        // NOTE: description is not a required field
        const { title, description } = formValues;
        const errors = {};

        // Validate formValues, update errors object if any values are invalid
        validate.textField({ title }, errors, "A title is required");

        // Clear description if it only contains whitespace
        if (description.trim().length === 0)
            setFormFields({
                ...formFields,
                description: "",
            });

        // Derive boolean return value -> indicates if form input is valid
        const isValid = Object.keys(errors).length === 0;

        // Update formErrors state
        if (!isValid) setFormErrors(errors);

        console.log("isValid", isValid);
        return isValid;
    };

    const createBooklist = async (e) => {
        e.preventDefault();
        const formIsValid = validateForm(formFields);

        if (formIsValid) {
            try {
                const response = await fetch(
                    "http://localhost:5000/booklists",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formFields),
                    }
                );

                // Failed to create list - handle bad response
                if (!response.ok) {
                    const err = await response.json();
                    if (err.errors) throw err; // Throw validation errors
                    throw err; // Throw generic error
                }

                // Successfully created list
                const newBooklist = await response.json();
                console.log("BOOKLIST CREATED:", newBooklist);
                // Add newBooklist to beginning of masterList
                setMasterList([newBooklist, ...masterList]);

                // Clear and close accordion
                resetAccordion();
            } catch (err) {
                console.error(err);

                // Display server-side errors in UI
                if (err.errors) {
                    // -- form validation errors
                    setFormErrors(err.errors);
                } else {
                    // -- internal server error
                    setFormErrors({
                        title: "",
                        description:
                            "Something went wrong on our end, try again",
                    });
                }
            }
        }
    };

    return (
        <Accordion
            className={classes.accordion}
            expanded={expanded}
            onChange={handleAccordionExpansion}
        >
            <AccordionSummary
                className={classes.accordionSummary}
                expandIcon={<ExpandMore className={classes.expandIcon} />}
            >
                <Typography variant="h6">Create New List</Typography>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
                <form onSubmit={createBooklist}>
                    <TextField
                        label="Title"
                        value={formFields.title}
                        onChange={handleFormFieldChange}
                        className={classes.textField}
                        name="title"
                        variant="outlined"
                        fullWidth
                        helperText={formErrors.title}
                        error={formErrors.hasOwnProperty("title")}
                    />
                    <TextField
                        label="Description"
                        value={formFields.description}
                        onChange={handleFormFieldChange}
                        className={classes.textField}
                        name="description"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={4}
                        helperText={formErrors.description}
                        error={formErrors.hasOwnProperty("description")}
                    />

                    <div className={classes.formControls}>
                        <Button
                            color="primary"
                            variant="contained"
                            startIcon={<AddCircleOutlined />}
                            type="submit"
                        >
                            Create
                        </Button>
                        <Button
                            onClick={resetAccordion}
                            color="secondary"
                            variant="outlined"
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
};

export default CreateBooklistAccordion;
