const { poolPromise, sql } = require('../config/db');

exports.getAllItems = async (req, res) => {
  try {
    const { itemName = '',categoryID=0 } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('itemName', itemName)
      .input('categoryID', categoryID)
      .execute('GetAllItems');
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

exports.insertItem = async (req, res) => {
    const { itemName,categoryID} = req.body;
    try {
      const pool = await poolPromise;
      await pool
        .request()
        .input('ItemName', sql.VarChar, itemName)
        .input('CategoryID', sql.Int, categoryID)
        .query('INSERT INTO ITEM (ItemName, CategoryID) VALUES (@itemName, @categoryID)');
      res.send('Item inserted');
    } catch (err) {
      console.error(err);
      res.status(500).send('Insert failed');
    }
  };

  exports.checkDuplicate = async (req, res) => {
    const { itemName,categoryID } = req.query;
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input('itemName', sql.VarChar, itemName)
        .input('categoryID', sql.VarChar, categoryID)
        .query('SELECT COUNT(*) AS count FROM Item WHERE ItemName = @itemName AND CategoryID=@categoryID');
  
      const count = result.recordset[0].count;
      res.json({ exists: count > 0 });
    } catch (err) {
      console.error(err);
      res.status(500).send('Insert failed');
    }
  };
  