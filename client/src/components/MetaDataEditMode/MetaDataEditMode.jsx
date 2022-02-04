import PropTypes from "prop-types";
import { useState, useContext } from "react";

// Context
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import { Typography, TextField, Button } from "@material-ui/core";
import { Save } from "@material-ui/icons";

// Utils
import validate from "utils/form-validators";

const MetadataEditMode = ({
    listId,
    title,
    description,
    setEditMode,
    parentStyles,
}) => {
    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);

    // Edit metadata form state
    const [formFields, setFormFields] = useState({
        title,
        description,
    });
    const [formErrors, setFormErrors] = useState({});

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

    // Validates inputs, constructs errors object and updates errors state
    const validateForm = (formValues) => {
        // NOTE: description is not a required field
        const { title, description } = formValues;
        const errors = {};

        // Validate formValues, update errors object if any values are invalid
        validate.textField({ title }, errors, "A title is required");

        // Clear description if it only contains whitespace
        if (description.trim().length === 0) {
            setFormFields({
                ...formFields,
                description: "",
            });
        }

        // Derive boolean return value -> indicates if form input is valid
        const isValid = Object.keys(errors).length === 0;

        // Update formErrors state
        if (!isValid) setFormErrors(errors);

        console.log("isValid", isValid);
        return isValid;
    };

    const updateBooklistMetadata = async (e) => {
        e.preventDefault();
        const formIsValid = validateForm(formFields);

        if (formIsValid) {
            try {
                // Make PATCH request for partial update of a booklist
                const response = await fetch(
                    `http://localhost:5000/booklists/${listId}`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formFields),
                    }
                );

                // Handle fetch error
                if (!response.ok) {
                    const error = await response.json();
                    throw error;
                }

                // Update successful - parse response to obtain the updated booklist
                const updatedBooklist = await response.json();
                console.log("BOOKLIST METADATA UPDATED", updatedBooklist);

                // Remove old booklist and replace with new version
                let updatedMasterList = masterList.filter(
                    (booklist) => booklist._id !== listId
                );

                // Append new booklist to the beginning of masterList
                updatedMasterList.unshift(updatedBooklist);
                setMasterList(updatedMasterList);

                // Return to display mode
                setEditMode(false);
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
        <>
            <Typography variant="h4" component="h2">
                Edit Booklist Details
            </Typography>

            <form
                className={parentStyles.editForm}
                onSubmit={updateBooklistMetadata}
            >
                {/* Form Inputs */}
                <TextField
                    label="Title"
                    value={formFields.title}
                    onChange={handleFormFieldChange}
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
                    name="description"
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    helperText={formErrors.description}
                    error={formErrors.hasOwnProperty("description")}
                />

                {/* Save Button */}
                <div className={parentStyles.actions}>
                    <Button
                        className={parentStyles.saveButton}
                        color="primary"
                        variant="contained"
                        startIcon={<Save />}
                        type="submit"
                    >
                        Save Details
                    </Button>

                    {/* Cancel Button */}
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </>
    );
};

MetadataEditMode.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    setEditMode: PropTypes.func.isRequired,
    parentStyles: PropTypes.object.isRequired,
};

export default MetadataEditMode;
