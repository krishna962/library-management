const express = require("express");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/student-dashboard", isAuthenticated, (req, res) => {
    res.render("student-dashboard");
});

module.exports = router;
