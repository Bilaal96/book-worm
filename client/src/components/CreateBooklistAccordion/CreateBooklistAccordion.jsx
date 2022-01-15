import { useState } from "react";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Button,
} from "@material-ui/core";
import { ExpandMore, AddCircleOutlined } from "@material-ui/icons";

import useStyles from "./styles";

const CreateBooklistAccordion = () => {
    const [expanded, setExpanded] = useState(false);
    const styleProps = { expanded };
    const classes = useStyles(styleProps);

    const [formFields, setFormFields] = useState({
        listName: "",
        description: "",
    });

    const handleAccordionExpansion = (e, isExpanded) => {
        setExpanded(isExpanded);
    };

    const handleFormFieldChange = (e) => {
        const { name, value } = e.target;

        setFormFields({
            ...formFields,
            [name]: value,
        });
    };

    const cancelListCreation = (e) => {
        // Clear formFields
        setFormFields({
            listName: "",
            description: "",
        });
        // Close accordion
        setExpanded(false);
    };

    const createNewList = (e) => {
        e.preventDefault();
        console.log("Create new list submission");
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
                <form onSubmit={createNewList}>
                    <TextField
                        label="List Name"
                        value={formFields.listName}
                        onChange={handleFormFieldChange}
                        className={classes.textField}
                        name="listName"
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={formFields.description}
                        onChange={handleFormFieldChange}
                        className={classes.textField}
                        name="description"
                        fullWidth
                    />

                    <div className={classes.formControls}>
                        <Button
                            onClick={cancelListCreation}
                            color="secondary"
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            startIcon={<AddCircleOutlined />}
                            type="submit"
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </AccordionDetails>
        </Accordion>
    );
};

export default CreateBooklistAccordion;
