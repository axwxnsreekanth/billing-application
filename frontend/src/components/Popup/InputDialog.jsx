import React, { useState } from 'react';
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export const InputDialog = ({ open, onClose, onSubmit,title="" }) => {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value);
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
                    height: '250px',      // ⬅️ height
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
                <TextField
                    label={title}
                    fullWidth
                    variant="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    sx={{
                        mt: 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        },
                    }}
                />
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

