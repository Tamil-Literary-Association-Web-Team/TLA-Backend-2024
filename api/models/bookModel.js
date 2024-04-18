"use strict";
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    img:{
        type: String,
        required: true,
    },
    pdfUrl:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    isTlaBook:{
        type:Boolean,
        required:true
    }
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
