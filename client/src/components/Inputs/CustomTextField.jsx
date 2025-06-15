import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CustomTextField = ({
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
  label,
  icon: Icon,
  sx = {},
  onClick
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <TextField
      fullWidth
      value={value || ""}
      onChange={handleChange}
      disabled={disabled}
      label={label}
      inputRef={inputRef}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      variant="outlined"
      placeholder={placeholder}
      onKeyPress={handleKeyPress}
      error={!!errors}
      onClick={onClick}
      helperText={errors}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontWeight: bold ? 600 : 400,
          color: specialColor
            ? theme.palette.primary.main
            : theme.palette.text.primary,
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: theme.palette.primary.main,
          },
          borderRadius: "6px",
          height: "40px",
          backgroundColor: theme.palette.background.paper,
          ...(maxWidth ? { maxWidth: { xs: "100%", md: maxWidth } } : {}),
        },
        ...sx,
      }}
      InputProps={{
        readOnly: readOnly,
        startAdornment: Icon && (
          <InputAdornment position="start">
            <Icon
              size={18}
              color={
                specialColor
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary
              }
            />
          </InputAdornment>
        ),
      }}
      inputProps={{
        maxLength: maxLength,
      }}
    />
  );
};
