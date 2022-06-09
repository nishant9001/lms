const { MongoMemoryServer } = require("mongodb-memory-server");
const { connectToDatabase, disconnectFromDatabase } = require("./database");

let mongod;

async function startDBServer() {
  console.log("Starting DB Server");
  mongod = new MongoMemoryServer();
  await mongod.start();
  const uri = mongod.getUri();
  await connectToDatabase(uri);
  console.log("Started DB Server");
}

async function stopDBServer() {
  console.log("Stopping DB Server");
  await disconnectFromDatabase();
  await mongod.stop();
  new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Stopped DB Server");
}

module.exports = { startDBServer, stopDBServer };
