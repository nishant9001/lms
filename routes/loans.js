const express = require("express");
const { request } = require("http");
const Joi = require("joi");
const books = require("../models/books");
const loans = require("../models/loans");
const students = require("../models/students");
const router = express.Router();

const postloanschema = Joi.object({
  studentId: Joi.string().required().messages({
    "any.required": "studentId should  be provided",
    "string.base": "studentId should be type string"
  }),
  bookId: Joi.string().required().messages({
    "any.required": "bookId should  be provided",
    "string.base": "bookId should be type string"
  }),
  outDate: Joi.date().required().messages({
    "any.required": "outDate should  be provided",
    "date.base": "outDate should be type 'date'"
  }),
  returnDate: Joi.date().optional().messages({
    "any.required": "returnDate should  be provided",
    "date.base": "returnDate should be type 'date'"
  })
});
// const updateloanschema = Joi.object({
//   studentId: Joi.string().optional().message({
//     "string.base": "studentId should be type string"
//   }),
//   bookId: Joi.string().optional().message({
//     "string.base": "bookId should be type string"
//   }),
//   outDate: Joi.date().optional().message({
//     "date.base": "outDate should be type 'date'"
//   }),
//   returnDate: Joi.date().optional().message({
//     "date.base": "outDate should be type 'date'"
//   })
// });

// function for increment and decrement of stocks in books
// async function stockUpdate(bookId, change = 1) {
//   const book = await books.findById(bookId);
//   if (book.stock + change > 0 || book.stock + change === 0) {
//     // console.log(book.stock);
//     book.stock = book.stock + change;
//     //console.log(book.stock + " " + change);
//     return book.stock;
//   }
//   return book.stock;
// }

// get all loans
router.get("/", async (req, res, next) => {
  try {
    let condition = {};
    if (req.query.bookId) {
      condition["bookId"] = req.query.bookId;
    }
    if (req.query.studentId) {
      condition["studentId"] = req.query.studentId;
    }
    if (req.query.start_date && req.query.end_date) {
      condition["outDate"] = {
        $gte: req.query.start_date,
        $lte: req.query.end_date
      };
    }
    console.log(condition);
    const Loans = await loans.find(condition);

    console.log(Loans); // it is undefined

    const LoanResponse = await Promise.all(
      Loans.map(async (loan) => {
        const book = await books.findById(loan.bookId);
        const student = await students.findById(loan.studentId);
        return {
          id: loan._id.toString(),
          author: book.author,
          title: book.title,
          stock: book.stock,
          bookId: book.id,
          studentId: student.id,
          name: student.name,
          // book: {
          //   id: book._id.toString(),
          //   title: book.title,
          //   author: book.author
          // },
          // student: {
          //   id: student._id.toString(),
          //   name: student.name
          // },
          outDate: loan.outDate,
          returnDate: loan.returnDate
        };
      })
    );

    res.status(200).send(LoanResponse);
  } catch (err) {
    res.status(400).send({ message: err.message });
    // next(err);
  }
});

//get loan by id
router.get("/:id", async (req, res, next) => {
  try {
    // if (mongoose.prototype.isValidObjectId(req.params.id)) {
    //   throw Error("Invalid loan Id");
    // }
    const l = await loans.findById(req.params.id);
    if (!l) {
      throw new Error("Invalid loan Id");
    }

    const responseloan = {
      bookId: l.bookId,
      studentId: l.studentId,
      outDate: l.outDate,
      returnDate: l.returnDate,
      id: l._id.toString()
    };
    res.status(200).send(responseloan);
  } catch (err) {
    //next(err);
    res.status(400).send({ message: err.message });
  }
});

// create new loan
router.post("/", async (req, res, next) => {
  try {
    await postloanschema.validateAsync(req.body);

    const book = await books.findById(req.body.bookId);

    if (!book) {
      throw new Error("Invalid Book Id");
    }

    const user = await students.findById(req.body.studentId);
    if (!user) {
      throw new Error("Invalid student Id");
    }

    // const updated_stock = await stockUpdate(req.body.bookId, -1);

    await books.findByIdAndUpdate(
      req.body.bookId,
      {
        $inc: { stock: -1 }
      },
      { new: true }
    );

    const l = await loans.create(req.body);

    const responseloan = {
      bookId: l.bookId,
      studentId: l.studentId,
      outDate: l.outDate,
      returnDate: l.returnDate,
      id: l._id.toString()
    };

    res.status(201).send(responseloan);
    //console.log(JSON.stringify(response));
  } catch (err) {
    // next(err);
    res.status(400).send({ message: err.message });
  }
});

//update loan info
router.post("/:id", async (req, res, next) => {
  try {
    const l = await loans.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!l) {
      throw new Error("Invalid loan Id");
    }
    const responseloan = {
      bookId: l.bookId,
      studentId: l.studentId,
      outDate: l.outDate,
      id: l._id.toString()
    };
    res.status(201).send(responseloan);
  } catch (err) {
    // next(err);
    res.status(400).send({ message: err.message });
  }
});

// mention return date when students returned the book
// router.post("/return/:id", async (req, res) => {
//   try {
//     const l = await loans.findByIdAndUpdate(
//       req.params.id,
//       { returnDate: req.body.returnDate },
//       { new: true }
//     );

//     if (!l) {
//       throw Error("Invalid loan Id");
//     }

//     res.status(200).send({
//       bookId: l.bookId,
//       studentId: l.studentId,
//       outDate: l.outDate,
//       returnDate: l.returnDate,
//       id: l._id.toString()
//     });
//   } catch (err) {
//     res.status(400).send({ message: err.message });
//   }
// });

// delete loan
router.delete("/:id", async (req, res, next) => {
  try {
    const l = await loans.findById(req.params.id);
    if (!l) {
      throw new Error("Invalid loan Id");
    }
    //console.log(l);
    await l.remove();
    const updated_stock = await stockUpdate(l.bookId, 1);
    //console.log(updated_stock);
    await books.findByIdAndUpdate(
      l.bookId,
      { stock: updated_stock },
      { new: true }
    );

    res.status(200).send();
  } catch (err) {
    // next(err);
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
