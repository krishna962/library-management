const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config(); // Load environment variables from .env file
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const connectDB = require("./config/db"); // Import MongoDB connection
const Review = require("./models/Review"); // Import Review Model
const cors = require("cors");
const path = require("path");
const { use } = require("./routes/authRoutes");
const authRoutes = require("./routes/authRoutes"); // Add this line to import authRoutes
const isAuthenticated = require('./middleware/auth');
const adminRoutes = require('./routes/adminRoutes'); // 🆕 Import Admin Routes
const bcrypt = require("bcryptjs"); // You’re using bcrypt in /register
const User = require("./models/User"); // You use this in /register
// const studentRoutes = require('./routes/student');
const studentRoutes = require('./routes/student-dashboard'); // path might vary
const studentDashboardRoutes = require('./routes/student-dashboard');
const contactRoutes = require('./routes/contactRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const bookRoutes = require("./routes/bookRoutes"); // adjust path as needed
const createAdmin = require("./utils/createAdmin");
const profileRoutes = require('./routes/profileRoutes');



const app = express();

// ✅ Connect to MongoDB (Only Once)
// ✅ Connect to MongoDB
connectDB().then(async () => {
    console.log("✅ MongoDB Connected");

    // ✅ Create Default Admin After DB Connects
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        await new User({
            name: "Admin",
            email: "admin@example.com",
            password: hashedPassword,
            phone: "9999999999",
            address: "Admin HQ",
            userClass: "admin",
            role: "admin"
        }).save();
        console.log("✅ Default admin created.");
    } else {
        console.log("ℹ️ Admin already exists.");
    }
});


createAdmin(); // Create default admin if not exists
// ✅ Middleware
// ✅ Set EJS as View Engine
app.set("view engine", "ejs");
// ✅ Middleware

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

app.use((req, res, next) => {
    console.log("🧠 Logged-in user session:", req.session.user);
    next();
});
app.use("/profile", require('./routes/profileRoutes'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files
app.use(express.static(path.join(__dirname, "public"))); // Ensure correct static file serving
app.use(methodOverride("_method"));
app.use(flash());
app.use(cors()); // Allow frontend requests
app.use("/", authRoutes); // ✅ Register authentication routes
app.use(express.static('public'));
app.use('/', adminRoutes); // This mounts your routes under /admin
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    next();
});
// app.use("/", bookRoutes); // or app.use("/book", bookRoutes);
app.use('/', membershipRoutes);
app.use('/', contactRoutes);
// app.use("/profile", profileRoutes); // ✅ Changed to /profile for clarity
// ✅ Flash Messages Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
});
// app.use('/', adminRoutes);  // Ensure this line is correct

app.use('/', studentRoutes); // or '/student' if you're using route prefixes
// ✅ Routes
app.use("/", require("./routes/authRoutes"));
app.use("/books", require("./routes/bookRoutes"));
app.use('/student', studentRoutes);
app.use(studentDashboardRoutes);
// Use Admin Routes
app.use('/books', bookRoutes);


// ✅ Homepage Route
app.get("/", (req, res) => {
    res.render("index");
});

// ✅ API Route: Add Review
app.post("/api/reviews", async (req, res) => {
    try {
        const { name, review } = req.body;

        if (!name || !review) {
            return res.status(400).json({ message: "❌ Name and review are required!" });
        }

        const newReview = new Review({ name, review });
        await newReview.save();

        res.status(201).json({ message: "✅ Review saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving review:", error);
        res.status(500).json({ message: "❌ Failed to save review." });
    }
});

// ✅ API Route: Get All Reviews
app.get("/api/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        res.status(500).json({ message: "❌ Failed to fetch reviews." });
    }
});

// ✅ explore.ejs route
// Route for the Explore Page
app.get("/explore", (req, res) => {
    res.render("explore"); // Ensure explore.ejs exists in the views folder
});

// app.get('/index', (req, res) => {
//     res.render('index');
// });
app.get('/', (req, res) => {
    res.render('index'); // This renders index.ejs from the 'views' folder
});



app.get('/admin-dashboard', (req, res) => {
    res.render('admin-dashboard'); // Make sure you have admin-dashboard.ejs in views folder
});


// app.get('/admin-dashboard/add-book', (req, res) => {
//     res.render('add-book'); // Make sure you have admin-dashboard.ejs in views folder
// });


// ✅ register page route
app.post("/register", async (req, res) => {
    const { name, email, password, phone, address, role, userClass } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
        return res.redirect("/register?error=exists");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save new user
    const newUser = new User({ name, email, password: hashedPassword, phone, address, role, userClass });
    await newUser.save();

    // Redirect with success message
    return res.redirect("/register?success=true");
});





// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
