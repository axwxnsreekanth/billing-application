
import { Box, TableBody, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { useState, useEffect } from "react";
import { useToast } from "../components/Popup/ToastProvider";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CircularLoader } from "../components";

function StockDetails() {
    const { showToast } = useToast();
    const [stockList, setStockList] = useState([])

    const [itemName, setItemName] = useState('');

    const [loading, setLoading] = useState(true);

    const getAllStock = async () => {
        setLoading(true)
        try {
            const { data } = await api.get(`${urls.getStockDetailsForExport}?itemName=${itemName}`)
            if (data.resultStatus === 'success') {
                console.log(data)
                setStockList(data.data)
            }
        }
        catch (err) {
            showToast("Failed,Something went wrong", "error");
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllStock();
    }, [itemName]);


    const exportToExcel = async () => {
        let stock = [];
        try {
            const { data } = await api.get(`${urls.getStockDetailsForExport}?itemName=`)
            if (data.resultStatus === 'success') {
                setStockList(data.data)
                if (data.data.length == 0) {
                    showToast("No data avilable to export", "error");
                    return;
                }
                stock = data.data;
            }
        }
        catch (err) {
            showToast("Failed,Something went wrong", "error");
        }

        // Optional: format or map data if needed
        const formattedData = stock.map((item, index) => ({
            "Sl No": index + 1,
            "Item": item.Item,
            "Category": item.Category,
            "Make": item.make || '-',
            "Model": item.model || '-',
            "Universal": item.IsUniversal == 1 ? "Yes" : "No",
            "Barcode": item.Barcode,
            "Quantity": item.Quantity
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Details");

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(blob, "StockReport.xlsx");
    };



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
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"Item:"} />
                        <Grid item flex={1}>
                            <CustomTextField placeholder={"Search......."}
                                value={itemName}
                                handleChange={(e) => setItemName(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"} justifyContent={"flex-end"}>
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
                            onClick={exportToExcel}
                        >Export</Button>
                    </Grid>
                </Grid>

                {loading ? (
                    <CircularLoader />
                ) : (
                    <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                                <TableRow>
                                    <TableCell sx={{ width: "8%" }}>Sl No</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Make</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Barcode</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    stockList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={14} align="center">No Data Available</TableCell>
                                        </TableRow>
                                    ) : (
                                        stockList.map((details, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{details.Item}</TableCell>
                                                <TableCell>{details.Category}</TableCell>
                                                <TableCell>{details.make || '-'}</TableCell>
                                                <TableCell>{details.model || '-'}</TableCell>
                                                <TableCell>{details.Barcode}</TableCell>
                                                <TableCell>{details.Quantity}</TableCell>
                                            </TableRow>
                                        ))
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}


            </Box>

        </Grid>
    );
}

export default StockDetails;