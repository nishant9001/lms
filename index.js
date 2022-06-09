const app = require("./app");
const { startDBServer } = require("./server");

const port = 8080;

startDBServer().then((_) => {
  app.listen(port, (err) => {
    if (err) {
      console.log("server is not started");
    } else {
      console.log("server is started");
    }
  });
});
