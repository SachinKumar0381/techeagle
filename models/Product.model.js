const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String
});

const ProductModel = mongoose.model("item",productSchema);

module.exports = ProductModel;