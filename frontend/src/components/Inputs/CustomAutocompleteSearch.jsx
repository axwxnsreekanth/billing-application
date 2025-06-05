import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconSearch, IconX } from "@tabler/icons-react";

export const CustomAutocompleteSearch = ({
  options = [],
  placeholder,
  handleChange,
  error,
  maxWidth,
  disabled,
  value,
  sx = {},
}) => {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("");

  const handleSelectionChange = (_, newValue) => {
    setSearchValue(newValue);
    handleChange(newValue); // Call handleChange when an option is selected
  };

  const handleInputChange = (_, newInputValue) => {
    setSearchValue(newInputValue);
    handleChange(newInputValue); // Call handleChange when typing
  };

  useEffect(() => {
    if (value == "") {
      setSearchValue("");
    } else if (typeof value === "string") {
      setSearchValue(value);
    }
  }, [value]);

  return (
    <Autocomplete
      freeSolo
      value={searchValue ?? value}
      onChange={handleSelectionChange} // Handles selection from dropdown
      onInputChange={handleInputChange} // Handles manual input
      options={options}
      disabled={disabled}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.name
      }
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      disableClearable
      clearOnEscape
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          placeholder={placeholder}
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
          error={!!error}
          helperText={error}
          value={searchValue}
          InputProps={{
            ...params.InputProps,
            type: "search",
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: "6px" }}>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ marginX: 1, marginY: -1 }}
                />
                <IconSearch size={16} color={searchValue ? "black" : "gray"} />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
