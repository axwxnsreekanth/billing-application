import React, { useEffect, useState } from "react";
import {
    Box, Typography, Grid, Button, TableContainer, Table, TableRow, TableHead, TableCell, FormControl, FormControlLabel
    , TableBody, Checkbox
} from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomPriceTextField, CustomTextFieldWithSearch } from '../components'
import { ItemPopup } from "../components";
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { ConfirmDialog } from "../components";
const StockEdit = () => {
    const { showToast } = useToast();
    const [open, setOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemID, setItemID] = useState(0);
    const [categoryID, setCategoryID] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [newMakeList, setNewMakeList] = useState([]);
    const [makeID, setMakeID] = useState(0);
    const [modelList, setModelList] = useState([])
    const [modelID, setModelID] = useState(0);
    const [isUniversalChecked, setIsUniversalChecked] = useState(false);
    const [qty, setQty] = useState(0)
    const [mrp, setMrp] = useState(0)
    const [barCode, setBarCode] = useState('')
    const [partNumber, setPartNumber] = useState('')
    const [barCodeSearch, setBarCodeSearch] = useState('')
    const [partNumberSearch, setPartNumberSearch] = useState('')
    const [stockData, setStockData] = useState([]);
    const [stockID, setStockID] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const handleCheckboxChange = (event) => {
        setIsUniversalChecked(event.target.checked);

    };
    const handleSelect = (item) => {
        console.log("selected", item)
        setItemName(item.Item)
        setItemID(item.ItemID);
        setOpen(false);
        console.log("Set open to false");
    }
    useEffect(() => {
        getCategoryList();
        fetchMakes();
    }, [])

    const getItems = async () => {
        try {
            const { data } = await api.get(`${urls.getAllItems}?item=${itemName}&categoryID=${categoryID}`)
            if (data.resultStatus == 'success') {
                console.log("id", data.data)
                setItemList(data.data);
                setOpen(true)
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const fetchMakes = async () => {
        try {
            const { data } = await api.get(`${urls.getAllMakes}?make=`)
            if (data.resultStatus === 'success') {
                const formattedDataForNew = [
                    ...data.data.map(({ MakeID, Make }) =>
                    ({
                        id: MakeID,
                        description: Make
                    }
                    )
                    )
                ]
                setMakeID(formattedDataForNew[0].id)
                setNewMakeList(formattedDataForNew)
            }
        }
        catch (err) {
            console.error(err)
        }
    };

    const getCategoryList = async () => {
        try {
            const { data } = await api.get(`${urls.getCategories}?category=`)
            if (data.resultStatus == 'success') {
                const formattedDataForPopup = [...data.data.map(({ CategoryID, Category }) => ({
                    id: CategoryID,
                    description: Category
                }))]
                setCategoryList(formattedDataForPopup)
                setCategoryID(formattedDataForPopup[0].id)
            }
        }
        catch (err) {
        }
    }

    const getAllModels = async (id) => {
        try {
            const { data } = await api.get(`${urls.getAllModels}?modelName=&makeID=${id}`)
            if (data.resultStatus == 'success') {
                const formattedDataForNew = [
                    ...data.data.map(({ ModelID, Model }) =>
                    ({
                        id: ModelID,
                        description: Model
                    }
                    )
                    )
                ]
                setModelList(formattedDataForNew);
                setModelID(formattedDataForNew[0].id);
            }
        }
        catch (err) {

        }
    }

    useEffect(() => {
        getAllModels(makeID)
    }, [makeID])

    const getStockDetails = async () => {
        let universal = isUniversalChecked ? 1 : 0;
        let details = [];
        try {
            if (universal == 0) {
                const { data } = await api.get(`${urls.getStockData}?itemID=${itemID}&categoryID=${categoryID}&isUniversal=0
                    &makeID=${makeID}&modelID=${modelID}`)
                if (data.resultStatus == "success") {
                    if (data.data.length == 0) {
                        showToast("Stock Not Found", "error");
                        return;
                    }
                    setStockData(data.data)
                    details = data.data;
                }
            }
            else {
                const { data } = await api.get(`${urls.getStockData}?itemID=${itemID}&categoryID=${categoryID}&isUniversal=${universal}`)
                if (data.resultStatus == "success") {
                    if (data.data.length == 0) {
                        showToast("Stock Not Found", "error");
                        return;
                    }
                    setStockData(data.data)
                    details = data.data;
                }
            }
            setQty(details[0].Quantity);
            setMrp(details[0].MRP);
            setBarCode(details[0].Barcode);
            setStockID(details[0].StockID);
            setPartNumber(details[0].PartNumber);
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleSave = async () => {
        try {
            const { data } = await api.put(`${urls.updateStock}?stockID=${Number(stockID)}&barCode=${barCode}&mrp=${parseFloat(mrp).toFixed(2)}&quantity=${Number(qty)}&partNumber=${partNumber}`);
            if (data.resultStatus == "success") {
                showToast("Stock updated", "success");
                handleReset();
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async () => {
        try {
            if (stockID != 0) {
                const { data } = await api.delete(`${urls.deleteStock}?stockID=${stockID}`)
                if (data.resultStatus === "success") {
                    showToast("Stock Deleted", "success")
                    handleReset();
                    setOpenDialog(false)

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

    const handleBarcodeSearch = async () => {
        setPartNumberSearch('')
        try {
            if (barCodeSearch === "") {
                showToast("Enter BarCode", "warning");
                return;
            }
            const { data } = await api.get(`${urls.stockDetailsByBarcode}?barCode=${barCodeSearch}`);
            if (data.resultStatus === "success") {
                if (data.data.length == 0) {
                    showToast(`Stock With BarCode ${barCodeSearch} Not Found`, "error");
                    return;
                }
                setStockData(data.data)
                const details = data.data;
                setQty(details[0].Quantity);
                setMrp(details[0].MRP);
                setBarCode(details[0].Barcode);
                setStockID(details[0].StockID);
                setPartNumber(details[0].PartNumber);
                setCategoryID(details[0].CategoryID);
                setItemName(details[0].Item);
                if (details[0].IsUniversal == 1) {
                    setIsUniversalChecked(true)
                }
                else {
                    setMakeID(details[0].MakeID);
                    setModelID(details[0].ModelID);
                    setIsUniversalChecked(false)
                }
            }
        }
        catch (err) {
            showToast("Soemthing went wrong", "error")
        }
    }

    const handlePartNumberSearch = async () => {
        try {
            setBarCodeSearch('');
            if (partNumberSearch === "") {
                showToast("Enter PartNumber", "warning");
                return;
            }
            const { data } = await api.get(`${urls.stockDetailsByPartNumber}?partNumber=${partNumberSearch}`);
            if (data.resultStatus === "success") {
                if (data.data.length == 0) {
                    showToast(`Stock With PartNumber ${partNumberSearch} Not Found`, "error");
                    return;
                }
                setStockData(data.data)
                const details = data.data;

                setQty(details[0].Quantity);
                setMrp(details[0].MRP);
                setBarCode(details[0].Barcode);
                setStockID(details[0].StockID);
                setPartNumber(details[0].PartNumber);
                setCategoryID(details[0].CategoryID);
                setItemName(details[0].Item);
                if (details[0].IsUniversal == 1) {
                    setIsUniversalChecked(true)
                }
                else {
                    setMakeID(details[0].MakeID);
                    setModelID(details[0].ModelID);
                    setIsUniversalChecked(false)
                }
            }
        }
        catch (err) {
            showToast("Soemthing went wrong", "error")
        }
    }

    const handleReset = () => {
        setItemName("");
        setItemID(0);
        setQty(0);
        setMrp(0);
        setBarCode('');
        setStockData([])
        setPartNumber('');
        setStockID(0);
        setBarCodeSearch('');
        setPartNumberSearch('');
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
                <Grid container direction={"row"} spacing={2}  >
                    <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
                        <Grid item>
                            <CustomFormLabel text={"Barcode"} />
                        </Grid>
                        <Grid item flex={1}>
                            <CustomTextFieldWithSearch value={barCodeSearch}
                                handleChange={(e) => setBarCodeSearch(e.target.value)} handleSearch={handleBarcodeSearch} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
                        <Grid item>
                            <CustomFormLabel text={"PartNumber"} />
                        </Grid>
                        <Grid item flex={1}>
                            <CustomTextFieldWithSearch value={partNumberSearch}
                                handleChange={(e) => setPartNumberSearch(e.target.value)} handleSearch={handlePartNumberSearch}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"Category"} />
                        <Grid item flex={1}>
                            <CustomDropDown value={categoryID}
                                handleChange={(e) => {

                                    setCategoryID(e.target.value)
                                    setItemName("")

                                }} options={categoryList} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"Item"} />
                        <Grid item flex={1}>
                            <CustomTextField value={itemName}
                                handleChange={(e) => setItemName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        getItems();
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 2 }} alignItems={"center"}>
                        <CustomFormLabel text={""} />
                        <Grid item flex={1} justifyContent={"flex-end"}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isUniversalChecked}
                                        onChange={handleCheckboxChange}
                                        name="singleCheckbox"
                                    />
                                }
                                label="Universal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 4 }} alignItems={"center"}>
                        <CustomFormLabel text={"Make"} />
                        <Grid item flex={1}>
                            <CustomDropDown options={newMakeList}
                                value={makeID} handleChange={(e) => setMakeID(e.target.value)}
                                disabled={isUniversalChecked}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"Model"} />
                        <Grid item flex={1}>
                            <CustomDropDown
                                disabled={isUniversalChecked}
                                options={modelList} value={modelID} handleChange={(e) => setModelID(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 12, lg: 12 }} alignItems={"center"} justifyContent={"flex-end"}>
                        <Button
                            type="button"
                            variant="contained"
                            sx={{
                                borderRadius: '30px',
                                textTransform: 'none',
                                padding: '8px 16px',
                                borderWidth: '1.5px',
                                height: "40px",
                                ml: 1,
                                mr: 1,
                            }}
                            onClick={getStockDetails}
                        >
                            Show
                        </Button>

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
                            onClick={handleReset}
                        >Clear</Button>
                    </Grid>
                </Grid>
                <TableContainer sx={{ maxHeight: 500, minHeight: 250, overflow: 'auto', mt: 1 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
                            <TableRow>

                                <TableCell>BarCode</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>MRP</TableCell>
                                <TableCell>PartNumber</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                stockData.length === 0 ? (
                                    <TableRow key={stockData.length}>
                                        <TableCell colSpan={14} align="center">No Data Available</TableCell>
                                    </TableRow>
                                ) : (

                                    <TableRow>

                                        <TableCell><CustomTextField value={barCode}
                                            handleChange={(e) => setBarCode(e.target.value)}
                                        /></TableCell>
                                        <TableCell><CustomTextField value={qty}
                                            handleChange={(e) => setQty(e.target.value)} /></TableCell>
                                        <TableCell><CustomTextField value={mrp}
                                            handleChange={(e) => setMrp(e.target.value)}
                                        /></TableCell>
                                        <TableCell><CustomTextField value={partNumber}
                                            handleChange={(e) => setPartNumber(e.target.value)}
                                        /></TableCell>
                                    </TableRow>

                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container size={{ md: 12, lg: 12 }} direction={"row"} alignItems={"center"} justifyContent={"center"}>

                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            borderRadius: '30px',
                            textTransform: 'none',
                            padding: '8px 16px',
                            borderWidth: '1.5px',
                            height: "40px",
                            ml: 1,
                            mr: 1,
                        }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>

                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            borderRadius: '30px',
                            textTransform: 'none',
                            padding: '8px 16px',
                            borderWidth: '1.5px',
                            height: "40px",
                            ml: 1,
                            mr: 1,
                        }}
                        onClick={() => setOpenDialog(true)}
                    >
                        Delete
                    </Button>

                </Grid>
            </Box>
            <ItemPopup
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                onSelect={handleSelect}
                items={itemList}
            />
            <ConfirmDialog
                open={openDialog}
                title="Delete Confirmation"
                message="Are you sure you want to delete this Stock?"
                onConfirm={handleDelete}
                onCancel={() => setOpenDialog(false)}
            />
        </Grid>
    );
}
export default StockEdit;