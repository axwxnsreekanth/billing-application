import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import { IconSearch } from "@tabler/icons-react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export const CustomSearchTextField = ({
  value,
  onChange,
  options = [],
  placeholder = "",
  size = "small",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "2px",
        padding: "4px 8px",
      }}
    >
      <Autocomplete
        freeSolo
        options={options}
        value={value}
        onInputChange={(event, newValue) => onChange(newValue)}
        sx={{ flex: 1, border: "none" }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            size={size}
            placeholder={placeholder}
            InputProps={{
              ...params.InputProps,
              disableUnderline: true,
            }}
          />
        )}
      />
      <Divider orientation="vertical" flexItem sx={{ marginX: 0 }} />
      <InputAdornment position="end">
        <IconSearch size={20} />
      </InputAdornment>
    </Box>
  );
};
