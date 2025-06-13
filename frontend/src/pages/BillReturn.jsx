import React, { useState, useEffect } from "react";
import { Box, Button, Grid, FormControlLabel, Checkbox, Table, TableContainer, TableRow, TableBody, TableHead, TableCell, Typography } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomTextFieldWithSearch, CustomQuantityTextField } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { ItemPopup } from "../components";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from "../components";


const BillReturn = () => {
    const { showToast } = useToast();
    const [isUniversalChecked, setIsUniversalChecked] = useState(false);
    const [billData, setBillData] = useState([]);
    const [category, setCategory] = useState([]);
    const [customer, setCustomer] = useState('');
    const [make, setMake] = useState(0);
    const [open, setOpen] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemID, setItemID] = useState(0);
    const [qoh, setQOH] = useState(0)
    const [mrp, setMrp] = useState(0)
    const [returnKart, setReturnKart] = useState([])
    const [model, setModel] = useState(0);
    const [qty, setQty] = useState(0)
    const [barCode, setBarCode] = useState('')
    const [partNumber, setPartNumber] = useState('')
    const [invoiceNo, setInvoiceNo] = useState('')
    const [partNumberSearch, setPartNumberSearch] = useState('')
    const [stockData, setStockData] = useState([]);
    const [stockID, setStockID] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [labour, setLabour] = useState(0);
    const [industry, setIndustry] = useState(0);
    const [consumables, setConsumables] = useState(0);
    const [lathework, setLathework] = useState(0);
    const [technician, setTechnician] = useState('');
    const [billedBy, setBilledBy] = useState('');
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [total, setTotal] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const [kart, setKart] = useState([]);
    const paymentModes = [
        { id: 1, description: "Cash" }, { id: 2, description: "UPI" }
    ]
    const [paymentMode, setPaymentMode] = useState(1);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const fetchDate = async () => {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            setCurrentDate(formattedDate);
        };
        fetchDate();
    }, []);


    const handleAddClick = (details) => {
        const newKart = [...returnKart];
        const temp = {
            id: details.ID,
            item: details.Item,
            category: details.Category,
            amount: details.Amount,
            quantity: details.Quantity,
            barcode: details.Barcode,
        }
        newKart.push(temp)
        setReturnKart(newKart);
        handleDeleteItem(details.ID);
    }

    const handleDeleteItem = (id) => {
        const newKart = kart.filter(item => item.ID!= id)
        setKart(newKart);
    }


    const handleSearch = async () => {
        try {
            if (invoiceNo === 0) {
                showToast("Enter InvoiceNo", "warning");
                return;
            }
            const { data } = await api.get(`${urls.getBillDetailsByInvoiceNo}?invoiceNo=${parseInt(invoiceNo)}`);
            if (data.resultStatus === "success") {
                if (data.data.length == 0) {
                    showToast(`Bill With Invoice ${invoiceNo} Not Found`, "error");
                    return;
                }
                setKart(data.data[0].Items)
               setBillData(data.data[0]);
            }
        }
        catch (err) {
            showToast("Something went wrong", "error")
        }
    }



      const handleSave = async () => {
        if (returnKart.length == 0) {
          showToast("Enter Items", "error");
          return;
        }
        let returnBill={};
        if(returnKart.length==billData.Items.length){
            returnBill.billID=billData.BillID;
            returnBill.fullReturn=1;
        }
        else{
            returnBill.billID=returnKart.map((item)=>({
                id:item.id,
                billid:billData.BillID
            }))
            returnBill.fullReturn=0;
        }
        try{
            const {data}=await api.put(urls.saveBillReturn,{billData:returnBill})
            if(data.resultStatus=="success"){
                showToast("Bill Saved","success")
                handleReset();
            }
            else{
                showToast("Failed to save","error")
            }
        }
        catch(err){
            showToast("Failed to save","error")
        }
      }


    const handleReset = () => {
        setStockData([]);
        setLabour(0);
        setIndustry(0);
        setConsumables(0);
        setTechnician('');
        setBilledBy('');
        setPaymentMode(1);
        setLathework(0);
        setReceivedAmount(0);
        setKart([]);
        setReturnKart([]);
        setCustomer('');
        setInvoiceNo('');
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
                        <CustomFormLabel text={"InvoiceNo"} />
                    </Grid>
                    <Grid item flex={1}>
                        <CustomTextFieldWithSearch value={invoiceNo} handleChange={(e) => setInvoiceNo(e.target.value)}
                            handleSearch={handleSearch} />
                    </Grid>
                </Grid>
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
                                        <TableCell>{details.Item}</TableCell>
                                        <TableCell>{details.Category}</TableCell>
                                        <TableCell>{details.Quantity}</TableCell>
                                        <TableCell>{details.Amount}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleAddClick(details)}>
                                                <AddIcon color="error" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'deepskyblue' }}>
                Returned List
            </Typography>
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
                            returnKart.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No Item Added</TableCell>
                                </TableRow>
                            ) : (
                                returnKart.map((details, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{details.item}</TableCell>
                                        <TableCell>{details.category}</TableCell>
                                        <TableCell>{details.quantity}</TableCell>
                                        <TableCell>{details.amount}</TableCell>
                                    </TableRow>
                                ))
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
                    onClick={handleReset}
                >
                    Cancel
                </Button>

            </Grid>

        </Box>

    );
};

export default BillReturn;
