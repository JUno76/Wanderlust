const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
let { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");


router.route("/signup")
    .get(usercontroller.rendersignUpForm)
    .post(wrapAsync(usercontroller.signUpUser))



router.route("/login")
    .get( usercontroller.renderloginForm)
    .post(
         saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        usercontroller.login
    )

router.get("/logout", usercontroller.logout);

module.exports = router;
