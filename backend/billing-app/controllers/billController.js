const { poolPromise, sql } = require('../config/db');

exports.insertBillDetails = async (req, res) => {
  const { billData } = req.body;
  let transaction;

  try {
    const pool = await poolPromise;
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`; // e.g. 20250611
    const dateOnly = `${yyyy}-${mm}-${dd}`; // for matching DATE in SQL

    const request = new sql.Request(transaction);

    // Step 1: Check if today's index exists
    let indexResult = await request.query(`
      SELECT CurrentIndex FROM DailyInvoiceIndex WHERE InvoiceDate = '${dateOnly}'
    `);

    let currentIndex = 1;

    if (indexResult.recordset.length === 0) {
      // First bill of the day
      await request.query(`
        INSERT INTO DailyInvoiceIndex (InvoiceDate, CurrentIndex)
        VALUES ('${dateOnly}', 1)
      `);
    } else {
      // Increment the index
      currentIndex = indexResult.recordset[0].CurrentIndex + 1;
      await request.query(`
        UPDATE DailyInvoiceIndex 
        SET CurrentIndex = ${currentIndex}
        WHERE InvoiceDate = '${dateOnly}'
      `);
    }

    // Step 2: Generate Invoice Number (e.g. 20250611001)
    const paddedIndex = String(currentIndex).padStart(3, '0');
    const invoiceNo = `${dateStr}${paddedIndex}`;

    // Step 3: Insert into BillDetails
    const insertResult = await request
      .input('InvoiceNo', sql.BigInt, invoiceNo)
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
        (InvoiceNo, BillDate, TotalAmount, ReceivedAmount, PaymentMode, Labour, IndustrialCharge, Consumables, LatheWork, Technician, Customer)
        VALUES (@InvoiceNo, GETDATE(), @TotalAmount, @ReceivedAmount, @PaymentMode, @Labour, @IndustrialCharge, @Consumables, @LatheWork, @Technician, @Customer);
        SELECT SCOPE_IDENTITY() AS BillID;
      `);

    const billId = insertResult.recordset[0].BillID;

    // Step 4: Insert Items
    for (const item of billData.items) {
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
          (BillID, StockID, ItemID, Item, CategoryID, Category, Quantity, Amount, Barcode, PartNumber, Make, MakeID, Model, ModelID, IsUniversal) 
          VALUES (@BillID, @StockID, @ItemID, @Item, @CategoryID, @Category, @Quantity, @Amount, @Barcode, @PartNumber, @Make, @MakeID, @Model, @ModelID, @IsUniversal)
        `);
    }

    await transaction.commit();
    res.send({ message: 'success',invoice: invoiceNo });

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
    const { dateFrom, dateTo, paymentMode = 0 } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('FromDate', dateFrom)
      .input('ToDate', dateTo)
      .input('PaymentMode', paymentMode)
      .execute('GetBillingReports');

    // Extract raw JSON string (usually in the "" column key)
    const rawJson = result.recordset?.[0]?.BillReportsJson || '[]';

   

    // Convert to real JS array
    const parsed = JSON.parse(rawJson);

    res.status(200).json({
      resultStatus: 'success',
      data: parsed
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

exports.getLabourReport = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('FromDate', dateFrom)
      .input('ToDate', dateTo)
      .query('SELECT BILLDATE,TECHNICIAN,LABOUR FROM BILLDETAILS WHERE BILLDATE BETWEEN @FromDate AND @ToDate AND LABOUR!=0');

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