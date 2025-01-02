if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
    
}

  
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require('ejs-mate');
const ListingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.use(methodoverride("_method"));
app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extends: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
    secret: "mysupersecrtecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}


app.get("/", (req, res) => {
    console.log("serever is working");
    res.send("app is working");
});

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", ListingRouter);
app.use("/listings/:id", reviewRouter);
app.use("/", userRouter);







main()
    .then(() => {
        console.log("Successfully connected");

    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));


});

app.use((err, req, res, next) => {
    let { statusCode = 404, message = "page Not Found" } = err;
    res.status(statusCode).render("error.ejs", { message });

    next();

});

app.listen(3003, (req, res) => {
    console.log("server started on port 3000");

});