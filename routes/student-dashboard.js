const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed
const Complaint = require('../models/Complaint'); // Make sure this model exists and is imported
const flash = require('connect-flash');

router.get('/student-dashboard', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/login');
    }

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) return res.redirect('/login');

        res.render('student-dashboard', { user });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});


// for profile
// GET: Student Profile Page
router.get('/student-dashboard/profile', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.render('profile', { user: req.session.user });
  });


  // complaint form

  // Show Complaint Form
// Show Complaint Form
router.get('/student-dashboard/complaint', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/login');
    }

    res.render('complaint', {
        user: req.session.user,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});


// Handle Complaint Submission
// GET Complaint Form
router.get('/student-dashboard/complaint', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/login');
    }
    res.render('complaint', { user: req.session.user, success_msg: '', error_msg: '' });
});

// POST Complaint
router.post('/student-dashboard/complaint', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/login');
    }

    const { subject, message } = req.body;

    try {
        const complaint = new Complaint({
            userId: req.session.user._id,
            name: req.session.user.name,
            subject,
            message
        });

        await complaint.save();

        res.render('complaint', {
            user: req.session.user,
            success_msg: '✅ Your complaint has been submitted.',
            error_msg: ''
        });
    } catch (error) {
        console.error("❌ Error saving complaint:", error.message);
        res.render('complaint', {
            user: req.session.user,
            success_msg: '',
            error_msg: '❌ Something went wrong. Please try again.'
        });
    }
});


  


module.exports = router;
