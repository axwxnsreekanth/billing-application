import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

export const CustomFormLabel = ({
  text,
  isRequired = false,
  bold = false,
  specialColor = false,
  fullWidth = false,
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Typography
      sx={{
        textAlign: "right",
        fontSize: "14px",
        fontWeight: bold ? 600 : 400,
        color: specialColor
          ? theme.palette.primary.main
          : theme.palette.text.primary,
        width: fullWidth ? "100%" : "80px",
        ...sx,
      }}
    >
      {text}
      {isRequired && (
        <Typography
          component="span"
          sx={{ color: theme.palette.error.main, marginLeft: "2px" }}
        >
          *
        </Typography>
      )}
    </Typography>
  );
};
