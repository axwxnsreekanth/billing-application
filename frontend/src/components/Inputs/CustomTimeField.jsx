import React from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

export const CustomTimeField = ({
  value,
  disabled,
  handleChange,
  disableFuture = false,
  error,
  onKeyDown,
  inputRef,
  sx = {},
}) => {
  const theme = useTheme();
  const today = new Date().toISOString().split("T")[0];

  return (
    <TextField
      fullWidth
      type="time"
      value={value || ""}
      onChange={handleChange}
      inputProps={disableFuture ? { max: today } : {}}
      
      disabled={disabled}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.textFieldBorder.main,
          },
          borderRadius: "2px",
          height: "40px",
          width: "100%",
          display: "flex",
          alignItems: "center",
        },
        "& .MuiInputBase-root": {
          width: "100%",
          flexGrow: 1, // Ensures it takes up full space
        },
        "& input": {
          width: "100%",
          padding: "10px",
          textAlign: "left",
          appearance: "auto",
        },
        // Target the calendar icon (Chrome, Edge, Safari)
        "& input::-webkit-calendar-picker-indicator": {
          filter: "invert(45%) sepia(10%) saturate(200%) hue-rotate(180deg)", // Change color
          cursor: "pointer",
        },
        // Target the calendar icon for Firefox
        "& input[type='date']::-moz-calendar-picker-indicator": {
          filter: "invert(45%) sepia(10%) saturate(200%) hue-rotate(180deg)",
        },
        ...sx,
      }}
      error={error}
      helperText={error}
    />
  );
};
