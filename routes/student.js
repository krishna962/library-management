// routes/student.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed

router.get('/dashboard', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') {
    return res.redirect('/login');
  }

  res.render("student-dashboard", { student: req.session.user });
});


router.get('/student-dashboard', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'student') {
      return res.redirect('/login');
  }

  try {
      const student = await User.findById(req.session.user._id);
      if (!student) return res.redirect('/login');

      res.render('student-dashboard', { student });
  } catch (error) {
      console.error(error);
      res.redirect('/login');
  }
});
module.exports = router;
