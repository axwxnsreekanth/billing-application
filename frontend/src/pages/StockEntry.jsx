import  { useEffect, useState } from "react";
import {
    Box, Grid, Button, FormControlLabel
    , Checkbox
} from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomPriceTextField, CustomQuantityTextField } from '../components'
import { ItemPopup } from "../components";
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { useAuth } from "../context/authContext";
const StockEntry = () => {
    const { showToast } = useToast();
    const { logout } = useAuth();
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

    const handleCheckboxChange = (event) => {
        setIsUniversalChecked(event.target.checked);

    };
    const handleSelect = (item) => {
        setItemName(item.Item)
        setItemID(item.ItemID);
        setOpen(false);
    }
    useEffect(() => {
        getCategoryList();
        fetchMakes();
    }, [])

    const getItems = async () => {
        try {
            const { data } = await api.get(`${urls.getAllItems}?itemName=${itemName}&categoryID=${categoryID}`)
            if (data.resultStatus == 'success') {
                setItemList(data.data);
                setOpen(true)
            }
        }
        catch (err) {
            if (err.response.status == 403) {
                logout();
            }
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
            if (err.response.status == 403) {
                logout();
            }
            showToast("Failed,Something went wrong", "error");
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
            if (err.response.status == 403) {
                logout();
            }
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
            if (err.response.status == 403) {
                logout();
            }
        }
    }

    useEffect(() => {
        getAllModels(makeID)
    }, [makeID])

    const handleSave = async () => {
        if (Number(itemID) == 0) {
            showToast("Select Item", "error");
            return;
        }
        if (qty == 0) {
            showToast("Enter Quantity", "error");
            return;
        }
        if (Number(mrp) == 0) {
            showToast("Enter MRP", "error");
            return;
        }
        if (barCode == "") {
            showToast("Enter Barcode", "error");
            return;
        }
        try {
            const { data: bcExists } = await api.get(`${urls.checkDuplicateBarcode}?barcode=${barCode}`)
            if (bcExists.resultStatus == "success") {
                if (bcExists.exists) {
                    showToast("Barcode Already Exists", "error");
                    return;
                }
            }
            if (partNumber != "") {
                const { data: pnExists } = await api.get(`${urls.checkDuplicatePartNumber}?partNumber=${partNumber}`)
                if (pnExists.resultStatus == "success") {
                    if (pnExists.exists) {
                        showToast("PartNumber Already Exists", "error");
                        return;
                    }
                }
            }
            const StockData = {
                itemID: Number(itemID),
                itemName: itemName,
                categoryID: Number(categoryID),
                quantity: Number(qty),
                mrp: parseFloat(mrp).toFixed(2),
                barCode: barCode || "",
                makeID: isUniversalChecked ? 0 : Number(makeID),
                modelID: isUniversalChecked ? 0 : Number(modelID),
                isUniversal: isUniversalChecked ? 1 : 0,
                partNumber: partNumber
            }

            const { data } = await api.post(urls.insertStock, {
                StockData: StockData
            })
            if (data == "Stock inserted") {
                showToast("Stock Added", "success")
                handleReset();
            }
            else {
                showToast("Error Occured", "error")
            }
        }
        catch (err) {
            if (err.response.status == 403) {
                logout();
            }
            showToast("Error Occured", "error")

        }

    }

    const handleReset = () => {
        setItemName("");
        setItemID(0);
        setQty(0);
        setMrp(0);
        setBarCode('');
        setPartNumber('');
    }

    return (
        <Grid container height="100%" direction={"column"} spacing={1} padding={1}>
            <Box
                sx={{
                    borderRadius: 4,
                    p: 3,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    height: "90%",
                    width: "100%"
                }}
            >
                <Grid container direction={"row"} spacing={2}  >
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
                                placeholder={"Press Enter To List Items......"}
                                handleChange={(e) => setItemName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        getItems();
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
                        <CustomFormLabel text={"Quantity"} />
                        <Grid item flex={1}>
                            <CustomQuantityTextField value={qty} handleChange={(e) => setQty(e.target.value)} />
                        </Grid>
                    </Grid>   <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
                        <CustomFormLabel text={"MRP"} />
                        <Grid item flex={1}>
                            <CustomPriceTextField value={mrp} handleChange={(e) => setMrp(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"Barcode"} />
                        <Grid item flex={1}>
                            <CustomTextField value={barCode} handleChange={(e) => setBarCode(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
                        <CustomFormLabel text={"PartNumber"} />
                        <Grid item flex={1}>
                            <CustomTextField value={partNumber} handleChange={(e) => setPartNumber(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
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
                    <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
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
                            onClick={handleSave}
                        >
                            Save
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
            </Box>
            <ItemPopup
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                onSelect={handleSelect}
                items={itemList}
            />
        </Grid>
    );
}
export default StockEntry;