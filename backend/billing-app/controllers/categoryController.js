const { poolPromise, sql } = require('../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const { category = '' } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('category', category)
      .execute('GetAllVehicleCategory');
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

exports.insertCategory = async (req, res) => {
  const { Category } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('Category', sql.VarChar, Category)
      .query('INSERT INTO CATEGORY (Name, Type) VALUES (@Category, 1)');
    res.send('Category inserted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};

exports.checkDuplicate = async (req, res) => {
  const { Category } = req.query;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Category', sql.VarChar, Category)
      .query('SELECT COUNT(*) AS count FROM Category WHERE NAME = @Category');

    const count = result.recordset[0].count;
    res.json({ exists: count > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};

exports.updateCategory = async (req, res) => {
  const { id, Name } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ resultStatus: 'error', message: 'ID required' });
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('Name', sql.VarChar, Name)
      .query('UPDATE CATEGORY SET NAME=@Name WHERE ID=@id');
    res.status(200).send('Category updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ resultStatus: 'error', message: 'ID required' });
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM CATEGORY WHERE ID=@id');
    res.send('Category deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Deletion failed');
  }
};