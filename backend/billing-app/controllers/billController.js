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
      .input('BilledBy', sql.VarChar, billData.billedBy)
      .query(`
        INSERT INTO BILLDETAILS 
        (BillDate,TotalAmount, ReceivedAmount, PaymentMode, Labour, IndustrialCharge, Consumables, LatheWork, Technician, BilledBy,Invoiceno,IsDeleted) 
        VALUES (GETDATE(),@TotalAmount, @ReceivedAmount, @PaymentMode, @Labour, @IndustrialCharge, @Consumables, @LatheWork, @Technician, @BilledBy,1,0); 
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
        .query(`
          INSERT INTO BILLEDITEMDETAILS 
          (BillID, StockID, ItemID, Item, CategoryID, Category, Quantity,Amount, Barcode, PartNumber,IsDeleted) 
          VALUES (@BillID, @StockID, @ItemID, @Item, @CategoryID, @Category, @Quantity,@Amount, @Barcode, @PartNumber,0)
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
