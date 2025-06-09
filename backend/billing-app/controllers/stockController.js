const { poolPromise, sql } = require('../config/db');

exports.insertStock = async (req, res) => {
    const { StockData } = req.body;
    try {
        const pool = await poolPromise;
        const request = pool.request();
        request
            .input('ItemID', sql.Int, StockData.itemID)
            .input('ItemName', sql.VarChar, StockData.itemName)
            .input('CategoryID', sql.Int, StockData.categoryID)
            .input('Quantity', sql.Int, StockData.quantity)
            .input('MRP', sql.Decimal(18, 2), StockData.mrp)
            .input('Barcode', sql.VarChar, StockData.barCode)
            .input('isUniversal', sql.Int, StockData.isUniversal)
            .input('PartNumber', sql.VarChar, StockData.partNumber);

        // Conditionally handle makeID and modelID
        if (StockData.makeID !== 0) {
            request.input('makeID', sql.Int, StockData.makeID);
            request.input('modelID', sql.Int, StockData.modelID);
            await request.query('INSERT INTO STOCKDETAILS (ItemID,Item,CategoryID,Quantity,MRP,Barcode,PartNumber,makeID,modelID,isUniversal) VALUES (@ItemID,@ItemName,@CategoryID,@Quantity,@MRP,@Barcode,@PartNumber,@makeID,@modelID,@isUniversal )');
        }
        else {
            await request.query('INSERT INTO STOCKDETAILS (ItemID,Item,CategoryID,Quantity,MRP,Barcode,PartNumber,isUniversal) VALUES (@ItemID,@ItemName,@CategoryID,@Quantity,@MRP,@Barcode,@PartNumber,@isUniversal )');

        }
        res.send('Stock inserted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Insert failed');
    }
};
exports.getStockDetails = async (req, res) => {
    try {
        const { itemID, categoryID, isUniversal, makeID = null, modelID = null } = req.query;
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('ItemID', sql.Int, itemID)
            .input('categoryID', sql.Int, categoryID)
            .input('isUniversal', sql.Int, isUniversal)
            .input('makeID', sql.Int, makeID)
            .input('modelID', sql.Int, modelID)
            .execute('GetStockDetails');
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

exports.updateStockDetails = async (req, res) => {
    try {
        const { stockID, barCode, mrp, quantity,partNumber } = req.query;
        // Validation (Optional but recommended)
        if (!stockID) {
            return res.status(400).json({ resultStatus: 'error', message: 'stockID is required' });
        }

        const pool = await poolPromise;
        await pool
            .request()
            .input('stockID', sql.Int, stockID)
            .input('BarCode', sql.VarChar(50), barCode) 
            .input('MRP', sql.Decimal(18, 2), mrp )
            .input('Quantity', sql.Int, quantity)
            .input('PartNumber', sql.VarChar(50), partNumber) 
            .query(`
        UPDATE StockDetails
        SET 
          BarCode = @BarCode,
          MRP = @MRP,
          Quantity = @Quantity,
          PartNumber=@PartNumber
        WHERE StockID = @stockID
      `);

        res.status(200).json({ resultStatus: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            resultStatus: 'error',
            message: 'Server error',
            error: err.message
        });
    }
};

exports.deleteStock = async (req, res) => {
    try {
        const { stockID } = req.query;
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('stockID', sql.Int, stockID)
            .query('DELETE FROM STOCKDETAILS WHERE STOCKID=@stockID');
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

exports.getStockDetailsByBarcode = async (req, res) => {
    try {
        const {barCode } = req.query;
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('barCode', sql.VarChar, barCode)
            .query('SELECT * FROM STOCKDETAILS WHERE BARCODE=@barCode');
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

exports.getStockDetailsByPartNumber = async (req, res) => {
    try {
        const {partNumber } = req.query;
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('partNumber', sql.VarChar, partNumber)
            .query('SELECT * FROM STOCKDETAILS WHERE PARTNUMBER=@partNumber');
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