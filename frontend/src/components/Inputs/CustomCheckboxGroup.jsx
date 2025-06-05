import React, { useState } from "react";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  Typography,
  Box,
} from "@mui/material";

export const CustomCheckboxGroup = ({
  options,
  direction = "row",
  onSelect,
  sx = {},
  bottomLabels,
}) => {
  const [selected, setSelected] = useState({});

  const handleChange = (id) => {
    setSelected((prev) => {
      const newState = {
        ...prev,
        [id]: prev[id] === 2 ? 0 : prev[id] === 1 ? 2 : 1,
      };
      onSelect(
        options.map((option) => ({
          ...option,
          checkedStatus: newState[option.id] || 0,
        }))
      );
      return newState;
    });
  };

  return (
    <FormControl>
      <FormGroup row={direction === "row"} sx={{ gap: 3, ...sx }}>
        {options.map((option) => (
          <Box
            key={option.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected[option.id] === 2}
                  indeterminate={selected[option.id] === 1}
                  onChange={() => handleChange(option.id)}
                />
              }
              label={option.label}
            />
            {bottomLabels.length == 3 && (
              <Typography
                variant="caption"
                sx={{ mt: -0.5, color: "text.secondary" }}
              >
                {bottomLabels[selected[option.id] || 0]}
              </Typography>
            )}
          </Box>
        ))}
      </FormGroup>
    </FormControl>
  );
};
