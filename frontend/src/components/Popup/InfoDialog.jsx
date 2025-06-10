import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Slide,
  Box,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

// Slide transition for dialog
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export const InfoDialog = ({
  open,
  onClose,
  title = 'Information',
  message = 'This is an informational message.',
  icon = <InfoOutlinedIcon fontSize="large" color="primary" />,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { borderRadius: 16, padding: '1rem' },
        elevation: 3,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0 }}>
          {icon}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </DialogTitle>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: 2, px: 4 }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};


