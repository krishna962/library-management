const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed
const Complaint = require('../models/Complaint'); // Make sure this model exists and is imported
const flash = require('connect-flash');
const multer = require('multer');
const path = require('path');
const SuccessStory = require('../models/SuccessStory');

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



// Success Story Form

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/success-stories');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // file.png
    }
  });
  const upload = multer({ storage: storage });


// Show Success Story Form
// GET - Add Success Story Page
router.get('/student-dashboard/add-success-story', (req, res) => {
    res.render('add-success-story');
  });
  
  // POST - Submit Story


  // API to handle form submit
router.post('/student-dashboard/add-success-story', upload.single('photo'), async (req, res) => {
  try {
    const { name, exam, rank, year, description } = req.body;
    const photo = req.file ? req.file.path : null;

    if (!name || !exam || !rank || !year || !description || !photo) {
      return res.status(400).send('All fields are required');
    }

    const newStory = new SuccessStory({
      name,
      exam,
      rank,
      year,
      description,
      photo
    });

    await newStory.save();

    res.redirect('/student-dashboard');  // After adding, redirect to dashboard
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
  

// Show Success Stories

// Route to show all success stories
router.get('/student-dashboard/all-success-stories', async (req, res) => {
  try {
    const allStories = await SuccessStory.find().sort({ createdAt: -1 }); // latest first
    res.render('all-success-stories', { stories: allStories }); // stories bhej rahe hain EJS me
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
