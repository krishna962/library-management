const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Render the contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    success: req.query.success === 'true', // converts query to boolean
    error: req.query.error === 'true'
  });
});

// Handle form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.redirect('/contact?error=true');
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    return res.redirect('/contact?success=true');
  } catch (error) {
    console.error(error);
    return res.redirect('/contact?error=true');
  }
});

module.exports = router;
