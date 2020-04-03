const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const pino = require("express-pino-logger")();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pino);

var con = mysql.createConnection({
  host: "webdb.wpi.edu",
  user: "sgamqpteam",
  password: "j93Z9m+wDIA",
  database: "sgadb"
});

// TODO - UNCOMMENT
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.static(path.join(__dirname, "./build")));

app.get("/api/budgets", (req, res) => {
  // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
  con.query("SELECT * FROM sgadb.Budgets;", function(err, data) {
    err ? res.send(err) : res.json({ budgets: data });
  });
});

app.get("/api/sunburst", (req, res) => {
  // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
  con.query(
    "SELECT * FROM sgadb.`Total Budget` WHERE `Fiscal Year` = 'FY 20';",
    function(err, data) {
      err ? res.send(err) : res.json({ data: data[0] });
    }
  );
});

app.get("/api/club_budgets", (req, res) => {
  // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
  con.query(
    "SELECT * FROM sgadb.`Club Total Budget` WHERE `Fiscal Year` = 'FY 20';",
    function(err, data) {
      err ? res.send(err) : res.json({ budgets: data });
    }
  );
});

app.get("/api/categories_budgets", (req, res) => {
  // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
  con.query(
    "SELECT * FROM sgadb.`Categories Total Budget` WHERE `Fiscal Year` = 'FY 20';",
    function(err, data) {
      err ? res.send(err) : res.json({ budgets: data });
    }
  );
});

app.get("/api/slf", (req, res) => {
  con.query("SELECT * FROM sgadb.`Student Life Fee`;", function(err, data) {
    var i = 0,
      xAxis = [],
      yAxis = [];
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
    function(err, data) {
      // console.log(data);
      err ? res.send(err) : res.json({ members: data });
    }
  );
});

app.get("/api/category_organization_numbers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Categories Club Membership` WHERE `Active Members` != 'Not Provided' AND `Active Members` IS NOT NULL AND `Active Members` != '';",
    function(err, data) {
      // console.log(data);
      err ? res.send(err) : res.json({ members: data });
    }
  );
});

app.get("/api/mandatory_transfers", (req, res) => {
  con.query(
    "SELECT * FROM sgadb.`Mandatory Transfers Total Budget` WHERE `Fiscal Year` = 'FY 20';",
    function(err, data) {
      console.log(data);
      err ? res.send(err) : res.json({ mandatory: data });
    }
  );
});

app.get("/api/budget_breakdown", (req, res) => {
  // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
  con.query("SELECT * FROM sgadb.`Total Budget`;", function(err, data) {
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
  // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
  con.query(
    "SELECT * FROM sgadb.`Selection Options` WHERE `Fiscal Year` = 'FY 19';",
    function(err, data) {
      // var i;
      // for (i=0; i<data.length; i++) {
      //     var year = data[i]["Fiscal Year"]
      //     var yearArr = year.split(" ")
      //     data[i]["Fiscal Year"] = "20" + parseInt(yearArr[1])
      // }

      err ? res.send(err) : res.json({ options: data });
    }
  );
});

app.get("/api/hello", (req, res) => {
  res.json({ msg: "Hello!" });
});

app.get("/api/sankey_data", (req, res) => {
  var sankey = {
    nodes: [
      { name: "Overall Budget" },
      { name: "Mandatory Transfers" },
      { name: "Club Budgets" },
      { name: "Other" },
      { name: "Liability" },
      { name: "Sponsorships" },
      { name: "City Bus Ride" },
      { name: "Senior Class Board" },
      { name: "Junior Class Board" },
      { name: "Sophomore Class Board" },
      { name: "Freshmen Class Board" },
      { name: "Club Sports Coach Transfer" },
      { name: "Community Services" },
      { name: "Van Upkeep" },
      { name: "Copywrite and Liscensing Fee" },
      { name: "Goat's Head Programming" },
      { name: "Greek Life Program" },
      { name: "Leadership Account" },
      { name: "Projection Services" },
      { name: "SNAP Fund" },
      { name: "Speakers Fund" },
      { name: "Techsync Payment" },
      { name: "Reserve" },
      { name: "Operating Account" },
      { name: "SAO" },
      { name: "SGA" },
      { name: "Academic" },
      { name: "Awareness" },
      { name: "Community Service" },
      { name: "Cultural" },
      { name: "Extracurricular" },
      { name: "Music and Arts" },
      { name: "Religious" },
      { name: "Sports" }
    ],
    links: [
      { source: 0, target: 1, value: 63.05591962 },
      { source: 0, target: 2, value: 155.6589231 },
      { source: 0, target: 3, value: 97.28515727 },
      { source: 3, target: 4, value: 40.02339013 },
      { source: 3, target: 5, value: 57.26176715 },
      { source: 1, target: 6, value: 1.092179991 },
      { source: 1, target: 7, value: 1.092179991 },
      { source: 1, target: 8, value: 0.5460899956 },
      { source: 1, target: 9, value: 0.7645259939 },
      { source: 1, target: 10, value: 0.7645259939 },
      { source: 1, target: 11, value: 21.15989515 },
      { source: 1, target: 12, value: 1.638269987 },
      { source: 1, target: 13, value: 0.5832241153 },
      { source: 1, target: 14, value: 1.135867191 },
      { source: 1, target: 15, value: 4.96941896 },
      { source: 1, target: 16, value: 6.000436872 },
      { source: 1, target: 17, value: 3.276539974 },
      { source: 1, target: 18, value: 0.7863695937 },
      { source: 1, target: 19, value: 3.276539974 },
      { source: 1, target: 20, value: 1.638269987 },
      { source: 1, target: 21, value: 3.276539974 },
      { source: 1, target: 22, value: 1.092179991 },
      { source: 1, target: 23, value: 9.96286588 },
      { source: 23, target: 24, value: 4.316295325 },
      { source: 23, target: 25, value: 5.646570555 },
      { source: 2, target: 26, value: 24.23785059 },
      { source: 2, target: 27, value: 2.160504587 },
      { source: 2, target: 28, value: 2.941677588 },
      { source: 2, target: 29, value: 14.66133464 },
      { source: 2, target: 30, value: 49.06202272 },
      { source: 2, target: 31, value: 24.1402927 },
      { source: 2, target: 32, value: 2.314657055 },
      { source: 2, target: 33, value: 36.14058322 }
    ]
  };
  res.json(sankey);
});

// app.post('/api/addBudget', (req, res) => {
//     console.log(`Adding budget for ${req.body.name}`)
//     con.query(`INSERT INTO budgets (name, requested, approved) VALUES ("${req.body.name}",
//     '${req.body.requested}', '${req.body.approved}');`,
//         function (err, result) {
//             (err) ? res.send(err) : res.send(true);
//         })
// });

/**
 * HOW TO USE in react - Use home - handleSubmit as an example
 * const response = await fetch('/api/editBudget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: { name, requested, etc. }}),
        });
    const edited = await response;
    if(edited) {
        // Call home again to update all the data
    }
 */
// app.post('/api/editBudget', (req, res) => {
//     let id = parseInt(req.body.id);
//     console.log("Id: " + id)
//     console.log(req.body);
//     con.query(`UPDATE budgets SET requested = ${req.body.requested}, approved = ${req.body.approved} WHERE id = ${id};`, function (err, result) {
//         console.log("Result: " + result);
//         (err) ? res.send(err) : res.send(true);
//     })
// });

/**
 * HOW TO USE in react - Use home - handleSubmit as an example
 * const response = await fetch('/api/deleteBudget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ index: index }),
        });
    const deleted = await response;

    if(deleted) {
        // Call home again to update all the data
    }
 */
// app.post('/api/deleteBudget', function (req, res) {
//     let id = parseInt(req.body.id);
//     con.query(`DELETE FROM budgets where id = ${id};`, function (err, result) {
//         console.log(result);
//         (err) ? res.send(err) : res.send(true);
//     });
// });

// app.post('/api/login', (req, res) => {
//     console.log(req.body);
//     let username = req.body.username;
//     let password = req.body.password;
//     let user;
//     con.query("SELECT * FROM accounts where username = '" + username + "' AND password = '" + password + "';", function (err, data) {
//         user = data;
//         if(err) {
//             res.send(err);
//         } else if(Object.entries(user).length > 0 ) {
//             user.ok = true;
//             res.json(user)
//         } else {
//             res.sendStatus(401);
//         }
//     })
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "./build/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
