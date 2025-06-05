import React, { useEffect, useState } from "react";
import { Box, TableBody, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { InputDialogWithSelect } from "../components";
import { useToast } from "../components/Popup/ToastProvider";

function ItemScreen() {
    const {showToast}=useToast();
    const [itemList, setItemList] = useState([]);
    const [itemName, setItemName] = useState("");
    const [categoryID, setCategoryID] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryListPopUp, setCategoryListPopUp] = useState([]);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        getCategoryList();

    },[])

    const getCategoryList = async () => {
        try {
            const { data } = await api.get(`${urls.getCategories}?category=`)
            if (data.resultStatus == 'success') {
                const formattedData = [{ id: 0, description: "All categories" },
                ...data.data.map(({ ID, Name }) => ({
                    id: ID,
                    description: Name
                }))
                ]
                const formattedDataForPopup=[  ...data.data.map(({ ID, Name }) => ({
                    id: ID,
                    description: Name
                }))]
                setCategoryListPopUp(formattedDataForPopup)
                setCategoryList(formattedData)
            }
        }
        catch (err) {
        }
    }

    const getItems = async () => {
        try {
            const { data } = await api.get(`${urls.getAllItems}?itemName=${itemName}&categoryID=${categoryID}`)
            if (data.resultStatus == 'success') {
                setItemList(data.data);
            }
        }
        catch (err) {

        }
    }

    const handleAddItem = async (item,id) => {
        try {
            const {data:res}=await api.get(`${urls.checkDuplicateItem}?itemName=${item}&categoryID=${id}`)
            if(res.exists){
                showToast("Item Already Exists","error")
            }
            else{
           const {data}=await api.post(urls.insertItem,{
            itemName:item,
            categoryID:id
           })
           showToast("Item Added","success")
           getItems()
        }
    }
        catch (err) { 
            showToast("Error Occured","error")
        }
    };

    useEffect(() => {
        getItems();
    }, [itemName, categoryID])

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
                        <CustomFormLabel text={"ItemName"} />
                        <Grid item flex={1}>
                            <CustomTextField value={itemName}
                                handleChange={(e) => setItemName(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
                        <Grid item flex={1}>
                            <CustomDropDown options={categoryList} value={categoryID} handleChange={(e) => setCategoryID(e.target.value)} />
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
                            onClick={()=>setOpen(true)}
                        >Add</Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>
                                <TableCell sx={{ width: "10%" }}>Sl No</TableCell>
                                <TableCell>Item </TableCell>
                                <TableCell>Category</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                itemList.length === 0 ? (
                                    <TableRow key={itemList.length}>
                                        <TableCell colSpan={14} align="center">No Item Available</TableCell>
                                    </TableRow>
                                ) : (
                                    itemList.map((details, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{details.ItemName}</TableCell>
                                            <TableCell>{details.CategoryName}</TableCell>
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
                onSubmit={handleAddItem}
                title="Item"
                selectOptions={categoryListPopUp}
            />
        </Grid>
    );
}

export default ItemScreen;