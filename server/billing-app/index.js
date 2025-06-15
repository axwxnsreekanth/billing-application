const cors = require('cors'); 
require('dotenv').config();
const express = require('express');
const authenticateToken = require('./middleware/authenticateToken'); // ✅ JWT middleware
const port = process.env.PORT || 3001;
const app = express();


app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/authRoutes'));

// ✅ Protect ALL routes globally
app.use(authenticateToken);

// Load routes
const makeRoutes = require('./routes/makeRoutes');
app.use('/makes', makeRoutes);

const modelRoutes = require('./routes/modelRoutes');
app.use('/models', modelRoutes);

const categoryRoutes = require('./routes/categoryRoutes');
app.use('/category', categoryRoutes);

const itemRoutes = require('./routes/itemRoutes');
app.use('/item', itemRoutes);

const stockRoutes = require('./routes/stockRoutes');
app.use('/stock', stockRoutes);

const billRoutes = require('./routes/billRoutes');
app.use('/bill', billRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/dashboard', dashboardRoutes);

// ✅ Add login route (public, before the global auth above in real setup)
// app.use('/auth', require('./routes/authRoutes')); // define this to allow login

// Optional: centralized error handling
// const errorHandler = require('./middlewares/errorHandler');
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});