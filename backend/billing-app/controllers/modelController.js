const { poolPromise, sql } = require('../config/db');

exports.getAllModels = async (req, res) => {
  try {
    const { modelName = '', makeID = 0 } = req.query;
    const pool = await poolPromise;
    const result = await pool
    .request()
    .input('model', modelName)
    .input('makeID', makeID)
    .execute('GetAllModels');
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

exports.checkDuplicateModel = async (req, res) => {
  const { Model,MakeID } = req.query;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Model', sql.VarChar, Model)
      .input('MakeID', sql.Int, MakeID)
      .query('SELECT COUNT(*) AS count FROM VEHICLEMODEL WHERE MODEL=@Model AND MAKEID = @MakeID');

    const count = result.recordset[0].count;
    res.json({ exists: count > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};

exports.insertModel = async (req, res) => {
  const { Model, MakeID } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('Model', sql.VarChar, Model)
      .input('MakeID', sql.Int, MakeID)
      .query('INSERT INTO VehicleModel (Model, MakeID) VALUES (@Model, @MakeID)');
    res.send('Make inserted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};

exports.updateModel = async (req, res) => {
  const { id, Model,MakeID } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ resultStatus: 'error', message: 'ID required' });
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('Model', sql.VarChar, Model)
      .input('MakeID', sql.Int, MakeID)
      .query('UPDATE VEHICLEMODEL SET Model=@Model,MakeID=@MakeID WHERE MODELID=@id');
    res.status(200).send('Model updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
};

exports.deleteModel = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ resultStatus: 'error', message: 'ID required' });
    }
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM VEHICLEMODEL WHERE MODELID=@id');
    res.send('Model deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};