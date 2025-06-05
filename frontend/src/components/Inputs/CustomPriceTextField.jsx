import React from "react";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

export const CustomPriceTextField = ({
  value,
  handleChange,
  errors,
  disabled,
  maxWidth,
  inputRef,
  onKeyDown,
  readOnly,
  onBlur,
  onFocus,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      value={value || ""}
      onChange={handleChange}
      disabled={disabled}
      onKeyDown={onKeyDown}
      placeholder="0.00"
      inputRef={inputRef}
      onBlur={onBlur}
      onFocus={onFocus}
      type="number"
      inputProps={{
        inputMode: "decimal",
        min: 0,
        step: "0.01",
        readOnly: readOnly,
      }}
      variant="outlined"
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: 'black',
          },
          borderRadius: "2px",
          height: "40px",
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
