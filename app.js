const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const engine = require("ejs-mate");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const mainRoute = require("./routes/main");
const path = require("path");
// var MongoStore = require("connect-mongo")(session);

const secret = require("./config/secret");
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(secret.database, { useNewUrlParser: true }, err => {
  if (err) {
    throw err;
  } else {
    console.log("connected to database");
  }
});

app.use(express.static(__dirname + "/public"));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //complex algo for parsing
app.use(methodOverride("_method"));
app.use(cookieParser());
// app.use(
//   session({
//     secret: secret.secretKey,
//     resave: true,
//     saveUninitialized: true,
//     store: new MongoStore({ url: secret.database, autoReconnect: true })
//   })
// );

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.engine("ejs", engine);
app.set("view engine", "ejs");

app.use(mainRoute);
app.listen(secret.port, err => {
  if (err) {
    throw err;
  }
  console.log("server running");
});
