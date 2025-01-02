const User = require("../models/user")

module.exports.rendersignUpForm = (req, res) => {
    res.render("user/signup.ejs");

}


module.exports.signUpUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        let newUser = new User({
            email: email,
            username: username,
        })

        let registeruser = await User.register(newUser, password);

        req.login(registeruser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust");

            res.redirect("/listings");
        });



    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }


}


module.exports.renderloginForm = (req, res) => {
    res.render("user/login.ejs");

}


module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout Successfully");
        res.redirect("/listings");
    });
}