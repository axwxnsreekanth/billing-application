import React from "react";
import { Box, TableBody, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { useState, useEffect } from "react";
import { useToast } from "../components/Popup/ToastProvider";
import { InputDialogWithSelect } from "../components";

function VehicleModel() {
    const {showToast}=useToast()
    const [modelList, setModelList] = useState([])
    const [makeList, setMakeList] = useState([])
    const [model, setModel] = useState('');
    const [selectedMake, setSelectedMake] = useState(0);
    const [newMakeList, setNewMakeList] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const fetchMakes = async () => {
            try {
                const { data } = await api.get(`${urls.getAllMakes}?make=`)
                if (data.resultStatus === 'success') {
                    const formattedData = [{ id: 0, description: "All Makes" },
                    ...data.data.map(({ MakeID, Make }) =>
                    ({
                        id: MakeID,
                        description: Make
                    }
                    )
                    )
                    ]
                    setMakeList(formattedData)
                    const formattedDataForNew = [
                        ...data.data.map(({ MakeID, Make }) =>
                        ({
                            id: MakeID,
                            description: Make
                        }
                        )
                        )
                    ]
                    setNewMakeList(formattedDataForNew)
                }
            }
            catch (err) {
                console.error(err)
            }
        };

        fetchMakes();
    }, []);

    const handleAddModel = async (model,id) => {
        try {
            const { data } = await api.get(`${urls.checkDuplicateModel}?Model=${model}&MakeID=${id}`);
          
            if (data.exists) {
                showToast("Model Already Exists","error")
            }
            else {
                try {
                    const { data } = await api.post(urls.insertModel, {
                        Model: model,
                        MakeID: id
                    });
                    showToast("Model Added","success")
                    getAllModels();
                }
                catch (err) {
                    showToast("Error Occured","error")
                    console.error(err)
                }
            }
        }
        catch (err) { }
    };

    useEffect(() => {
        getAllModels();
    }, [model, selectedMake]);

    const getAllModels = async () => {
        try {
            const { data } = await api.get(`${urls.getAllModels}?modelName=${model}&makeID=${selectedMake}`)
            if (data.resultStatus == 'success') {
                setModelList(data.data);
            }
        }
        catch (err) {

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
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"Model"} />
                        <Grid item flex={1}>
                            <CustomTextField placeholder={"Search......"}
                                value={model}
                                handleChange={(e) => setModel(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
                        <Grid item flex={1}>
                            <CustomDropDown options={makeList} value={selectedMake}
                                handleChange={(e) => setSelectedMake(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"} justifyContent={"flex-end"}>
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
                            onClick={() => setOpen(true)}
                        >Add</Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell sx={{ width: "15%" }}>Sl No</TableCell>
                                <TableCell>Model</TableCell>
                                <TableCell>Make</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                modelList.length === 0 ? (
                                    <TableRow key={modelList.length}>
                                        <TableCell colSpan={14} align="center">No Data Available</TableCell>
                                    </TableRow>
                                ) : (
                                    modelList.map((details, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{details.Model}</TableCell>
                                            <TableCell>{details.Make}</TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <InputDialogWithSelect
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddModel}
                title="Model"
                selectOptions={newMakeList}
            />
        </Grid>
    );
}

export default VehicleModel;