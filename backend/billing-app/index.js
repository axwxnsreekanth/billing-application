const cors = require('cors'); 
require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 1433;

app.use(express.json());
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
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


// Optional: centralized error handling
// const errorHandler = require('./middlewares/errorHandler');
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
