import React from "react";
import { Box, Typography, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell, TextField } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomDateField } from '../components'
import { useState, useEffect } from "react";
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { KeyboardArrowDown, KeyboardArrowUp, Delete as DeleteIcon } from '@mui/icons-material';

function BillReport() {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [dateList, setDateList] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [openRows, setOpenRows] = useState({});
    const { showToast } = useToast();

    const toggleRow = (index) => {
        setOpenRows(prev => ({ ...prev, [index]: !prev[index] }));
    };
    useEffect(() => {
        const fetchDate = async () => {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            setCurrentDate(formattedDate);
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
        try {
            const { data } = await api.get(`${urls.getBillReports}?dateFrom=${dateFrom}&dateTo=${dateTo}&paymentMode=0`);
            console.log("dataaa", data)
            if (data.resultStatus === 'success') {

            }
        }
        catch (err) {
            showToast("Failed,Something went wrong", "error");
        }
    }


    return (
        <Grid container height="100%" direction={"column"} spacing={1} padding={1}>
            <Box
                sx={{
                    borderRadius: 4,
                    p: 3,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    height: "100%",
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
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>

                        <Grid item flex={1}>
                            <CustomDropDown options={[]} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 3 }} alignItems={"center"} justifyContent={"flex-end"}>
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
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell>Sl No</TableCell>
                                <TableCell>Item </TableCell>
                                <TableCell>Make&Model</TableCell>
                                <TableCell>Payment Mode</TableCell>
                                <TableCell>Technician</TableCell>
                                <TableCell>Bill Date</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>
        </Grid>
    );
}

export default BillReport;