const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const multerGridfsStorage = require('multer-gridfs-storage');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 8080;
const mongoURI = 'mongodb+srv://backapi:backapi@cluster0.0hpaxoo.mongodb.net/test';


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const conn = mongoose.connection;
let gfs;


conn.once('open', () => {
    console.log('Connected to MongoDB');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); 
});

const storage = multerGridfsStorage({
    url: mongoURI,
    file: (req, file) => ({
        bucketName: 'uploads',
        filename: Date.now() + path.extname(file.originalname),
    }),
});
const upload = multer({ storage });


app.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
});

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (err || !file) {
            return res.status(404).json({ error: 'No file found.' });
        }

      
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({ error: 'Not an image.' });
        }
    });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(authRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
