import React, { useState,useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Slide,
    Typography,
    Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { CustomDropDown } from "../Inputs/CustomDropDown";
import { CustomTextField } from '../Inputs/CustomTextField';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const InputDialogWithSelect = ({ open, onClose, onSubmit, title = "",selectOptions }) => {
    const [value, setValue] = useState('');
    const [id, setID] = useState(0);
    useEffect(() => {
        if (selectOptions.length > 0) {
            setID(selectOptions[0].id);
        }
    }, [selectOptions]);
    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value, id);
            setValue('');
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    padding: 2,
                    backgroundColor: '#fefefe',
                    boxShadow: 8,
                    width: '600px',       // ⬅️ width
                    height: '300px',      // ⬅️ height
                    maxWidth: '90vw',     // ⬅️ responsive max
                    maxHeight: '90vh',    // ⬅️ responsive max
                },
            }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Add New {title}</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <CustomTextField
                    label={title}
                    fullWidth
                    variant="outlined"
                    value={value}
                    handleChange={(e) => setValue(e.target.value)}
                    sx={{
                        mt: 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        },
                    }}
                />
                <CustomDropDown options={selectOptions} value={id}
                    handleChange={(e) => setID(e.target.value)}
                    sx={{ mt: 1 }} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="text">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

