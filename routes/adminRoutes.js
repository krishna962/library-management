const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const multer = require('multer');
const Book = require('../models/Book'); // Ensure this file exists
const router = express.Router();
// const User = require('../models/User'); // ✅ Add this line
const path = require('path');
 const User = require('../models/user');
 const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');


// Protect the Admin Dashboard
router.get('/admin-dashboard', (req, res) => {
    res.render('admin-dashboard', { user: req.session.user });
});

//

// for add book 
// ✅ GET: Render Add Book Page under /admin-dashboard
// router.get('/admin-dashboard/add-book', (req, res) => {
//     res.render('add-book'); // This will show add-book.ejs
// });

// Multer Setup for Image Upload
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });




// ✅ Render Add Book page with data
// router.get("/admin-dashboard/add-book", async (req, res) => {
//     try {
//         const books = await Book.find().sort({ _id: -1 });
//         const success_msg = req.session.success_msg || null;
//         req.session.success_msg = null; // clear the message after showing
//         res.render("add-book", { books, success_msg });
//     } catch (error) {
//         console.error("❌ Error fetching books:", error);
//         res.render("add-book", { books: [], success_msg: null });
//     }
// });


// // ✅ Handle Book Add Form
// router.post("/admin-dashboard/add-book", async (req, res) => {
//     try {
//         const { title, author, imageUrl } = req.body;
//         const newBook = new Book({ title, author, imageUrl });
//         await newBook.save();
//         req.session.success_msg = "✅ Book added successfully!";
//         res.redirect("/admin-dashboard/add-book");
//     } catch (error) {
//         console.error("❌ Error adding book:", error);
//         res.redirect("/admin-dashboard/add-book");
//     }
// });


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


// ✅ Render Add Book page with data
router.get("/admin-dashboard/add-book", async (req, res) => {
    try {
        const books = await Book.find().sort({ _id: -1 });

        const success_msg = req.session.success_msg || null;
        const error_msg = req.session.error_msg || null;

        // Clear session messages after reading them
        req.session.success_msg = null;
        req.session.error_msg = null;

        res.render("add-book", { books, success_msg, error_msg });
    } catch (error) {
        console.error("❌ Error fetching books:", error);
        res.render("add-book", { books: [], success_msg: null, error_msg: "Failed to fetch books." });
    }
});
router.post("/admin-dashboard/add-book", async (req, res) => {
    try {
        const { title, author, imageUrl } = req.body;
        const newBook = new Book({ title, author, imageUrl });
        await newBook.save();

        req.session.success_msg = "✅ Book added successfully!";
        res.redirect("/admin-dashboard/add-book");
    } catch (error) {
        console.error("❌ Error adding book:", error);
        req.session.error_msg = "❌ Failed to add book.";
        res.redirect("/admin-dashboard/add-book");
    }
});




// to show all books
// ✅ SHOW ALL BOOKS - Renders a page with all books
// Show All Books Page
router.get("/admin-dashboard/show-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ _id: -1 });
        res.render("show-all-books", { books });
    } catch (error) {
        res.status(500).send("Error fetching all books");
    }
});



// to show all users
// ✅ SHOW ALL USERS - Renders a page with all users
// View Students Page
router.get("/admin-dashboard/view-students", async (req, res) => {
    const searchQuery = req.query.name || "";
    try {
        const students = await User.find({
            role: "student",
            name: { $regex: new RegExp(searchQuery, "i") } // Case-insensitive search
        });

        res.render("view-student", { students, searchQuery });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.render("view-student", { students: [], searchQuery });
    }
});


// for make student page good
// View Students with Pagination, Sorting, and Search
router.get('/admin-dashboard/view-students', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const searchQuery = req.query.name || '';
        const sortField = req.query.sort || 'createdAt';
        const orderQuery = req.query.order || 'asc';
        const sortOrder = orderQuery === 'asc' ? 'asc' : 'desc';

        const filter = {
            role: 'student',
            name: { $regex: searchQuery, $options: 'i' }
        };

        const totalStudents = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalStudents / limit);

        const students = await User.find(filter)
            .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // ✅ All values defined and passed to EJS
        res.render('view-student', {
            students, 
            currentPage, 
            totalPages,
            searchQuery,
            sortField: req.query.sort || 'createdAt',
            sortOrder: req.query.order || 'asc'
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Something went wrong');
    }
});




// data download 


// CSV Export
router.get('/export/csv', async (req, res) => {
    const students = await User.find({ role: 'student' });
    const parser = new Parser({ fields: ['name', 'email', 'role'] });
    const csv = parser.parse(students);
    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    res.send(csv);
});

// Excel Export
router.get('/export/excel', async (req, res) => {
    const students = await User.find({ role: 'student' });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    worksheet.columns = [
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Role', key: 'role' },
        { header: 'Registered Date', key: 'createdAt' },
    ];

    students.forEach(student => worksheet.addRow(student));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

    await workbook.xlsx.write(res);
    res.end();
});

// PDF Export
router.get('/export/pdf', async (req, res) => {
    const students = await User.find({ role: 'student' });
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=students.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Student List', { align: 'center' });
    doc.moveDown();

    students.forEach(student => {
        doc.fontSize(12).text(`Name: ${student.name}`);
        doc.text(`Email: ${student.email}`);
        doc.text(`Role: ${student.role}`);
        doc.text(`Date: ${student.createdAt}`);
        doc.moveDown();
    });

    doc.end();
});

module.exports = router;