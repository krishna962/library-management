const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const multer = require('multer');
const Book = require('../models/Book'); // Ensure this file exists
const router = express.Router();

// Protect the Admin Dashboard
router.get('/admin-dashboard', (req, res) => {
    res.render('admin-dashboard', { user: req.session.user });
});

//

// for add book 
// ✅ GET: Render Add Book Page under /admin-dashboard
router.get('/admin-dashboard/add-book', (req, res) => {
    res.render('add-book'); // This will show add-book.ejs
});
// Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });



// Route to Render Add Book Page
// router.get('/add-book', async (req, res) => {
//     const books = await Book.find();
//     res.render('add-book', { books });
// });

// Route to Handle Book Submission
// Route to render the add-book page
router.get("/admin-dashboard/add-book", async (req, res) => {
    try {
        const books = await Book.find(); // ✅ Fetch books from MongoDB
        res.render("add-book", { books }); // ✅ Pass books to EJS template
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle book submission
router.post("/admin-dashboard/add-book", async (req, res) => {
    try {
        const { title, author, imageUrl } = req.body;

        // ✅ Create a new book
        const newBook = new Book({ title, author, imageUrl });

        await newBook.save(); // ✅ Save to MongoDB

        res.redirect("/admin-dashboard/add-book"); // ✅ Redirect after saving
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).send("Internal Server Error");
    }
});


// for book handle

// DELETE BOOK
router.post('/admin-dashboard/delete-book/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/admin-dashboard/add-book');
    } catch (err) {
        res.status(500).send('Error deleting book');
    }
});
// SHOW EDIT FORM
router.get('/admin-dashboard/edit-book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('edit-book', { book });
    } catch (err) {
        res.status(500).send('Error loading book for edit');
    }
});

// HANDLE EDIT FORM SUBMISSION
router.post('/admin-dashboard/edit-book/:id', async (req, res) => {
    const { title, author, imageUrl } = req.body;
    try {
        await Book.findByIdAndUpdate(req.params.id, { title, author, imageUrl });
        res.redirect('/admin-dashboard/add-book');
    } catch (err) {
        res.status(500).send('Error updating book');
    }
});





module.exports = router;