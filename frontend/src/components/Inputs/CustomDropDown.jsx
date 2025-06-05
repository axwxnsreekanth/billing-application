import React from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export const CustomDropDown = ({
  value,
  handleChange,
  error,
  options,
  disabled,
  inputRef,
  maxWidth,
  itemClick,
  bold = false,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth error={!!error}>
        <Select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          inputRef={inputRef}
          sx={{
            borderRadius: "6px",
            height: "40px",
            backgroundColor: theme.palette.background.paper,
            fontWeight: bold ? 600 : 400,
            color: theme.palette.text.primary,
            ...(maxWidth ? { maxWidth: { xs: "100%", md: maxWidth } } : {}),
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.divider,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "& .MuiSelect-select": {
              fontSize: "14px",
              padding: "8px 14px",
            },
            ...sx,
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              onClick={() => itemClick?.()}
              sx={{
                fontSize: "14px",
                color: theme.palette.text.primary,
              }}
            >
              {option.description}
            </MenuItem>
          ))}
        </Select>
        {!!error && (
          <FormHelperText>{error}</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};
