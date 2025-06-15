// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const { poolPromise, sql } = require('../config/db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const pool = await poolPromise;
    const result = await pool.request()
      .input('token', sql.NVarChar, token)
      .query('SELECT * FROM Tokens WHERE Token = @token AND IsRevoked = 0 AND Expiry > GETDATE()');

    if (result.recordset.length === 0) {
      return res.status(403).json({ message: 'Token invalid or revoked' });
    }

    req.user = decoded; // Available in route
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token verification failed' });
  }
};

module.exports = authenticateToken;
