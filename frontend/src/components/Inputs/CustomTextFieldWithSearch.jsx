import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { IconX, IconSearch } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

export const CustomTextFieldWithSearch = ({
  value,
  placeholder,
  handleChange,
  handleSearch,
  handleKeyPress,
  error,
  disabled,
  inputRef,
  maxWidth,
  bold = false,
  specialColor = false,
  maxLength,
  sx = {},
}) => {
  const theme = useTheme();
  const [search, setSearch] = useState(value); // Initialize with prop value

  const handleTextChange = (e) => {
    setSearch(e.target.value);
    handleChange(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(search); // Call handleSearch when search is triggered
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
    <TextField
      fullWidth
      disabled={disabled}
      value={value}
      inputRef={inputRef}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown} // Add onKeyDown event listener
      onKeyPress={handleKeyPress} // Add onKeyPress event listener
      placeholder={placeholder}
      variant="outlined"
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "14px",
          fontWeight: bold ? 600 : 0, // Apply bold font weight
          color: specialColor ? "#7f1fa3" : "#000000",
          textTransform: "uppercase", // Transform text to uppercase
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: 'black',
          },
          borderRadius: "2px",
          height: "40px",
          ...(maxWidth ? { maxWidth: { xs: "100%", md: maxWidth } } : {}),
          "&.Mui-disabled": {
            backgroundColor: 'grey', // or any color you want
            "& fieldset": {
              borderColor: 'grey', // optional lighter border for disabled state
            },
          },
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
              <IconSearch size={18} color={search ? "black" : "gray"} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        maxLength: maxLength, // Set the maximum character length here
      }}
    />
  );
};