const express = require('express');
const router = express.Router();
const User = require('../models/user'); // adjust path if needed

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


// for session undefined


module.exports = router;
