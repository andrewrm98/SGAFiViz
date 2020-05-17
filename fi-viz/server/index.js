const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const pino = require("express-pino-logger")();
var config;

try {
  config = require("./config.json");
} catch (e) {
  console.log(
    "ERROR: config.json not present for node to connect to the MySQL server"
  );
  process.exit(-1);
}

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

// Check that the connection to the MySQL database can be established.
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static("./build"));
app.use("/docs", express.static("./docs")); // Point the /docs url to the documentation

// The API call used to generate the Sunburst diagram on the budget page
app.get("/api/sunburst", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ data: data[0] });
    }
  );
});

// The API call used to get the breakdown of each club's total budget for the fiscal year.
app.get("/api/club_budgets", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Club Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ budgets: data });
    }
  );
});

// The API call used to get the sum of each club's budget in a category for the fiscal year.
app.get("/api/categories_budgets", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Categories Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ budgets: data });
    }
  );
});

// The API call used to get the yearly Student Life Fee.
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

// The API call used to get the Active Member count for each club for the fiscal year.
app.get("/api/organization_numbers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Organization Membership Numbers` WHERE `Active Members` != 'Not Provided' AND `Active Members` IS NOT NULL AND `Active Members` != '';",
    function (err, data) {
      err ? res.send(err) : res.json({ members: data });
    }
  );
});

// The API call used to get the Active Member count for each club category for the fiscal year.
app.get("/api/category_organization_numbers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Categories Club Membership` WHERE `Active Members` != 'Not Provided' AND `Active Members` IS NOT NULL AND `Active Members` != '';",
    function (err, data) {
      err ? res.send(err) : res.json({ members: data });
    }
  );
});

// The API call used to get the budget allocated for Mandatory Transfers the fiscal year.
app.get("/api/mandatory_transfers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Mandatory Transfers Total Budget` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      err ? res.send(err) : res.json({ mandatory: data });
    }
  );
});

// The API call used to get the budget breakdown for the fiscal year.
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

// The API call used when populating the multi-select dropdown on the budget page.
app.get("/api/selection_options", (req, res) => {
  let slf = 0;
  let totalBudget = 0;
  con.query(
    "SELECT * FROM sgadb.`Student Life Fee` WHERE `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, slfData) {
      totalBudget =
        slfData[0]["SLF Amount"] * slfData[0]["Fall Student Amount"];
      slf = slfData[0]["SLF Amount"];
    }
  );
  con.query(
    "SELECT * FROM sgadb.`Selection Options` WHERE `Active Members` != 'Not Provided' AND `Fiscal Year` = ?;",
    [fiscalYear],
    function (err, data) {
      var i;
      for (i = 0; i < data.length; i++) {
        var budget = data[i]["Total Budget"];
        data[i]["Budget Per Student"] = (budget / totalBudget) * slf;
      }
      err ? res.send(err) : res.json({ options: data });
    }
  );
});

// The API call used to get the data used to draw the sankey on the story page.
app.get("/api/sankey_data", (req, res) => {
  var sankeyData = require("./../src/pages/story/sankey/sankeyData.json");
  res.json(sankeyData);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "./build/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
