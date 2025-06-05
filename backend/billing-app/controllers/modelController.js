const { poolPromise, sql } = require('../config/db');

exports.getAllModels = async (req, res) => {
  try {
    const { modelName = '', makeID = 0 } = req.query;
    const pool = await poolPromise;
    const result = await pool
    .request()
    .input('modelName', modelName)
    .input('makeID', makeID)
    .execute('GetAllVehicleModels');
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
