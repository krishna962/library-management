const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Issue = require('../models/Issue'); // You need to create this model
const { ensureLoggedIn } = require('../middleware/auth'); // Optional middleware for auth

// Get all books
router.get("/", async (req, res) => {
    const books = await Book.find();
    res.render("books", { books });
});

// Add a book form
router.get("/add", (req, res) => {
    res.render("addBook");
});

// Add book logic
router.post("/add", async (req, res) => {
    const { title, author, genre } = req.body;
    await Book.create({ title, author, genre });
    req.flash("success_msg", "Book added successfully!");
    res.redirect("/books");
});

// Edit book form
router.get("/edit/:id", async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render("editBook", { book });
});

// Edit book logic
router.put("/edit/:id", async (req, res) => {
    const { title, author, genre } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { title, author, genre });
    req.flash("success_msg", "Book updated successfully!");
    res.redirect("/books");
});

// Delete book
router.delete("/delete/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Book deleted!");
    res.redirect("/books");
});


// for index page view book
// router.get("/book", (req, res) => {
//     res.render("book"); // or send a response like res.send("Book Page")
// });

router.get('/books', async (req, res) => {
    try {
      const books = await Book.find();
  
      console.log("Session User:", req.session.user); // ✅ See if this logs correctly
  
      res.render('books', {
        books,
        user: req.session.user || null // 👈 very important
      });
    } catch (err) {
      console.error("Error fetching books:", err);
      res.status(500).send("Something went wrong!");
    }
  });


  // POST route to handle book issuing
router.post('/issue-book', async (req, res) => {
    try {
      if (!req.session.user || req.session.user.role !== 'student') {
        return res.redirect('/login');
      }
  
      const studentId = req.session.user._id;
      const { bookId } = req.body;
  
      // Save issue record
      const issue = new Issue({
        student: studentId,
        book: bookId,
        issuedAt: new Date()
      });
  
      await issue.save();
  
      res.redirect('/books');
    } catch (error) {
      console.error('Error issuing book:', error);
      res.status(500).send('Something went wrong.');
    }
  });
  
  
  
module.exports = router;
