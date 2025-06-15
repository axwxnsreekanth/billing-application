const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

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

    const token = jwt.sign({ userId: user.UserID }, JWT_SECRET);

    await pool.request()
      .input('userId', sql.Int, user.UserID)
      .input('token', sql.NVarChar, token)
      .query('INSERT INTO Tokens (UserID, Token, IsRevoked) VALUES (@userId, @token, 0)');


    res.json({ token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'No token provided' });

    const pool = await poolPromise;
    await pool.request()
      .input('token', sql.NVarChar, token)
      .query('UPDATE Tokens SET IsRevoked = 1 WHERE Token = @token');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Logout failed' });
  }
};
