const express = require("express");
const yaml = require("yamljs");
const swagger = require("swagger-ui-express");

const app = express();
const bodyparser = require("body-parser");
const file = yaml.load("./lms.yaml");
app.use(bodyparser.json());

app.use("/api-docs", swagger.serve, swagger.setup(file));

app.get("/", (req, res) => {
  res.status(200).send(`visit this link <a href="/api-docs/">api-docs</a>`);
});

app.use("/books", require("./routes/books"));
app.use("/loans", require("./routes/loans"));
app.use("/students", require("./routes/students"));

app.use((err, req, res, next) => {
  res.status(400).send({ message: err.message });
});
//startDBServer();
module.exports = app;
