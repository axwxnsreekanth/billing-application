const { poolPromise, sql } = require('../config/db');

exports.getAllItems = async (req, res) => {
  try {
    const { itemName = '',categoryID=0 } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('item', itemName)
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
        .query('INSERT INTO ITEM (Item, CategoryID) VALUES (@itemName, @categoryID)');
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
        .query('SELECT COUNT(*) AS count FROM Item WHERE Item = @itemName AND CategoryID=@categoryID');
  
      const count = result.recordset[0].count;
      res.json({ exists: count > 0 });
    } catch (err) {
      console.error(err);
      res.status(500).send('Insert failed');
    }
  };
  

  exports.updateItem = async (req, res) => {
  const { id, name,categoryID } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ resultStatus: 'error', message: 'ID required' });
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('categoryID', sql.Int, categoryID)
      .query('UPDATE ITEM SET ITEM=@name,CATEGORYID=@categoryID WHERE ITEMID=@id');
    res.status(200).send('Item updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ resultStatus: 'error', message: 'ID required' });
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ITEM WHERE ITEMID=@id');
    res.send('Item deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Delete failed');
  }
};