const { poolPromise, sql } = require('../config/db');

exports.insertBillDetails = async (req, res) => {
  const { billData } = req.body;
  let transaction;

  try {
    const pool = await poolPromise;
    transaction = new sql.Transaction(pool);

    await transaction.begin();

    const request = new sql.Request(transaction);
    const result = await request
      .input('TotalAmount', sql.Decimal(18, 2), billData.totalamount)
      .input('ReceivedAmount', sql.Decimal(18, 2), billData.amount)
      .input('PaymentMode', sql.Int, billData.paymentMode)
      .input('Labour', sql.Decimal(18, 2), billData.labour)
      .input('IndustrialCharge', sql.Decimal(18, 2), billData.industry)
      .input('Consumables', sql.Decimal(18, 2), billData.consumables)
      .input('LatheWork', sql.Decimal(18, 2), billData.lathework)
      .input('Technician', sql.VarChar, billData.technician)
      .input('Customer', sql.VarChar, billData.customer)
      .query(`
        INSERT INTO BILLDETAILS 
        (BillDate,TotalAmount, ReceivedAmount, PaymentMode, Labour, IndustrialCharge, Consumables, LatheWork, Technician, Customer) 
        VALUES (GETDATE(),@TotalAmount, @ReceivedAmount, @PaymentMode, @Labour, @IndustrialCharge, @Consumables, @LatheWork, @Technician, @Customer); 
        SELECT SCOPE_IDENTITY() AS BillID;
      `);

    const billId = result.recordset[0].BillID;

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`; // e.g. 20250806

    // 3. Generate InvoiceNo
    const invoiceNo = `${dateStr}${billId}`;

    const updateRequest = new sql.Request(transaction);
    await updateRequest.query(`UPDATE BILLDETAILS SET INVOICENO=${invoiceNo} WHERE BILLID=${billId}`);

    // Loop over billData.items array and insert each item
    for (const item of billData.items) {
      console.log("items",item)
      const itemRequest = new sql.Request(transaction);
      await itemRequest
        .input('BillID', sql.Int, billId)
        .input('StockID', sql.Int, item.stockID)
        .input('ItemID', sql.Int, item.itemID)
        .input('Item', sql.VarChar, item.item)
        .input('CategoryID', sql.Int, item.categoryID)
        .input('Category', sql.VarChar, item.category)
        .input('Quantity', sql.Int, item.quantity)
        .input('Amount', sql.Int, item.amount)
        .input('Barcode', sql.VarChar, item.barCode)
        .input('PartNumber', sql.VarChar, item.partNumber)
        .input('Make', sql.VarChar, item.make)
        .input('MakeID', sql.Int, item.makeid)
        .input('Model', sql.VarChar, item.model)
        .input('ModelID', sql.Int, item.modelid)
        .input('IsUniversal', sql.Int, item.isuniversal)
        .query(`
          INSERT INTO BILLEDITEMDETAILS 
          (BillID, StockID, ItemID, Item, CategoryID, Category, Quantity,Amount, Barcode, PartNumber,Make,MakeID,Model,ModelID,IsUniversal) 
          VALUES (@BillID, @StockID, @ItemID, @Item, @CategoryID, @Category, @Quantity,@Amount, @Barcode, @PartNumber,@Make,@MakeID,@Model,@ModelID,@IsUniversal)
        `);
    }

    await transaction.commit();
    res.send({ message: 'success' });

  } catch (err) {
    console.error(err);
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
      }
    }
    res.status(500).send('Insert failed');
  }
};


exports.getBillReport = async (req, res) => {
  try {
    const { dateFrom,dateTo,paymentMode=0 } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('FromDate', dateFrom)
      .input('ToDate', dateTo)
      .input('PaymentMode', paymentMode)
      .execute('GetBillingReports');
    res.status(200).json({
      resultStatus: 'success',
      data: result.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      resultStatus: 'error',
      message: 'Server error',
      error: err.message
    });
  }
};
