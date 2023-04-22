const createError = require('http-errors');
const mongoose  = require('mongoose');

const Product = require('../Models/Product.model');

module.exports = {

    getAllProducts : async(req, res, next) => {
        try{
            const results = await Product.find({}, {__v: 0});
            // const results = await Product.find({}, {name: 1, _id: 0, price: 1});
            // const results = await Product.find({price: 4999}, {__v: 0});
            res.send(results);
        }catch(error){
            console.log(error.message);
        }
    },

    CreateNewProduct: async(req, res, next) => {
        try{
            const product = new Product(req.body);
            const result = await product.save();
            res.send(result)
        }catch (error){
            console.log(error.message);
            if(error.name === 'ValidationError'){
                return next(createError(422, error.message));
            }
            next(error);
        }
    },

    // create product using promises
    // CreateProduct: (req, res, next) => {
    //     console.log(req.body);
    //     const product = new Product({
    //         name: req.body.name,
    //         price: req.body.price
    //     })
    //     product.save()
    //      .then(result => {
    //         console.log(result);
    //         res.send(result);
    //      })
    //      .catch(err => {
    //         console.log(err.message);
    //      })
    // },

    CreateManyProduct: async (req, res, next) => {
        try {
          const product = req.body.map(product => new Product(product));
          const result = await Product.insertMany(product);
          res.send(result);
        } catch (error) {
          console.log(error.message);
          if(error.name === 'ValidationError'){
            return next(createError(422, error.message));
        }
        next(error);
        }
    },

    findProductById: async(req, res, next) => {
        const id = req.params.id;
        try{
            const product = await Product.findById(id, {__v:0});
            // const product  = await Product.findOne({_id: id}, {__v: 0});
            if(!product){
                throw createError(404, 'Product does not exist');
            }
            res.send(product);
        }catch(error){
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                next(createError(400, "Invalid Product id"));
                return;
            }
            next(error);
        }
    },

    UpdateProductById: async(req, res, next) => {
        try{
           const id = req.params.id;
           const updates = req.body;
           const options = {new: true};
           const result = await Product.findByIdAndUpdate(id, updates, options);
           if(!result){
            throw createError(404, 'Product does not exist');
        }
           res.send(result);
        }
        catch(error){
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                return next(createError(400, "Invalid Product id"));
            }
            next(error);
        }
    },

    DeleteProductById: async (req, res, next) => {
        const id = req.params.id;
        try{
            const result = await Product.findByIdAndDelete(id);
            console.log(result);
            if(!result){
                throw createError(404, 'Product does not exist');
            }
            res.send(result);
        }catch(error){
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                next(createError(400, "Invalid Product id"));
                return;
            }
            next(error);
        }
    }
};