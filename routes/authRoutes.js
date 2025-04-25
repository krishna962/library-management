const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const isAuthenticated = require("../middleware/auth"); // ✅ You forgot to require this originally
const Complaint = require('../models/Complaint');
const TeaOrder = require('../models/TeaOrder');
const FeePayment = require('../models/FeePayment');

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
        const { status, page = 1, sort = 'date' } = req.query; // Get the status, page, and sort options from the query
        const limit = 5; // Number of complaints per page
        const skip = (page - 1) * limit;

        // Build filter based on complaint status
        let filter = { userId: req.session.user._id };
        if (status === 'new') {
            filter.reply = null; // New complaints have no replies
        } else if (status === 'replied') {
            filter.reply = { $ne: null }; // Complaints that have a reply
        }

        // Sorting logic (by subject or creation date)
        const sortOrder = sort === 'subject' ? { subject: 1 } : { createdAt: -1 };

        // Get the complaints based on the filter, sorting, and pagination
        const complaints = await Complaint.find(filter)
            .sort(sortOrder)
            .skip(skip)
            .limit(limit);
        
        const totalComplaints = await Complaint.countDocuments(filter); // Count total complaints for pagination
        const totalPages = Math.ceil(totalComplaints / limit); // Calculate the total pages

        res.render('student-complaints', {
            user: req.session.user,
            complaints,
            status, // Pass the status to the template
            sort,   // Pass the sorting option to the template
            page,   // Pass the current page number
            totalPages, // Pass the total pages count
            hasMore: page < totalPages, // Check if there's another page
        });
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




// tea order details
router.get('/student-dashboard/order-tea', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
      return res.redirect('/login');
    }
    res.render('order-tea', { user: req.session.user });
  });


  router.post('/student-dashboard/order-tea', async (req, res) => {
    console.log("Session user:", req.session.user); // <-- Add this
  
    if (!req.session.user || req.session.user.role !== 'student') {
      return res.redirect('/login');
    }
  
    try {
      const { teaType, quantity, payment } = req.body;
  
      console.log("Received Order Body:", req.body);
  
      await TeaOrder.create({
        studentId: req.session.user.id,
        teaType,
        quantity,
        payment
      });
  
      res.redirect('/student-dashboard/order-tea?success=true');
    } catch (err) {
      console.error("🔥 Error Placing Order:", err);
      res.status(500).send("Error placing order.");
    }
  });
  


  // tea order for admin
  router.get('/admin-dashboard/tea-orders', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
  
    const orders = await TeaOrder.find().populate('studentId');
    res.render('admin-tea-orders', { orders });
  });

  router.post('/admin-dashboard/approve-order/:id', async (req, res) => {
    await TeaOrder.findByIdAndUpdate(req.params.id, { approved: true });
    res.redirect('/admin-dashboard/tea-orders');
  });
  

// whenadmin aprrove oder then show in student my order place 
// Student "My Orders" route
router.get('/student-dashboard/my-orders', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') {
      return res.redirect('/login');
  }

  try {
      const allOrders = await TeaOrder.find({
          studentId: req.session.user.id
      }).sort({ createdAt: -1 });

      const incoming = allOrders.filter(order => order.status === 'pending');
      const completed = allOrders.filter(order => order.status === 'approved');
      const cancelled = allOrders.filter(order => order.status === 'cancelled');

      res.render('student-my-order', {
          user: req.session.user,
          incoming,
          completed,
          cancelled
      });
  } catch (err) {
      console.error("❌ Error fetching orders:", err);
      res.status(500).send("Something went wrong.");
  }
});
  


//  tea order for admin for approve or cancel
// admin-dashboard.js (Admin route to show orders)
// Admin Dashboard - Tea Orders Route
router.get('/admin-dashboard/tea-orders', async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
  
    try {
      // Fetch all orders for the admin dashboard
      const orders = await TeaOrder.find().populate('studentId').sort({ createdAt: -1 });
      res.render('admin-tea-orders', { orders });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.render('admin-tea-orders', { orders: [], error: 'Unable to fetch orders at this time.' });
    }
  });
  


// Route to approve or cancel an order
  // Approve order
  // Approve Order Route
  router.post('/admin-dashboard/approve-order/:id', async (req, res) => {
    try {
      const order = await TeaOrder.findByIdAndUpdate(
        req.params.id,
        { status: 'approved' },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.json({ success: true, status: 'approved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  
  
  
  
  // Cancel Order Route
  router.post("/admin-dashboard/cancel-order/:orderId", async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
  
    try {
      const orderId = req.params.orderId;
  
      // Find the order and update status to 'cancelled'
      const order = await TeaOrder.findById(orderId);
      if (order.status === 'pending') {
        order.status = 'cancelled';
        order.updatedAt = Date.now();
        await order.save();
  
        // Send success response
        return res.json({ success: true, status: 'cancelled' });
      } else {
        return res.json({ success: false, message: "This order has already been processed." });
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      return res.json({ success: false, message: "Unable to cancel the order." });
    }
  });
  
  // Middleware for handling dynamic pagination and sorting
  // Sorting or filtering can be applied on both the fetch query
  router.get('/admin-dashboard/tea-orders', async (req, res) => {
    if (req.session.user.role !== 'admin') {
      return res.redirect('/login');
    }
  
    const { status = 'all', sort = 'newest' } = req.query; // Fetch status filter and sort criteria from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
  
    let filter = {};
    if (status !== 'all') filter.status = status;
  
    let sortOrder = (sort === 'newest') ? { createdAt: -1 } : { createdAt: 1 };
  
    try {
      const orders = await TeaOrder.find(filter)
        .populate('studentId')
        .sort(sortOrder)
        .skip(skip)
        .limit(limit);
      
      const totalOrders = await TeaOrder.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / limit);
  
      res.render('admin-tea-orders', { 
        orders, 
        status, 
        sort, 
        currentPage: page, 
        totalPages 
      });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.render('admin-tea-orders', { orders: [], error: 'Unable to fetch orders at this time.' });
    }
  });
  
  
  

  // for pay fee 



  // GET fee page
router.get('/student-dashboard/fees', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') {
    return res.redirect('/login');
  }

  const payments = await FeePayment.find({ studentId: req.session.user.id }).sort({ paidAt: -1 });
  res.render('student-pay-fee', { payments });
});

// POST fee payment
router.post('/student-dashboard/fees', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') {
    return res.redirect('/login');
  }

  const { month, amount } = req.body;

  const alreadyPaid = await FeePayment.findOne({
    studentId: req.session.user.id,
    month
  });

  if (alreadyPaid) {
    return res.send("You have already paid for this month.");
  }

  await FeePayment.create({
    studentId: req.session.user.id,
    month,
    amount
  });

  res.redirect('/student-dashboard/fees');
});



// too show admin fee payment

// 📄 View all fee payments - Admin Dashboard
router.get('/admin-dashboard/view-fee-payments', async (req, res) => {
  // 🔒 Check if user is an admin
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }

  try {
    // 📦 Fetch all fee payments with student details, latest first
    const payments = await FeePayment.find()
      .populate('studentId') // To get student name/email etc.
      .sort({ paidAt: -1 });

    // 🎯 Render admin view page for all payments
    res.render('admin-fee-payments', { payments });
  } catch (err) {
    console.error("❌ Error fetching fee payments:", err);
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
