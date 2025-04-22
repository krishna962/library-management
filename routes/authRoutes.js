const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const router = express.Router();
const isAuthenticated = require("../middleware/auth"); // ✅ You forgot to require this originally

// ✅ Render Register Page
router.get("/register", (req, res) => {
    res.render("register");
});

// ✅ Render Login Page
router.get("/login", (req, res) => {
    res.render("login"); // Ensure login.ejs exists
});

// ✅ Admin Dashboard - Protected
router.get("/admin-dashboard", isAuthenticated, (req, res) => {
    res.render("admin-dashboard", { user: req.session.user });
});

// ✅ Student Dashboard - Protected
router.get("/student-dashboard", isAuthenticated, (req, res) => {
    res.render("student-dashboard", { user: req.session.user });
});

// ✅ Register Route
// ✅ Register Route
router.post("/register", async (req, res) => {
    const { name, email, password, phone, address, userClass, role } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            req.flash("error_msg", "Email or phone already registered.");
            return res.redirect("/register");
        }

        // Remove the manual password hashing part
        const newUser = new User({
            name,
            email,
            password,  // 👈 Use the plain password directly here
            phone,
            address,
            userClass,
            role: role || "student"
        });

        await newUser.save();
        req.flash("success_msg", "Registration successful. Please login.");
        res.redirect("/login");
    } catch (err) {
        console.error("Registration Error:", err);
        req.flash("error_msg", "Something went wrong. Try again.");
        res.redirect("/register");
    }
});


// ✅ Login Route
// ✅ Login Route
router.post("/login", async (req, res) => {
    const { emailOrPhone, password } = req.body;

    console.log("🔐 Login attempt with:", emailOrPhone);

    // 🔒 Hardcoded Admin Check
    if (emailOrPhone === "admin@example.com" && password === "Admin@123") {
        req.session.user = { id: "admin", name: "Admin", role: "admin" };
        console.log("✅ Admin logged in:", req.session.user);
        req.flash("success_msg", "Welcome, Admin!");
        return res.redirect("/admin-dashboard");
    }

    try {
        // 🔍 Look for student in DB
        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        });

        console.log("👉 Found user:", user);

        if (!user) {
            req.flash("error_msg", "❌ Invalid email or phone number.");
            console.log("❌ User not found.");
            return res.redirect("/login");
        }

        // 🔑 Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔐 Password match:", isMatch);

        if (!isMatch) {
            req.flash("error_msg", "❌ Incorrect password.");
            return res.redirect("/login");
        }

        // 🧠 Store session
        req.session.user = {
            id: user._id,
            name: user.name,
            role: user.role
        };

        console.log("✅ Student logged in:", req.session.user);

        // 🧭 Redirect based on role
        if (user.role === "admin") {
            req.flash("success_msg", "Welcome, Admin!");
            return res.redirect("/admin-dashboard");
        } else {
            req.flash("success_msg", "Welcome, Student!");
            return res.redirect("/student-dashboard");
        }

    } catch (err) {
        console.error("❌ Login error:", err.message);
        req.flash("error_msg", "Login failed.");
        res.redirect("/login");
    }
});






// ✅ Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
