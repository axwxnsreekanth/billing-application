  
import { TextField, InputAdornment } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CustomPaswordTextField = ({
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
    icon: Icon, // Accepts Tabler icon component
    sx = {},
    onClick
}) => {
    const theme = useTheme();

    return (
        <TextField
            fullWidth
            value={value || ""}
            onChange={handleChange}
            disabled={disabled}
            type="password"
            inputRef={inputRef}
            onKeyDown={onKeyDown}
            autoComplete="new-password"
            onFocus={onFocus}
            onClick={onClick}
            variant="outlined"
            placeholder={placeholder}
            onKeyPress={handleKeyPress} // Add onKeyPress event listener
            error={!!errors}
            helperText={errors}
            sx={{
                "& .MuiInputBase-input": {
                    fontSize: "14px",
                    fontWeight: bold ? 600 : 0, // Apply bold font weight
                    color: specialColor ? "#7f1fa3" : "#000000",
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
                ...sx,
            }}
            InputProps={{
                startAdornment: Icon && (
                    <InputAdornment position="start">
                        <Icon size={18} color={"gray"} />
                    </InputAdornment>
                ),
            }}
            inputProps={{
                maxLength: maxLength, // Set the maximum character length here
            }}

        />
    );
};
