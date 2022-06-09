const express = require("express");
const { request } = require("http");
const Joi = require("joi");
const books = require("../models/books");
const router = express.Router();

const schema = Joi.object({
  author: Joi.string().min(3).max(30).required().messages({
    "any.required": "author should be provided",
    "string.base": "author should be type 'string'"
  }),
  title: Joi.string().min(3).max(30).required().messages({
    "any.required": "title should be provided",
    "string.base": "title should be type 'string'",
    "string.min": "title length must be at least 3 characters long"
  }),
  isbn: Joi.string().min(3).max(30).required().messages({
    "any.required": "isbn should be there"
  }),
  stock: Joi.number().min(1).required().messages({
    "any.required": "stock should be there",
    "number.base": "stock should be atleast one"
  })
});

const Updateschema = Joi.object({
  author: Joi.string().min(3).max(30).optional().messages({
    "string.base": "title should be type 'string'"
  }),
  title: Joi.string().min(3).max(30).optional().messages({
    "string.base": "title should be type 'string'"
  }),
  isbn: Joi.string().min(3).max(30).optional().messages({
    "string.base": "isbn should be type 'string'"
  }),
  stock: Joi.number().min(1).optional().messages({
    "number.base": "stock should be atleast one"
  })
});

// create a book
router.post("/", async (req, res, next) => {
  try {
    const body = await schema.validateAsync(req.body);

    const p = await books.findOne({ isbn: req.body.isbn });
    if (p) {
      throw Error("Isbn should be different");
    }
    const bookavailable = await books.findOne({ isbn: req.body.isbn });

    if (bookavailable) {
      var responseBook = {
        author: bookavailable.author,
        title: bookavailable.title,
        isbn: bookavailable.isbn,
        stock: bookavailable.stock + req.body.stock,
        id: bookavailable._id.toString()
      };
      res.status(201).send(responseBook);
    }

    const book = await books.create(req.body);
    var responseBook = {
      author: book.author,
      title: book.title,
      isbn: book.isbn,
      stock: book.stock,
      id: book._id.toString()
    };
    res.status(201).send(responseBook);
  } catch (err) {
    res.status(400).send({ message: err.message });
    //next(err);
  }
});

// increase stock of the book
router.post("/increase", async (req, res, next) => {
  try {
    const b = await schema.validateAsync(req.body);

    const book_available = await books.findOne({ isbn: req.body.isbn });
    if (!book_available) {
      throw Error("No Book avilable");
    }

    const resbook = {
      author: book_available.author,
      title: book_available.title,
      isbn: book_available.isbn,
      stock: book_available.stock + req.body.stock,
      id: book_available._id.toString()
    };
    res.status(200).send(resbook);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// get all books
router.get("/", async (req, res, next) => {
  try {
    let condition = {};
    if (req.query.author) {
      condition["author"] = req.query.author;
    }
    if (req.query.title) {
      condition["title"] = req.query.title;
    }
    if (req.query.isbn) {
      condition["isbn"] = req.query.isbn;
    }
    if (req.query.stock) {
      condition["stock"] = req.query.stock;
    }
    //console.log(JSON.stringify(condition));
    const book = await books.find(condition);
    if (!book) {
      throw Error("Invalid conditions");
    }
    //console.log(book + " heyy");

    const Book = await book.map((b) => {
      return {
        author: b.author,
        title: b.title,
        isbn: b.isbn,
        stock: b.stock,
        id: b._id.toString()
      };
    });

    res.status(200).json(Book);
  } catch (err) {
    res.status(400).send({ message: err.message });
    //next(err);
  }
});

// get book by id
router.get("/:id", async (req, res, next) => {
  try {
    const book = await books.findById(req.params.id);
    if (!book) {
      throw new Error("Invalid book Id");
    }

    const responsebook = {
      author: book.author,
      title: book.title,
      isbn: book.isbn,
      stock: book.stock,
      id: book._id.toString()
    };
    res.status(200).send(responsebook);
  } catch (err) {
    //next(err);
    res.status(400).send({ message: err.message });
  }
});
// update book by id
router.post("/:id", async (req, res, next) => {
  try {
    const unique_id = req.params.id;
    await Updateschema.validateAsync(req.body);
    const resbook = await books.findByIdAndUpdate(unique_id, req.body, {
      new: true
    });
    if (!resbook) {
      throw new Error("invalid book id");
    }

    res.status(200).send({
      author: resbook.author,
      title: resbook.title,
      isbn: resbook.isbn,
      stock: resbook.stock,
      id: resbook._id.toString()
    });
  } catch (err) {
    // next(err);
    res.status(400).send({ message: err.message });
  }
});

// delete book by id
router.delete("/:id", async (req, res, next) => {
  try {
    const book = await books.findById(req.params.id);

    if (!book) {
      throw new Error("Invalid Book Id");
    }

    await book.remove();

    console.log("book is deleted");
    res.status(200).send();
  } catch (err) {
    res.status(400).send({ message: err.message });
    //next(err);
  }
});
// router.post("/", (req, res, next) => {
//   const { title, author, isbn } = req.body;
//   if (!title && !isbn && !author) {
//     next(new Error("properties can't be null"));
//   } else if (!title) {
//     next(new Error("title should be provided"));
//   } else if (title.length < 3) {
//     next(new Error("title length must be at least 3 characters long"));
//   } else if (!author) {
//     next(new Error("author should be provided"));
//   } else if (!isbn) {
//     next(new Error("isbn should be there"));
//   } else {
//     res.status(200).send("this api will create a new book");
//   }
// });

// router.get("/", (req, res) => {
//   res.status(200).send("this api will provide u all books ");
// });

// router.put("/:id", (req, res, next) => {
//   const { title, author, isbn } = req.body;
// });

module.exports = router;
