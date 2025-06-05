import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Paper,
    Box
} from '@mui/material';

export const ItemPopup = ({ open, onClose, onSelect, items = [] }) => {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const focusRef = useRef(null);
    const rowRefs = useRef([]);

    // Auto-focus the dialog content
    useEffect(() => {
        if (open) {
            setSelectedIndex(0);
            setTimeout(() => {
                focusRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // Auto-scroll to selected row
    useEffect(() => {
        const selectedRef = rowRefs.current[selectedIndex];
        if (selectedRef) {
            const headerOffset = 50; // Approximate height of table header
            const scrollParent = selectedRef?.closest('.MuiPaper-root');

            if (scrollParent && selectedIndex === 0) {
                scrollParent.scrollTo({
                    top: selectedRef.offsetTop - headerOffset,
                    behavior: 'smooth',
                });
            } else {
                selectedRef.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [selectedIndex]);


    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prev) => (prev + 1) % items.length);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
            e.preventDefault();
        } else if (e.key === 'Enter') {
            onSelect(items[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={()=>{  console.log("Dialog onClose triggered");
        onClose}} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 600, fontSize: '1.8rem' }}>
                Select an Item
            </DialogTitle>

            <DialogContent>
                <Box
                    ref={focusRef}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    sx={{ outline: 'none' }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            width: '100%',
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                    >
                        <Table stickyHeader size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontSize: '1rem', fontWeight: 'bold',width:"15%" }}>
                                        Sl No
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                        Item Name
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, idx) => (
                                    <TableRow
                                        ref={(el) => (rowRefs.current[idx] = el)}
                                        key={item.id}
                                        hover
                                        sx={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedIndex === idx ? '#424242' : 'inherit',
                                            '&:hover': {
                                                backgroundColor: selectedIndex === idx
                                                    ? '#383838'
                                                    : (theme) => theme.palette.action.hover,
                                            },
                                        }}
                                    >
                                        <TableCell
                                            align="center"
                                            sx={{
                                                fontSize: '1rem',
                                                color: selectedIndex === idx ? 'white' : 'inherit',
                                            }}
                                        >
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: '1rem',
                                                color: selectedIndex === idx ? 'white' : 'inherit',
                                            }}
                                        >
                                            {item.ItemName}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    <Typography variant="body2" sx={{ mt: 2, fontSize: '0.95rem', color: 'text.secondary' }}>
                        Use <strong>↑</strong> <strong>↓</strong> to navigate, <strong>Enter</strong> to select, <strong>Esc</strong> to close.
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};


