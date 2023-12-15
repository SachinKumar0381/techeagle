const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://sachinkumar:sachin0381kumar@cluster0.5cksotv.mongodb.net/masai?retryWrites=true&w=majority");

module.exports={connection};