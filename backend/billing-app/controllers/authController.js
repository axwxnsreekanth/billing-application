const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1m';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const pool = await poolPromise;

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.UserID }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const now = new Date();
    let expiry = new Date(Date.now() + 1 * 60 * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.log("Now:     ", now.toISOString());
    console.log("Expiry:  ", expiry);


   // const expiry = new Date(Date.now() + 1 * 60 * 1000).toISOString();
    // ISO format works better with SQL datetime


    await pool.request()
      .input('userId', sql.Int, user.UserID)
      .input('token', sql.NVarChar, token)
      .input('expiry', sql.DateTime, expiry)
      .query('INSERT INTO Tokens (UserID, Token, Expiry) VALUES (@userId, @token, @expiry)');

    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
