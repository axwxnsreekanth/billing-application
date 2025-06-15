import React from "react";

import { TextField, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CustomMultilineTextField = ({
    value,
    placeholder,
    handleChange,
    errors,
    disabled,
    maxWidth,
    readOnly,
    bold = false,
    specialColor = false,
    maxLength,
    inputRef,
    onKeyDown,
    handleKeyPress,
    onFocus,
    icon: Icon, // Accepts Tabler icon component
    sx = {},
    row 
}) => {
    const theme = useTheme();

    return (
        <TextField
            fullWidth
            value={value || ""}
            onChange={handleChange}
            disabled={disabled}
            inputRef={inputRef}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            variant="outlined"  
            rows={row} // Controls the height 
            width="auto"
            placeholder={placeholder}
            onKeyPress={handleKeyPress} // Add onKeyPress event listener
            error={!!errors}
            helperText={errors} 
            multiline 
            InputProps={{
                startAdornment: Icon && (
                    <InputAdornment position="start">
                        <Icon size={18} color={"gray"} />
                    </InputAdornment>
                ),
            }}
            inputProps={{
                maxLength: maxLength, // Set the maximum character length here
            }}

        />
    );
};
