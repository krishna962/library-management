const express = require('express');
const router = express.Router();

router.get('/membership', (req, res) => {
  res.render('membership');
});

module.exports = router;
