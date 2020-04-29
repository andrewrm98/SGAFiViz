const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const pino = require("express-pino-logger")();
var config = require("./config.json");

const app = express();
const port = process.env.PORT || 3001;

const fiscalYear = "FY 20";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pino);

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static(path.join(__dirname, "./build")));

app.get("/api/budgets", (req, res) => {
  con.query("SELECT * FROM sgadb.Budgets;", function (err, data) {
    err ? res.send(err) : res.json({ budgets: data });
  });
});

app.get("/api/sunburst", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ data: data[0] });
    }
  );
});

app.get("/api/club_budgets", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Club Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ budgets: data });
    }
  );
});

app.get("/api/categories_budgets", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Categories Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ budgets: data });
    }
  );
});

app.get("/api/slf", (req, res) => {
  con.query("SELECT * FROM sgadb.`Student Life Fee`;", function (err, data) {
    var i = 0;
    for (i = 0; i < data.length; i++) {
      var year = data[i]["Fiscal Year"];
      var yearArr = year.split(" ");
      data[i]["Fiscal Year"] = parseInt(yearArr[1]) + 2000;
    }

    err ? res.send(err) : res.json({ slf: data });
  });
});

app.get("/api/organization_numbers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Organization Membership Numbers` WHERE `Active Members` != 'Not Provided' AND `Active Members` IS NOT NULL AND `Active Members` != '';",
    function (err, data) {
      err ? res.send(err) : res.json({ members: data });
    }
  );
});

app.get("/api/category_organization_numbers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Categories Club Membership` WHERE `Active Members` != 'Not Provided' AND `Active Members` IS NOT NULL AND `Active Members` != '';",
    function (err, data) {
      err ? res.send(err) : res.json({ members: data });
    }
  );
});

app.get("/api/mandatory_transfers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Mandatory Transfers Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ mandatory: data });
    }
  );
});

app.get("/api/budget_breakdown", (req, res) => {
  con.query("SELECT * FROM sgadb.`Total Budget`;", function (err, data) {
    var i;
    for (i = 0; i < data.length; i++) {
      var year = data[i]["Fiscal Year"];
      var yearArr = year.split(" ");
      data[i]["Fiscal Year"] = "20" + parseInt(yearArr[1]);
    }

    err ? res.send(err) : res.json({ budgets: data });
  });
});

app.get("/api/selection_options", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Selection Options` WHERE `Active Members` != 'Not Provided' AND `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ options: data });
    }
  );
});

app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello!" });
});

app.get("/api/sankey_data", (req, res) => {
  var sankeyData = require("./../src/pages/story/sankey/sankeyData.json");
  res.json(sankeyData);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "./build/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
