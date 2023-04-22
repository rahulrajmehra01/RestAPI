const express = require('express');
const router = express.Router();

const ProductController = require('../Controllers/Product.controller');

// getting list of all products
router.get('/', ProductController.getAllProducts);

// create product using promises
// router.post('/', ProductController.CreateProduct);

// create product using async await
router.post('/', ProductController.CreateNewProduct);                 // ('/') = localhost/products

// create many product using async await
router.post('/insertmany', ProductController.CreateManyProduct);      // ('/insertmany') = localhost/products/insertmany

// getting product by id
router.get('/:id', ProductController.findProductById);

// update product by id
router.patch('/:id', ProductController.UpdateProductById);

// delete product by id
router.delete('/:id', ProductController.DeleteProductById);          // ('/:id') = localhost/products/:id

module.exports = router;