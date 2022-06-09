const express = require("express");
//const { request } = require("http");
const Joi = require("joi");
const books = require("../models/books");
const loans = require("../models/loans");
const students = require("../models/students");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const poststudentschema = Joi.object({
  name: Joi.string().min(1).max(30).required().messages({
    "any.required": "name should be provided",
    "string.base": "name should be type 'string'"
  })
});

// get all students
router.get("/", async (req, res, next) => {
  try {
    let condition = {};
    if (req.query.name) {
      condition["name"] = req.query.name;
    }
    const s = await students.find(condition);
    if (!s) {
      throw new Error("Invalid student name");
    }
    const response = await s.map((u) => {
      return {
        name: u.name,
        id: u._id.toString()
      };
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
    //next(err);
  }
});

// get studnet by id
router.get("/:id", async (req, res, next) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      throw Error("Invalid student Id");
    }
    const s = await students.findById(req.params.id);
    if (!s) {
      throw Error("Invalid student Id");
    }
    const responsestudent = {
      name: s.name,
      id: s._id.toString()
    };
    res.status(200).send(responsestudent);
  } catch (err) {
    //next(err);
    res.status(400).send({ message: err.message });
  }
});

// create student
router.post("/", async (req, res, next) => {
  try {
    const body = await poststudentschema.validateAsync(req.body);

    const s = await students.create(req.body);

    const responsestudent = {
      name: s.name,
      id: s._id.toString()
    };
    res.status(201).send(responsestudent);
    // console.log(JSON.stringify(response));
  } catch (err) {
    // next(err);
    res.status(400).send({ message: err.message });
  }
});

//update student info
router.post("/:id", async (req, res, next) => {
  try {
    await poststudentschema.validateAsync(req.body);
    const s = await students.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!s) {
      throw new Error("Invalid student Id");
    }
    const responsestudent = {
      name: s.name,
      id: s._id.toString()
    };
    res.status(201).send(responsestudent);
  } catch (err) {
    //next(err);
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
