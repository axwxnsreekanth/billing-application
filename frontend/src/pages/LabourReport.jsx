import { Box, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell, Paper, TableBody } from "@mui/material";
import { CustomFormLabel, CustomDateField } from '../components'
import { useState, useEffect } from "react";
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { useAuth } from "../context/authContext";

function LabourReport() {
    const { logout } = useAuth();
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


    const getLabourReports = async () => {
        if (dateFrom > dateTo) {
            showToast("Invalid Date Selection", "error")
            return;
        }
        try {
            const { data } = await api.get(`${urls.getLabourReports}?dateFrom=${dateFrom}&dateTo=${dateTo}`);
            if (data.resultStatus === 'success') {
                setDataList(data.data)
            }
        }
        catch (err) {
            if (err.response.status == 403) {
                logout();
            }
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
                            onClick={getLabourReports}
                        >Show</Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell>Sl No</TableCell>
                                <TableCell>Technician</TableCell>
                                <TableCell>Labour</TableCell>
                                <TableCell>Date</TableCell>
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
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{row.TECHNICIAN}</TableCell>
                                            <TableCell>{row.LABOUR}</TableCell>
                                            <TableCell>{new Date(row.BILLDATE).toLocaleDateString('en-IN')}</TableCell>
                                        </TableRow>
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Grid>
    );
}

export default LabourReport;