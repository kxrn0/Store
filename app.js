require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const categoryRouter = require("./routes/category");
const itemRouter = require("./routes/item");
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const logoutRouter = require("./routes/logout");
const accountRouter = require("./routes/account");
const addCategoryRouter = require("./routes/add_category");

const app = express();

const dbURI = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.ax9vjdn.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");

async function main() {
	await mongoose.connect(dbURI);

	console.log("connected to db");
}

mongoose.set("strictQuery", false);

main().catch((error) => console.log(error));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/categories", categoryRouter);
app.use("/item", itemRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/account", accountRouter);
app.use("/add_category", addCategoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
