import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box } from '@mui/material';
import { TrendingUp, Inventory2 } from '@mui/icons-material';
import api from "../services/api";
import urls from "../services/urls";
import { motion } from 'framer-motion';
import { useAuth } from "../context/authContext";
import { CircularLoader } from "../components";

const Dashboard = () => {
    const { logout } = useAuth();
    const [topSales, setTopSales] = useState([]);
    const [outOfStock, setOutOfStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [salesRes, stockRes] = await Promise.all([
                    api.get(urls.getRecentSales),
                    api.get(urls.getZeroStock),
                ]);
                setTopSales(salesRes.data.data);
                setOutOfStock(stockRes.data.data);
            } catch (error) {
                if (err.response.status == 403) {
                    logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);



    return (
        <>
            {loading ? (
                <CircularLoader />
            ) : (
                <Box
                    sx={{
                        borderRadius: 4,
                        p: 3,
                        boxShadow: 3,
                        backgroundColor: 'background.paper',
                        height: "100%",
                    }}
                >
                    <Grid container spacing={4} padding={2} direction="column">

                        {/* Recent Sales */}
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <TrendingUp color="primary" sx={{ fontSize: 28, mr: 1 }} />
                                            <Typography variant="h6" fontWeight="bold">Recent Sales</Typography>
                                        </Box>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Customer</TableCell>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Amount</TableCell>
                                                    <TableCell>Invoice</TableCell>
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
                                                            <TableCell>
                                                                <Typography fontWeight="bold" color="success.main">
                                                                    ₹{sale.ReceivedAmount}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>{sale.Invoiceno}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                        {/* Out of Stock Items */}
                        <Grid item xs={12}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Inventory2 color="error" sx={{ fontSize: 28, mr: 1 }} />
                                            <Typography variant="h6" fontWeight="bold">Out of Stock</Typography>
                                        </Box>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                    <TableCell>#</TableCell>
                                                    <TableCell>Item</TableCell>
                                                    <TableCell>Category</TableCell>
                                                    <TableCell>Barcode</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {outOfStock.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">All items in stock</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    outOfStock.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{item.Item}</TableCell>
                                                            <TableCell>{item.Category}</TableCell>
                                                            <TableCell>{item.Barcode || '-'}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>

                    </Grid>

                </Box>
            )}
        </>
    );
};

export default Dashboard;
