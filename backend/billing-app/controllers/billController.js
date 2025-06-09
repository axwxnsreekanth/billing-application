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
        (BillDate, ReceivedAmount, PaymentMode, Labour, IndustrialCharge, Consumables, LatheWork, Technician, BilledBy) 
        VALUES (GETDATE(), @ReceivedAmount, @PaymentMode, @Labour, @IndustrialCharge, @Consumables, @LatheWork, @Technician, @BilledBy); 
        SELECT SCOPE_IDENTITY() AS BillID;
      `);

    const billId = result.recordset[0].BillID;

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
        .input('Barcode', sql.VarChar, item.barCode)
        .input('PartNumber', sql.VarChar, item.partNumber)
        .query(`
          INSERT INTO BILLEDITEMDETAILS 
          (BillID, StockID, ItemID, Item, CategoryID, Category, Quantity, Barcode, PartNumber) 
          VALUES (@BillID, @StockID, @ItemID, @Item, @CategoryID, @Category, @Quantity, @Barcode, @PartNumber)
        `);
    }

    await transaction.commit();
    res.send({ message: 'success'});

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
