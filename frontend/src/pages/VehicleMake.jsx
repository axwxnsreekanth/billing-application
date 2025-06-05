import React from "react";
import { Box, TableBody, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { useState, useEffect } from "react";
import { InputDialog } from "../components";
import { useToast } from "../components/Popup/ToastProvider";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function VehicleMake() {
    const { showToast } = useToast();
    const [makeList, setMakeList] = useState([])
    const [make, setMake] = useState('');
    const [open, setOpen] = useState(false);
    const handleAddMake = async (make) => {
        try {
            const { data } = await api.get(`${urls.checkDuplicateMake}?Make=${make}`);
            if (data.exists) {
                showToast("Make Already Exists", "error")
            }
            else {
                try {
                    const { data } = await api.post(urls.insertMake, {
                        Make: make,
                        Type: 1
                    });
                    showToast("Make Added", "success")
                    getAllMakes();
                }
                catch (err) {
                    showToast("Error Occured", "error")
                    console.error(err)
                }
            }
        }
        catch (err) { }
    };
    const getAllMakes = async () => {
        try {
            const { data } = await api.get(`${urls.getAllMakes}?make=${make}`)
            if (data.resultStatus === 'success') {
                setMakeList(data.data)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getAllMakes();
    }, [make])

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
                        <CustomFormLabel text={"Make:"} />
                        <Grid item flex={1}>
                            <CustomTextField placeholder={"Search......."}
                                value={make}
                                handleChange={(e) => setMake(e.target.value)}
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
                            onClick={() => { setOpen(true) }}
                        >Add</Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell sx={{ width: "15%" }}>Sl No</TableCell>
                                <TableCell>Make</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                makeList.length === 0 ? (
                                    <TableRow key={makeList.length}>
                                        <TableCell colSpan={14} align="center">No Data Available</TableCell>
                                    </TableRow>
                                ) : (
                                    makeList.map((details, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{details.Make}</TableCell>
                                            <TableCell>
                                                <IconButton >
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton >
                                                    <DeleteIcon color="error" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <InputDialog
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddMake}
                title="Make"
            />
        </Grid>
    );
}

export default VehicleMake;