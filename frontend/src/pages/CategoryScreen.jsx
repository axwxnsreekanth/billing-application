import React, { useState, useEffect } from "react";
import { Box, TableBody, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { InputDialog } from "../components";
import { useToast } from "../components/Popup/ToastProvider";

function CategoryScreen() {
    const {showToast}=useToast();
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [open, setOpen] = useState(false);

    const handleAddMake = async (val) => {

        try {
            const { data:res } = await api.get(`${urls.checkDuplicateCategory}?Category=${val}`);
            if(res.exists){
                showToast("Category Already Exists","error")
            }
            else{
            const { data } = await api.post(urls.insertCategory, {
                Category: val,

            });
            showToast("Category Added","success")
            getAllCategory();
        }
        }
        catch (err) {
            showToast("Error Occured","error")
        }
    };


    const getAllCategory = async () => {
        try {
            const { data } = await api.get(`${urls.getCategories}?category=${category}`)
            if (data.resultStatus === 'success') {
                setCategoryList(data.data)
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        getAllCategory();
    }, [category])

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
                        <CustomFormLabel text={"Category"} />
                        <Grid item flex={1}>
                            <CustomTextField value={category} handleChange={(e) => setCategory(e.target.value)} 
                                placeholder={"Search......."}
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
                            onClick={()=>setOpen(true)}
                        >Add</Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell sx={{ width: "15%" }}>Sl No</TableCell>
                                <TableCell>Category</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                categoryList.length === 0 ? (
                                    <TableRow key={categoryList.length}>
                                        <TableCell colSpan={14} align="center">No Data Available</TableCell>
                                    </TableRow>
                                ) : (
                                    categoryList.map((details, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{details.Name}</TableCell>
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
                title="Category"
            />
        </Grid>
    );
}

export default CategoryScreen;