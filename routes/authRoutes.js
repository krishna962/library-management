const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const isAuthenticated = require("../middleware/auth"); // ✅ You forgot to require this originally
const Complaint = require('../models/Complaint');

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
            profilePic: req.file ? req.file.path : null, // Handle file upload if needed
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
            email: user.email,
            phone: user.phone,
            userClass: user.userClass,
            address: user.address,
            createdAt: user.createdAt,
            profilePic: user.profilePic,
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




// for chnage password 
router.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
  
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    if (newPassword !== confirmPassword) {
      return res.send('New passwords do not match.');
    }
  
    try {
      const user = await User.findById(req.session.user._id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
  
      if (!isMatch) {
        return res.send('Current password is incorrect.');
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.send('Password successfully updated!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error while changing password.');
    }
  });



  // for complaint student
  router.get('/student-dashboard/view-complaints', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/login');
    }
    try {
        const complaints = await Complaint.find({ userId: req.session.user._id }).sort({ createdAt: -1 });
        res.render('student-complaints', { user: req.session.user, complaints });
    } catch (err) {
        res.status(500).send("Something went wrong.");
    }
});


// Route to view all complaints in the admin dashboard
router.get('/admin-dashboard/view-complaints', async (req, res) => {
    // Check if the user is logged in and has the 'admin' role
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/login'); // Redirect to login if not an admin
    }
    
    try {
        // Fetch all complaints, sorted by the most recent (createdAt: -1)
        const complaints = await Complaint.find({}).sort({ createdAt: -1 });
        
        // Render the admin complaints page, passing the user info and complaints data
        res.render('admin-complaints', { user: req.session.user, complaints });
    } catch (err) {
        // Handle any errors (e.g., database connection issues)
        res.status(500).send("Something went wrong.");
    }
});

// Admin Reply to Complaint
// Route to handle admin's reply to a specific complaint
router.post('/admin-dashboard/reply/:complaintId', async (req, res) => {
    const { complaintId } = req.params;
    const { reply } = req.body;

    try {
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) return res.status(404).send("Complaint not found.");

        console.log("Session User:", req.session.user); // Debug
        console.log("Reply:", reply); // Debug

        complaint.reply = reply;
        complaint.adminReplyBy = req.session.user.name || "Admin";
        await complaint.save();

        res.redirect('/admin-dashboard/view-complaints');
    } catch (err) {
        console.error("Error replying to complaint:", err); // See error in terminal
        res.status(500).send("Something went wrong.");
    }
});


// ✅ Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;
