const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());  // we can also use bodyparser, but as of Express latest version that middleware is already build inside express
app.use(express.urlencoded({extended: true})); // to use this - Content-Type: application/x-www-form-urlencoded

mongoose.connect(process.env.MONGODB_URL, 
{
    dbName:process.env.DB_NAME,
    user:process.env.DB_USER,
    pass:process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true
}
).then(() => {
    console.log('Mongodb connected....');
})
.catch(err => console.log(err.message));

const ProductRoute = require('./Routes/Product.route');
app.use('/products', ProductRoute);

// 404 handler and pass to error function
app.use((req, res, next) => {
    // const err = new Error('Not found');
    // err.status = 404;
    // next(err);
    next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('server is running at port ' + PORT + '...');
});