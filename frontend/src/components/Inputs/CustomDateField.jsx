import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

export const CustomDateField = ({
  value,
  disabled,
  handleChange,
  disableFuture = false,
  error,
  onKeyDown,
  inputRef,
  onBlur,
  sx = {},
}) => {
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    // const today = new Date();
    const fetchData = async () => {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setCurrentDate(formattedDate);
    }
    fetchData();
  });
  return (
    <TextField
      fullWidth
      type="date"
      value={value || ""}
      onChange={handleChange}
      inputProps={disableFuture ? { max: currentDate } : {}}
      onBlur={onBlur}
      disabled={disabled}
      onKeyDown={onKeyDown}
      inputRef={inputRef}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: 'black',
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
        "& input::-webkit-calendar-picker-indicator": {
          display: "block",
          opacity: 1,
          cursor: "pointer",
          position: "relative",
          zIndex: 1,
        },
      
        // // Target the calendar icon (Chrome, Edge, Safari)
        // "& input::-webkit-calendar-picker-indicator": {
        //   filter: "invert(45%) sepia(10%) saturate(200%) hue-rotate(180deg)", // Change color
        //   cursor: "pointer",
        // },
        // // Target the calendar icon for Firefox
        // "& input[type='date']::-moz-calendar-picker-indicator": {
        //   filter: "invert(45%) sepia(10%) saturate(200%) hue-rotate(180deg)",
        // },
        ...sx,
      }}
      error={error}
      helperText={error}
    />
  );
};
