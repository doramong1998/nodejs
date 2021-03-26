const path = require("path");
const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const mysql = require("mysql");
const { join } = require("path");
const app = express();
const port = 3000;

const con = mysql.createConnection({
  host: "localhost",
  user: "tranquanghuy",
  password: "123456",
  database: "database",
});

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "public")));
app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/news", function (req, res) {
  res.render("news");
});

app.get("/api/data", (req, res) => {
  con.connect(function (err) {
    const sql = "SELECT * FROM user";
    con.query(sql, function (err, results) {
      if (err) throw err;
      res.status(500).json(results)
    });
  }); 
});

app.post("/api/data", (req, res) => {
  if (req.body) {
    con.connect(function (err) {
      const sql =
        "INSERT INTO `user` (`id`, `username`, `password`, `email`, `phoneNumber`, `address`, `permisson`) VALUES " +
        `(NULL, '${req.body[0].username}', '${req.body[0].password}', '${req.body[0].email}', '${req.body[0].phoneNumber}', '${req.body[0].address}', '${req.body[0].permisson}');`;
      con.query(sql, function (err, results) {
        if (err) throw err;
        res.json(results);
      });
    });
  }
});

app.listen(port, function () {
  console.log("Your app running on port " + port);
});
