import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box } from '@mui/material';
import { TrendingUp, Inventory2 } from '@mui/icons-material';
import api from "../services/api";
import urls from "../services/urls";

const Dashboard = () => {
    const [topSales, setTopSales] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [salesRes, stockRes] = await Promise.all([
                    api.get(urls.getRecentSales),
                    api.get(urls.getZeroStock),
                ]);
                console.log("sa", stockRes.data)
                setTopSales(salesRes.data.data);
                setOutOfStock(stockRes.data.data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);



    return (

        <Box
            sx={{
                borderRadius: 4,
                p: 3,
                boxShadow: 3,
                backgroundColor: 'background.paper',
                height: "100%",
            }}
        >
            <Grid container direction="column" spacing={3} padding={3} height={"100%"} alignItems={"space-evenly"} >
                {/* Top Sales Section */}
                <Grid item xs={12} mb={2}>
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <TrendingUp color="primary" sx={{ mr: 1 }} />
                                Recent 2 Sales
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Invoice No</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topSales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">No sales data</TableCell>
                                        </TableRow>
                                    ) : (
                                        topSales.map((sale, index) => (
                                            <TableRow key={sale.BillID}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{sale.Customer}</TableCell>
                                                <TableCell>{new Date(sale.BillDate).toLocaleDateString()}</TableCell>
                                                <TableCell>₹{sale.TotalAmount}</TableCell>
                                                <TableCell>{sale.Invoiceno}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Out of Stock Section */}
                <Grid item xs={12}>
                    <Card elevation={4}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Inventory2 color="error" sx={{ mr: 1 }} />
                                Out of Stock Items
                            </Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Item</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Model</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {outOfStock.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">All items in stock</TableCell>
                                        </TableRow>
                                    ) : (
                                        outOfStock.map((item, index) => (
                                            <TableRow key={item.StockID || index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.Item}</TableCell>
                                                <TableCell>{item.Category}</TableCell>
                                                <TableCell>{item.Model || '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid >
        </Box>

    );
};

export default Dashboard;
