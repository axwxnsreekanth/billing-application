const { poolPromise, sql } = require('../config/db');

exports.getAllMakes = async (req, res) => {
  try {
    const { make = '' } = req.query;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('make', make)
      .execute('GetAllVehicleMakes');
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

exports.insertMake = async (req, res) => {
  const { Make, Type } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('Make', sql.VarChar, Make)
      .input('Type', sql.Int, Type)
      .query('INSERT INTO VehicleMake (Make, Type) VALUES (@Make, @Type)');
    res.send('Make inserted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};

exports.checkDuplicateMake = async (req, res) => {
  const { Make } = req.query;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('Make', sql.VarChar, Make)
      .query('SELECT COUNT(*) AS count FROM VEHICLEMAKE WHERE MAKE = @Make');

    const count = result.recordset[0].count;
    res.json({ exists: count > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Insert failed');
  }
};
