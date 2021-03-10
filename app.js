require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_HOST_COLLECTION, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));

app.use(express.json());

const companyRoutes = require('./routes/company');
app.use('/company', companyRoutes);

const customerRoutes = require('./routes/customer');
app.use('/customer', customerRoutes);

const productRoutes = require('./routes/product');
app.use('/product', productRoutes);

const salesRoutes = require('./routes/sales');
app.use('/sales', salesRoutes);

app.listen(3000, () => {
	console.log('server is on at port 3000');
});
