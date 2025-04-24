// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');



// ✅ Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    next();
  }


/// ✅ Multer configuration for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


// GET Profile Page
// ✅ Route: Show profile page
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {
    user: req.session.user,
    success: req.query.success,
    error: req.query.error
  });
});

// POST Update Profile
// Update Profile Route
router.post('/update-profile', async (req, res) => {
    const { name, phone, userClass } = req.body;

    try {
        // Get user from session
        const userId = req.session.user?._id;
        if (!userId) {
            return res.redirect('/login'); // User not logged in
        }

        // Update allowed fields
        await User.findByIdAndUpdate(userId, {
            name,
            phone,
            userClass,
        });

        // Update session data (optional but recommended)
        req.session.user.name = name;
        req.session.user.phone = phone;
        req.session.user.userClass = userClass;

        req.flash('success_msg', 'Profile updated successfully!');
        res.redirect('/student-dashboard'); // or wherever you want to redirect
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Something went wrong while updating.');
        res.redirect('/student-dashboard');
    }
});

module.exports = router;
