const express = require('express');
const app = express();
let s_port = 8765;
let hostname = "localhost";
const mysql = require("./connection").con

//configurations 
app.set("view engine", "hbs");
app.set("views", "./view");
app.use(express.static(__dirname + "/static"))

//Routing of urls
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.get("/search", (req, res) => {
    res.render("search")
});

app.get("/update", (req, res) => {
    res.render("update");
});

app.get("/delete", (req, res) => {
    res.render("delete");
});

app.get("/afterdelete", (req, res) => {
    let qry = "select * from candidate ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("delete", { data: results });
        }
    });
});

app.get("/view", (req, res) => {
    let qry = "select * from candidate ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }
    });
});

app.get("/searchcandidate", (req, res) => {
    // fetch data from the form
    const { phone, FirstName } = req.query;

    let qry = "select * from candidate where phone=? OR FirstName=?";
    mysql.query(qry, [phone, FirstName], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { data: results, mesg1: true, mesg2: false })
            } else {
                res.render("search", { mesg1: false, mesg2: true })
            }
        }
    });
})

app.get("/addcandidate", (req, res) => {
    // fetching data from form
    const { FirstName, LastName, phone, appliedfor, rating } = req.query


    let qry = "select * from candidate where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err)
            throw err
        else {
            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into candidate values(?,?,?,?,?)";
                mysql.query(qry2, [FirstName, LastName, phone, appliedfor, rating], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});

app.get("/updatesearch", (req, res) => {

    const { phone, FirstName, LastName } = req.query;

    let qry = "select * from candidate where phone=? OR FirstName=? OR LastName=?";
    mysql.query(qry, [phone, FirstName, LastName], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {
                res.render("update", { mesg1: false, mesg2: true })
            }
        }
    });
})

app.get("/updatecandidate", (req, res) => {
    // fetch data

    const { FirstName, LastName, appliedfor, rating, phone } = req.query;
    let qry = "update candidate set FirstName=?, LastName=? , appliedfor=?, rating=? where phone=?";
    mysql.query(qry, [FirstName, LastName, appliedfor, rating, phone], (err, results) => {
        if (err) throw err;
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true });
            }
        }
    })
});

app.get("/removesearch", (req, res) => {
    let qry = "select * from candidate ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("delete", { data: results });
        }
    });
});
app.get("/removecandidate", (req, res) => {

    const { phone, FirstName, LastName, affectedRows, rating } = req.query;

    let qry = "delete from candidate where phone=? OR FirstName=?";
    mysql.query(qry, [phone, FirstName], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false });
            } else {
                res.render("delete", { mesg1: false, mesg2: true });
            }
        }
    });
});

//server
app.listen(s_port, hostname, (err) => {
    if (err)
        throw err
    else
        console.log(`Server is running at http://${hostname}:${s_port}`);
});


