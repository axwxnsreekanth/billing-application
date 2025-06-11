const { poolPromise, sql } = require('../config/db');

exports.getRecentSales = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query('SELECT TOP 2 * FROM BILLDETAILS ORDER BY INVOICENO DESC');
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

exports.getZeroStock = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query('SELECT * FROM STOCKDETAILS WHERE QUANTITY=0');
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