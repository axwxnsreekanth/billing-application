import React from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

export const CustomTextFieldForTable = ({
    value,
    placeholder,
    handleChange,
    errors,
    maxWidth,
    onKeyDown,
    type,
    sx = {},
}) => {
    const theme = useTheme();

    return (
        <TextField
            fullWidth
         value={value || ""}
            onChange={handleChange}
            variant="outlined"
            onKeyDown={onKeyDown}
            sx={{
                "& .MuiInputBase-input": {
                    fontSize: "14px",
                },
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: theme.palette.textFieldBorder.main,
                    },
                    borderRadius: "2px",
                    height: "36px",
                    ...(maxWidth ? { maxWidth: { xs: "100%", md: maxWidth } } : {}),
                },
                ...sx,
            }}
            placeholder={placeholder}
            error={!!errors}
            helperText={errors}
            type={type}
        />
    );
};
