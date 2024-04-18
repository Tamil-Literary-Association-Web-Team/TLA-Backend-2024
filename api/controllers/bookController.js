const Book = require("../models/bookModel");

const booksController = {
  getAllBooks: async (req, res, next) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = booksController;