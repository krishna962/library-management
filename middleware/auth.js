module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next(); // Allow access
        }
        req.flash("error_msg", "Please log in to access this page");
        res.redirect("/login");
    },
}






