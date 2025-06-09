import React, { useState, useEffect } from "react";
import { Box, Button, Grid, FormControlLabel, Checkbox, Table, TableContainer, TableRow, TableBody, TableHead, TableCell, TableFooter } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomTextFieldWithSearch, CustomQuantityTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { ItemPopup } from "../components";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog } from "../components";

const BillingScreen = () => {
  const { showToast } = useToast();
  const [isUniversalChecked, setIsUniversalChecked] = useState(false);
  const [categoryID, setCategoryID] = useState(0);
  const [category, setCategory] = useState([]);
  const [newMakeList, setNewMakeList] = useState([]);
  const [make, setMake] = useState(0);
  const [open, setOpen] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemID, setItemID] = useState(0);
  const [qoh, setQOH] = useState(0)
  const [mrp, setMrp] = useState(0)
  const [modelList, setModelList] = useState([])
  const [model, setModel] = useState(0);
  const [qty, setQty] = useState(0)
  const [barCode, setBarCode] = useState('')
  const [partNumber, setPartNumber] = useState('')
  const [barCodeSearch, setBarCodeSearch] = useState('')
  const [partNumberSearch, setPartNumberSearch] = useState('')
  const [stockData, setStockData] = useState([]);
  const [stockID, setStockID] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [kart, setKart] = useState([]);
  const handleCheckboxChange = (event) => {
    setIsUniversalChecked(event.target.checked);
  };


  const handleAddClick = (details) => {
    if (details == null || stockID == 0 || itemID == 0) {
      showToast("Enter Item", "error");
      return;
    }
    if (details.Quantity == 0) {
      showToast("No Stock Available", "error");
      return;
    }
    if (parseFloat(details.Quantity) < parseFloat(qty)) {
      showToast("Invalid Quantity", "error");
      return;
    }
    const newKart = [...kart];
    const temp = {
      stockid: details.StockID,
      itemid: details.ItemID,
      itemname: details.Item,
      categoryname: details.Category,
      amount: parseFloat(details.MRP) * parseFloat(qty),
      quantity: qty,
      barcode: details.Barcode,
      partnumber: details.PartNumber,
      categoryid: details.CategoryID
    }
    newKart.push(temp)
    setKart(newKart);
    handleResetForNewItem();
  }

  const handleDeleteItem = (id) => {
    const newKart = kart.filter(item => item.stockid != id)
    setKart(newKart);
  }

  const handleResetForNewItem = () => {
    setBarCodeSearch('');
    setPartNumberSearch('');
    setCategory('');
    setItemName('');
    setQOH('');
    setQty('');
    setMrp('');
    setMake('');
    setModel('');
    setStockID(0);
    setItemID(0);
    setIsUniversalChecked(false);
  }

  const handleBarcodeSearch = async () => {
    setPartNumberSearch('')
    try {
      if (barCodeSearch === "") {
        showToast("Enter BarCode", "warning");
        return;
      }
      const { data } = await api.get(`${urls.stockDetailsByBarcodeBilling}?barCode=${barCodeSearch}`);
      if (data.resultStatus === "success") {
        if (data.data.length == 0) {
          showToast(`Stock With BarCode ${barCodeSearch} Not Found`, "error");
          return;
        }
        setStockData(data.data[0])
        const details = data.data;
        setQOH(details[0].Quantity);
        setMrp(details[0].MRP);
        setBarCode(details[0].Barcode);
        setStockID(details[0].StockID);
        setPartNumber(details[0].PartNumber);
        setItemName(details[0].Item);
        setItemID(details[0].ItemID);
        setCategory(details[0].Category);
        setPartNumberSearch(details[0].PartNumber);
        if (details[0].IsUniversal == 1) {
          setIsUniversalChecked(true)
        }
        else {
          setMake(details[0].Make);
          setModel(details[0].Model);
          setIsUniversalChecked(false)
        }
      }
    }
    catch (err) {
      showToast("Something went wrong", "error")
    }
  }

  return (
    <Box
      sx={{
        borderRadius: 4,
        p: 3,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        height: "100%"
      }}
    >
      <Grid container direction="row" spacing={1} padding={1}>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Barcode"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextFieldWithSearch value={barCodeSearch} handleChange={(e) => setBarCodeSearch(e.target.value)}
              handleSearch={handleBarcodeSearch} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"PartNumber"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextFieldWithSearch value={partNumberSearch} handleChange={(e) => setPartNumberSearch(e.target.value)} />
          </Grid>
        </Grid>

        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Category"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={category} />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
          <CustomFormLabel text={"Item"} />
          <Grid item flex={1}>
            <CustomTextField value={itemName}
            />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
          <CustomFormLabel text={"QOH"} />
          <Grid item flex={1}>
            <CustomTextField value={qoh} />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
          <CustomFormLabel text={"Quantity"} />
          <Grid item flex={1}>
            <CustomTextField value={qty} handleChange={(e) => setQty(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"}>
          <CustomFormLabel text={"MRP"} />
          <Grid item flex={1}>
            <CustomTextField value={mrp} />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 3 }} alignItems={"center"} justifyContent={"flex-end"}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isUniversalChecked}
                name="singleCheckbox"
              />
            }
            label="Universal"
          />

        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Make"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={make} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Model"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={model} />
          </Grid>
        </Grid>
      </Grid>
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
          onClick={() => handleAddClick(stockData)}
        >
          Add
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
          onClick={() => handleResetForNewItem}
        >
          Clear
        </Button>

      </Grid>
      <TableContainer sx={{ maxHeight: 500, minHeight: 150, overflow: 'auto', mt: 1 }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#F9F9F9' }}>
            <TableRow>
              <TableCell sx={{ width: "15%" }}>Sl No</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell sx={{ width: "5%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              kart.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No Item Added</TableCell>
                </TableRow>
              ) : (
                kart.map((details, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{details.itemname}</TableCell>
                    <TableCell>{details.categoryname}</TableCell>
                    <TableCell>{details.quantity}</TableCell>
                    <TableCell>{details.amount}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDeleteItem(details.stockid)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )
            }
          </TableBody>

          {/* Table Footer */}
          {kart.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  ₹{kart.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>

      <Grid container direction="row" spacing={1} marginTop={1}>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Labour"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Industrial Charge"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>


        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Consumables"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>

        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Lathework"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Technician"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Billed By"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Received Amount"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Payment Mode"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField />
          </Grid>
        </Grid>
        <Grid container size={{ md: 12, lg: 6 }} direction={"row"} alignItems={"center"} justifyContent={"flex-end"}>

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
           
          >
            Cancel
          </Button>

        </Grid>
      </Grid>
    </Box>

  );
};

export default BillingScreen;
