import React from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

export const CustomPriceTextFieldForTable = ({
    value,
    handleChange,
    errors,
    maxWidth,
    sx = {},
}) => {
    const theme = useTheme();

    return (
        <TextField
            fullWidth
               value={value || ""}
            onChange={handleChange}
            placeholder="0.00"
            type="number"
            inputProps={{
                inputMode: "decimal",
                min: 0,
                step: "0.01",
            }}
            variant="outlined"
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
                "& input": {
                    textAlign: "right",
                },
                ...sx,
            }}
            error={!!errors}
            helperText={errors}
        />
    );
};
