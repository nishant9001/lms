const mongoose = require("mongoose");

async function connectToDatabase(dbUrl) {
  console.log("Connecting to database");
  return mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((_) => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      console.log("Failed connecting to database");
      console.error(err);
    });
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();
}

module.exports = { connectToDatabase, disconnectFromDatabase };
