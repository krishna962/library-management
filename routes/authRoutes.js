const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Register page
router.get("/register", (req, res) => {
    res.render("register");
});


// Registration Route
router.post("/register", async (req, res) => {
    const { name, email, password, phone, address, role, userClass} = req.body;
    
    try {
        // Check if user already exists (by email OR phone)
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.redirect("/register?error=exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ name, email, password: hashedPassword, phone, address, role, userClass });
        await newUser.save();

        // Redirect to registration page with success message
        return res.redirect("/register?success=true");

    } catch (err) {
        console.error("Error registering user:", err);
        res.redirect("/register?error=server");
    }
});


router.post("/login", async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        // Check if user exists using email or phone number
        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            req.flash("error_msg", "Invalid email or phone number");
            return res.redirect("/login");
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash("error_msg", "Invalid password");
            return res.redirect("/login");
        }

        // Store user role in session
        req.session.user = { id: user._id, role: user.role };

        if (user.role === "admin") {
            req.flash("success_msg", "Welcome, Admin!");
            return res.redirect("/admin-dashboard");
        } else {
            req.flash("success_msg", "Welcome, Student!");
            return res.redirect("/student-dashboard");
        }

    } catch (error) {
        console.error("Login Error:", error);
        req.flash("error_msg", "Login failed. Please try again.");
        res.redirect("/login");
    }
});


// for alert msg
router.post("/register", async (req, res) => {
    try {
        // Save user data to database
        const newUser = new User(req.body);
        await newUser.save();

        // Redirect with success flag
        res.redirect("/register?success=true");
    } catch (error) {
        console.error(error);
        res.status(500).send("Registration failed");
    }
});

// Route for student dashboard
router.get("/student-dashboard", (req, res) => {
    res.render("student-dashboard"); // This will render student-dashboard.ejs
});

// logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

router.get("/login", (req, res) => {
    res.render("login"); // Make sure you have a 'login.ejs' file inside the 'views' folder
});


// logout handling of admin
router.post('/admin-login', (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "securepassword") {
        req.session.admin = { username }; // Store admin session
        res.redirect('/admin-dashboard');
    } else {
        res.render('admin-login', { error: "Invalid Credentials" });
    }
});



// to open student dashboard with name
// 👇 Route to render student dashboard
router.get('/student-dashboard', async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'student') {
            return res.redirect('/login');
        }

        const student = await User.findById(req.session.user._id);

        if (!student) {
            return res.redirect('/login');
        }

        res.render('student-dashboard', { student }); // ✅ This fixes the EJS error
    } catch (err) {
        console.error('Error loading student dashboard:', err);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
