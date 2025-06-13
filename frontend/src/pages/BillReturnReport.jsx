import React from "react";
import { Box, Typography, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell, Paper, IconButton, Collapse, TableBody } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomDateField } from '../components'
import { useState, useEffect } from "react";
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { KeyboardArrowDown, KeyboardArrowUp, Delete as DeleteIcon } from '@mui/icons-material';


const ExpandableRow = ({ row }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow >
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.InvoiceNo}</TableCell>
                <TableCell>{row.Customer}</TableCell>
                <TableCell>{row.BillDate}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Make</TableCell>
                                        <TableCell>Model</TableCell>
                                        <TableCell>Universal</TableCell>
                                        <TableCell>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.Items?.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{item.Item}</TableCell>
                                            <TableCell>{item.Category}</TableCell>
                                            <TableCell>{item.Make || '-'}</TableCell>
                                            <TableCell>{item.Model || '-'}</TableCell>
                                            <TableCell>{item.IsUniversal ? 'Yes' : 'No'}</TableCell>
                                            <TableCell>{item.Quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

function BillReturnReport() {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [dataList, setDataList] = useState([]);
    const { showToast } = useToast();


    useEffect(() => {
        const fetchDate = async () => {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            if (dateFrom != formattedDate) {
                setDateFrom(formattedDate);
            }
            if (dateTo != formattedDate) {
                setDateTo(formattedDate);
            }
        };
        fetchDate();
    }, []);


    const getbillingReports = async () => {
        if(dateFrom>dateTo){
            showToast("Invalid Date Selection","error")
            return;
        }
        try {
            const { data } = await api.get(`${urls.getBillReturnReports}?dateFrom=${dateFrom}&dateTo=${dateTo}`);
            if (data.resultStatus === 'success') {
                setDataList(data.data)
            }
        }
        catch (err) {
            showToast("Failed,Something went wrong", "error");
        }
    }


    return (
        <Grid container height="100%" direction={"column"} spacing={2} padding={1}>
            <Box
                sx={{
                    borderRadius: 4,
                    p: 3,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    height: "100%",
                    spacing: 1
                }}
            >
                <Grid container direction={"row"} spacing={1} >
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
                        <CustomFormLabel text={"Date From"} />
                        <Grid item flex={1}>
                            <CustomDateField
                                value={dateFrom}
                                handleChange={(e) => setDateFrom(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
                        <CustomFormLabel text={"Date To"} />
                        <Grid item flex={1}>
                            <CustomDateField
                                value={dateTo}
                                handleChange={(e) => setDateTo(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 6 }} mb={1} alignItems={"center"} justifyContent={"flex-end"}>
                        <Button
                            variant="contained" color="primary"
                            sx={{
                                borderRadius: '30px', // Rounded corners
                                textTransform: 'none', // Prevent uppercase transformation
                                padding: '8px 16px', // Adjust padding for better appearance
                                borderWidth: '1.5px',
                                height: "40px",
                                ml: 1,
                                mr: 1,
                            }}
                            onClick={getbillingReports}
                        >Show</Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell />
                                <TableCell>Invoice No</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Bill Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataList.length == 0 ? (
                                    <TableRow key={dataList.length}>
                                        <TableCell colSpan={14} align="center">No Data Available</TableCell>
                                    </TableRow>
                                ) :
                                    dataList.map((row, index) => (
                                        <ExpandableRow key={index} row={row} />
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Grid>
    );
}

export default BillReturnReport;