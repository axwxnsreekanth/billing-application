import React, { useState, useEffect} from "react";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";

export const CustomRadioGroup = ({ options, value, direction = "row", onSelect, sx = {} }) => {
  const [selected, setSelected] = useState(null);

  const handleChange = (event) => {
    const selectedOption = options.find(option => option.id.toString() === event.target.value);
    setSelected(selectedOption);
    onSelect(selectedOption);
  };

  useEffect(() => {
          if (value > 0) {
            setSelected(options.find(option => option.id.toString() === value.toString()));
          }
      }, []);

  return (
    <FormControl>
      <RadioGroup
        row={direction === "row"}
        value={selected ? selected.id.toString() : ""}
        onChange={handleChange}
        sx={sx}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.id}
            value={option.id.toString()}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

