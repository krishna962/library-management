module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash("error_msg", "Please log in to continue.");
        return res.redirect("/login");
    }
};







