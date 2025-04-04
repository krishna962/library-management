const express = require("express");
const router = express.Router();
const Book = require("../models/book");

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

module.exports = router;
