import React, { useState } from "react";
import { InputAdornment, TextField, IconButton, Divider, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconPlus, IconX } from "@tabler/icons-react";

export const CustomTextFieldWithAdd = ({
  value,
  placeholder,
  handleChange,
  handleSearch,
  onKeyPress,
  error,
  disabled,
  maxWidth,
  maxLength,
  inputRef,
  sx = {},
}) => {
  const theme = useTheme();
  const [search, setSearch] = useState(value); // Initialize with prop value

  const handleTextChange = (e) => {
    setSearch(e.target.value);
    handleChange(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(search); // Call handleChange when search is triggered
  };

  const handleClear = () => {
    setSearch(""); // Clear input
    handleChange(""); // Reset parent state
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(search); // Call handleSearch when Enter is pressed
    }
  };

  return (
    <>
      <TextField
        fullWidth
        disabled={disabled}
        value={value}
        inputRef={inputRef}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown} // Add onKeyDown event listener
        placeholder={placeholder}
        onKeyPress={onKeyPress}
        variant="outlined"
        sx={{
          "& .MuiInputBase-input": {
            fontSize: "14px",
            textTransform: "uppercase", // Transform text to uppercase

          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme.palette.textFieldBorder.main,
            },
            borderRadius: "2px",
            height: "40px",
            ...(maxWidth ? { maxWidth: { xs: "100%", md: maxWidth } } : {}),
          },
          ...sx, // Allow external styles
        }}
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {/* {search && (
                <IconButton size="small" onClick={handleClear}>
                  <IconX size={16} color="gray" />
                </IconButton>
              )} */}
              <Divider
                orientation="vertical"
                flexItem
                sx={{ marginX: 1, marginY: -1 }}
              />
              <IconButton
                size="small"
                onClick={handleSearchClick}
                sx={{ padding: 0 }}
              >
                <IconPlus size={18} color={search ? "black" : "gray"} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          maxLength: maxLength, // Set the maximum character length here
        }}
      />
    </>
  );
};
