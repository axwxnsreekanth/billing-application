import React, { useState, useEffect } from "react";
import { Box, TableBody, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { InputDialog } from "../components";
import { useToast } from "../components/Popup/ToastProvider";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog } from "../components";


function CategoryScreen() {
    const { showToast } = useToast();
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryID, setNewCategoryID] = useState(0);
    const [open, setOpen] = useState(false);
    const [deleteID, setDeleteID] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    const handleAddCategory = async (val) => {
        try {
            if (newCategory !== "") {
                if (newCategory === val) {
                    return;
                }
            }
            const { data: res } = await api.get(`${urls.checkDuplicateCategory}?Category=${val}`);
            if (res.exists) {
                showToast("Category Already Exists", "error")
            }
            else {
                if (newCategory !== "") {
                    const { data } = await api.put(`${urls.updateCategory}?id=${newCategoryID}&Name=${val}`)
                    if (data == "Category updated") {
                        showToast("Category Updated", "success")
                    }
                }
                else {
                    const { data } = await api.post(urls.insertCategory, {
                        Category: val,

                    });
                    showToast("Category Added", "success")
                }
                getAllCategory();
            }
        }
        catch (err) {
            showToast("Error Occured", "error")
        }
    };

    const handleDelete = async () => {
        try {
            if (deleteID != 0) {
                const { data } = await api.delete(`${urls.deleteCategory}?id=${deleteID}`)
                if (data === "Category deleted") {
                    showToast("Category Deleted", "success")
                    getAllCategory();
                }
            }
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setOpenDialog(false);
        }
    };
    const handleDeleteClick = (id) => {
        setDeleteID(id);
        setOpenDialog(true)
    }

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

    const handleEdit = (val, id) => {
        setNewCategory(val);
        setNewCategoryID(id);
        setOpen(true)
    }

    const handleAddClick = () => {
        setNewCategory('');
        setNewCategoryID(0);
        setOpen(true)
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
                            onClick={() => handleAddClick()}
                        >Add</Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell sx={{ width: "15%" }}>Sl No</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell sx={{ width: "15%" }}></TableCell>
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
                                            <TableCell>{details.Category}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(details.Category, details.CategoryID)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={()=>handleDeleteClick(details.CategoryID)}>
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
                onSubmit={handleAddCategory}
                title="Category"
                content={newCategory}
            />
            <ConfirmDialog
                open={openDialog}
                title="Delete Confirmation"
                message="Are you sure you want to delete this Category?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDialog(false)}
            />
        </Grid>
    );
}

export default CategoryScreen;