const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users.routes");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());
app.use(xss());

app.use(usersRoutes);

app.get("/", function (req, res) {
  res.send("Hello World");
});
app.listen(4000, () => {
  console.log("App running in port 4000");
});
