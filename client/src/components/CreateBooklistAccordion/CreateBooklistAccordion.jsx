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

import useStyles from "./styles";

const CreateBooklistAccordion = () => {
    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);

    const [expanded, setExpanded] = useState(false);
    const [formFields, setFormFields] = useState({
        title: "",
        description: "",
    });

    const styleProps = { expanded };
    const classes = useStyles(styleProps);

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

    const clearFormFields = () => {
        setFormFields({
            title: "",
            description: "",
        });
    };

    const resetAccordion = (e) => {
        clearFormFields();
        setExpanded(false); // close/retract accordion
    };

    const createBooklist = async (e) => {
        e.preventDefault();
        console.log("Create new list submission");

        try {
            const response = await fetch("http://localhost:5000/booklists", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                    Credentials: "include",
                },
                body: JSON.stringify(formFields),
            });

            // Failed to create list
            if (!response.ok) {
                const error = await response.json();
                throw Error(error.message);
            }

            // Successfully created list
            const newBooklist = await response.json();
            console.log("Booklist created", newBooklist);
            // Add newBooklist to masterList
            setMasterList([...masterList, newBooklist]);

            // Clear and close accordion
            resetAccordion();
        } catch (err) {
            console.error(err);
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
                    />

                    <div className={classes.formControls}>
                        <Button
                            onClick={resetAccordion}
                            color="secondary"
                            variant="outlined"
                        >
                            Reset
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
