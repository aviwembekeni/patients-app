"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
var flash = require("express-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");
const Patients = require("./patients");
const pg = require("pg");
const Pool = pg.Pool;

const app = express();

let PORT = process.env.PORT || 3000;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:lavish@localhost:5432/patients";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

const patients = Patients(pool);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      flashStyle: function() {
        if (
          this.messages.info == "Shift(s) successfully added!" ||
          this.messages.info == "User successfully added!"
        ) {
          return "success";
        } else {
          return "failure";
        }
      }
    }
  })
);

app.set("view engine", "handlebars");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
  })
);

app.use(flash());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.post("/login", async function(req, res, next) {
  try {
    // let userName = req.body.userName;
    //const userType = await patients.getUserType(userName);
    // if (userType === "admin") {
    //   res.redirect("/days");
    // } else if (userType === "waiter") {
    //   res.redirect("/waiters/" + userName);
    // } else {
    //   req.flash("error", "User does not exist");
    //   res.redirect("/");
    // }
  } catch (error) {
    next(error);
  }
});

app.get("/patients", async function(req, res, next) {
  try {
    const patientsInfo = await patients.getPatientsInfo();
    res.render("patients", { patientsInfo });
  } catch (error) {
    next(error);
  }
});

app.post("/filter", function(req, res) {
  //  const sortedShifts = await patients.getShifts();
  const name = req.body.patientName;

  const patientsInfo = patients.patientSearch(name);
  res.render("patients", { patientsInfo });
});

// app.get("/waiters/:username", async function(req, res, next) {
//   try {
//     const username = req.params.username;
//     const weekdays = await patients.getWeekdays(username);
//
//     res.render("waiters", { weekdays, username });
//   } catch (error) {
//     next(error);
//   }
// });

// app.post("/waiters/:username", async function(req, res, next) {
//   try {
//     let dayName = req.body.day_name;
//     if (dayName) {
//       let added = await patients.addShift(
//         req.params.username,
//         dayName
//       );
//
//       if (added) {
//         req.flash("info", "Shift(s) successfully added!");
//       }
//     }
//     res.redirect("/waiters/" + req.params.username);
//   } catch (error) {
//     next(error);
//   }
// });
//
// app.post("/delete", async function(req, res, next) {
//   try {
//     await patients.deleteShifts();
//     const sortedShifts = await patients.getShifts();
//
//     res.render("days", { sortedShifts });
//   } catch (error) {
//     next(error);
//   }
// });

app.post("/register", async function(req, res, next) {
  try {
    // let userName = req.body.username;
    // let fullName = req.body.fullname;
    //
    // var userAdded = await patients.addUser(
    //   userName,
    //   fullName,
    //   "waiter"
    // );
    //
    // if (userAdded) {
    //   req.flash("info", "User successfully added!");
    // }
    //
    // res.redirect("/");
  } catch (error) {}
});

app.listen(PORT, function() {
  console.log("App starting on port", PORT);
});
