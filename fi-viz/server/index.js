const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const pino = require('express-pino-logger')();

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

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.static(path.join(__dirname, './build')));


app.get('/api/budgets', (req, res) => {
    // Remember to add id as props when doing mysql, I want array syntax, but efficiency of a map/object
    con.query("SELECT * FROM sgadb.Budgets;", function (err, data) {
        (err) ? res.send(err) : res.json({ budgets: data });
    })
});

app.get('/api/hello', (req, res) => {
    res.json({"msg": "Hello!"});
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + './build/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));