var express = require('express');
var app = express();
const path = require('path');
const mime = require('mime-types');
const multer = require('multer');
const bodyParser = require('body-parser');

// Configure Multer
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(null, false); 
    }
};

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.post('/process_post', (req, res) => {
    const response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        student_email: req.body.student_email,
        student_no: req.body.student_no,
        department: req.body.department
    };

    console.log(response);
    res.end(JSON.stringify(response));
});

app.post('/uploads', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.sendFile(path.join(__dirname, 'file-fail.html'));
    }

    console.log(req.file);
    req.file.mimetype = mime.lookup(req.file.originalname);
    res.sendFile(path.join(__dirname, 'file-uploaded.html'));
});

app.get('/file-upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'file-upload.html'));
});

app.get('/file-fail', (req, res) => {
    res.sendFile(path.join(__dirname, 'file-fail.html'));
});

// Start Server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
