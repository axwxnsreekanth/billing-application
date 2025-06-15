import React from "react";
import { Box, FormControlLabel, Checkbox, FormHelperText } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CustomCheckBox = ({
  checkboxLabel,
  value,
  disabled,
  handleChange,
  bold = false,
  error,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={value || false}
            disabled={disabled}
            onChange={handleChange}
            sx={{
              color: theme.palette.textFieldBorder.main, // Default border color
              p: 0, // Reduce extra padding
              m: 0,
              ml: 1,
              mr: -1,
            }}
          />
        }
        label={checkboxLabel}
        sx={{
          width: "100%",
          alignItems: "center", // Ensures the label and checkbox align properly
          gap: "10px", // Adds spacing between checkbox and label
          "& .MuiFormControlLabel-label": {
            fontSize: "14px",
            flexGrow: 1, // Ensures label takes the available space without pushing the checkbox
            textAlign: "left", // Ensures text aligns properly with other fields
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: bold ? "bold" : "", // Makes the label text bold
          },
          ...sx,
        }}
      />
      {!!error && (
        <FormHelperText sx={{ color: theme.palette.error.main }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
};
