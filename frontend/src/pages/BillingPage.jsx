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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BillingScreen = () => {
  const { showToast } = useToast();
  const [isUniversalChecked, setIsUniversalChecked] = useState(false);
  const [categoryID, setCategoryID] = useState(0);
  const [category, setCategory] = useState([]);
  const [customer, setCustomer] = useState('');
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
    if (details == null || stockID == 0 || itemID == 0) {
      showToast("Enter Item", "error");
      return;
    }
    if (qty <= 0) {
      showToast("Enter Quantity", "error");
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
      categoryid: details.CategoryID,
      make: details.Make,
      makeid: details.MakeID,
      model: details.Model,
      modelid: details.ModelID,
      isuniversal: details.IsUniversal
    }
    newKart.push(temp)
    setKart(newKart);
    handleResetForNewItem();
  }

  const handleDeleteItem = (id) => {
    const newKart = kart.filter(item => item.stockid != id)
    setKart(newKart);
  }

  const findTotal = () => {
    let totalAmount = kart.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    setTotal(totalAmount);
  }

  useEffect(() => {
    findTotal();
  }, [kart])

  const findFinalAmount = () => {
    let sum = parseFloat(total) + parseFloat(labour) + parseFloat(industry) + parseFloat(consumables) + parseFloat(lathework);
    setFinalAmount(sum);
  }

  useEffect(() => {
    findFinalAmount();
  }, [total, labour, industry, consumables, lathework])

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

  const handlePartNumberSearch = async () => {
    setBarCodeSearch('')
    try {
      if (partNumberSearch === "") {
        showToast("Enter PartNumber", "warning");
        return;
      }
      const { data } = await api.get(`${urls.stockDetailsByPartNumberBilling}?partNumber=${partNumberSearch}`);
      if (data.resultStatus === "success") {
        if (data.data.length == 0) {
          showToast(`Stock With PartNumber ${partNumberSearch} Not Found`, "error");
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
        setBarCodeSearch(details[0].Barcode);
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


  const handleSave = async () => {
    if (kart.length == 0) {
      showToast("Enter Items", "error");
      return;
    }
    if (receivedAmount == 0) {
      showToast("Enter Received Amount", "error");
      return;
    }
    if (customer == "") {
      showToast("Enter Customer Name", "error");
      return;
    }
    if (parseFloat(finalAmount) < parseFloat(receivedAmount)) {
      showToast("Received Amount Is Greater Than Final Amount", "error");
      return;
    }
    if (parseFloat(labour) != 0 && technician == "") {
      showToast("Enter Technician", "error");
      return;
    }

    try {
      const billData = {
        amount: Number(receivedAmount),
        paymentMode: Number(paymentMode),
        labour: Number(labour),
        industry: Number(industry),
        consumables: Number(consumables),
        lathework: Number(lathework),
        technician: technician,
        customer: customer,
        totalamount: finalAmount,
        items: kart.map(item => ({
          stockID: Number(item.stockid),
          itemID: Number(item.itemid),
          item: item.itemname,
          categoryID: Number(item.categoryid),
          category: item.categoryname,
          quantity: Number(item.quantity),
          barCode: item.barcode,
          partNumber: item.partnumber,
          amount: Number(item.amount),
          make: item.make,
          makeid: Number(item.makeid),
          model: item.model,
          modelid: Number(item.modelid),
          isuniversal: Number(item.isuniversal)
        }))

      };
      const { data } = await api.post(urls.insertBillDetails, {
        billData: billData
      })
      if (data.message == "success") {
        showToast("Bill Saved");
        billData.invoiceNo = data.invoice;
        printBillPdf(billData);
        handleReset();
      }
    }
    catch (err) {
      showToast("Failed,Something went wrong", "error");
    }


  }



  const printBillPdf = (billDetails) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // ===== Outer Border =====
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 15, 190, 265); // x, y, width, height

    // ===== Header Section =====
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Abhis sadhanam', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Kaithakkal, Perambra', 105, 27, { align: 'center' });
    doc.text('Phone: 9169168008', 105, 34, { align: 'center' });

    // ===== Invoice Info =====
    const paymentModes = {
      1: 'Cash',
      2: 'UPI',
      3: 'Card',
    };

    doc.setFontSize(11);
    doc.text(`Invoice No: ${billDetails.invoiceNo}`, 14, 45);
    doc.text(`Date: ${currentDate}`, 160, 45);
    doc.text(`Customer: ${billDetails.customer}`, 14, 52);
    doc.text(`Payment Mode: ${paymentModes[billDetails.paymentMode] || 'N/A'}`, 14, 59);

    // ===== Table Content =====
    autoTable(doc, {
      head: [['Sl No', 'Item', 'Quantity', 'Price']],
      body: billDetails.items.map((item, index) => [
        index + 1,
        item.item,
        item.quantity,
        `${item.amount.toFixed(2)}`
      ]),
      startY: 66,
      margin: { left: 14, right: 14 },
      styles: {
        fontSize: 9.5,
        cellPadding: 3,
        halign: 'left',
        valign: 'middle',
        overflow: 'linebreak',
        lineWidth: 0.2,
        textColor: 20,
      },
      columnStyles: {
        0: { halign: 'left', cellWidth: 15 },
        1: { halign: 'left', cellWidth: 85 }, // reduced from 90
        2: { cellWidth: 30 },
        3: { cellWidth: 45 }, // reduced from 45
      },
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        fontStyle: 'bold',
      },
      theme: 'grid',
    });

    // ===== Summary Totals (aligned with Price column) =====
    const finalY = doc.lastAutoTable.finalY + 5;
    const priceColumn = doc.lastAutoTable?.table?.columns?.[3];
    const labelX = priceColumn ? priceColumn.x : 120;
    const valueX = priceColumn ? priceColumn.x + priceColumn.width : 160;
    let discount=parseFloat(billDetails.totalamount)-parseFloat(billDetails.amount);
    const summary = [
      { label: 'Labour', value: `${billDetails.labour.toFixed(2)}` },
      { label: 'Industrial', value: `${billDetails.industry.toFixed(2)}` },
      { label: 'Consumables', value: `${billDetails.consumables.toFixed(2)}` },
      { label: 'Lathework', value: `${billDetails.lathework.toFixed(2)}` },
      { label: 'Discount', value: `${discount.toFixed(2)}` },
      { label: 'TOTAL', value: `${billDetails.amount.toFixed(2)}`, bold: true },
    ];

    let y = finalY;
    summary.forEach(({ label, value, bold }) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.text(label, labelX, y);
      doc.text(value, valueX, y, { align: 'right' });
      y += 7;
    });

    // ===== Open in New Tab =====
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

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
    setCustomer('');
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
            <CustomTextFieldWithSearch value={partNumberSearch} handleChange={(e) => setPartNumberSearch(e.target.value)}
              handleSearch={handlePartNumberSearch} />
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
          onClick={handleResetForNewItem}
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
                  ₹{total}
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
            <CustomTextField value={labour} handleChange={(e) => setLabour(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Industrial Charge"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={industry} handleChange={(e) => setIndustry(e.target.value)} />
          </Grid>
        </Grid>


        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Consumables"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={consumables} handleChange={(e) => setConsumables(e.target.value)} />
          </Grid>
        </Grid>

        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Lathework"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={lathework} handleChange={(e) => setLathework(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Technician"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={technician} handleChange={(e) => setTechnician(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Customer"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={customer} handleChange={(e) => setCustomer(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Total Amount"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={finalAmount} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Received Amount"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField value={receivedAmount} handleChange={(e) => setReceivedAmount(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 3 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Payment Mode"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown value={paymentMode} options={paymentModes} handleChange={(e) => setPaymentMode(e.target.value)} />
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
      </Grid>
    </Box>

  );
};

export default BillingScreen;
