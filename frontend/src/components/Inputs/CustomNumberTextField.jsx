import React from "react";

import { TextField, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CustomNumberTextField = ({
    value,
    placeholder,
    handleChange,
    errors,
    disabled,
    maxWidth,
    inputRef,
    maxLength,
    onKeyDown,
    sx = {},
}) => {
    const theme = useTheme();

    const handleKeyDown = (event) => {
        if ([".", "e", "E", "-"].includes(event.key)) {
            event.preventDefault();
        }
        if (onKeyDown) {
            onKeyDown(event);
        }
    };

    return (
        <TextField
            fullWidth
            value={value || ""}
            type="number"
            onChange={handleChange}
            disabled={disabled}
            inputRef={inputRef}
            variant="outlined"
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            error={!!errors}
            helperText={errors}
            sx={{
                "& .MuiInputBase-input": {
                    fontSize: "14px",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: theme.palette.textFieldBorder.main,
                    },
                    borderRadius: "2px",
                    height: "40px",
                    ...(maxWidth ? { maxWidth: { xs: "100%", md: maxWidth } } : {}),
                },
                ...sx,
            }}
            InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
            }}
            inputProps={{
                maxLength: maxLength, // Set the maximum character length here
            }}
        />
    );
};
