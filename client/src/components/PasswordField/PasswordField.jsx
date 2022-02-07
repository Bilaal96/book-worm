import PropTypes from "prop-types";
import { useState } from "react";

// Components
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const PasswordField = ({
    onChange: handleChange,
    label,
    id,
    name,
    variant,
    required,
    ...otherProps
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <TextField
            // show password functionality
            type={showPassword ? "text" : "password"}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            // required prop
            onChange={handleChange}
            // default values available
            label={label}
            id={id}
            name={name}
            variant={variant}
            required={required}
            {...otherProps}
        />
    );
};

PasswordField.defaultProps = {
    label: "Password",
    id: "password",
    name: "password",
    variant: "outlined",
    required: true,
};

PasswordField.propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    variant: PropTypes.string,
    required: PropTypes.bool,
};

export default PasswordField;
