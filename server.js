const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const dbOperation = require("./Database/dbOperation");

const app = express();
const port = process.env.PORT || 5000;

// Allow CORS from your frontend domain
const allowedOrigins = ['http://localhost:3000', 'https://dashboard-frontend-kappa-khaki.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true, // Enable if you need cookies to be sent with requests
    allowedHeaders: ['Content-Type', 'Authorization'], // Include any additional headers your requests might include
}));
app.options('*', cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Middleware
app.use(express.json({ limit: '1mb' }));

// Error handling middleware for async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
app.post('/api/', async (req, res) => {
    try {
        const { Username, Password } = req.body;
        console.log('Login process...');
        // Get user and validate password
        const user = await dbOperation.getUser(Username, Password);

        res.json({
            recordset: user // or result.recordset if it's nested
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Dashboard route on GET
app.get('/api/dashboard', async (req, res) => {
    try {
        console.log('Fetching students data...');
        const result = await dbOperation.getStudents();
        
        // Ensure the response structure matches what the frontend expects
        res.json({
            recordset: result // or result.recordset if it's nested
        });
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).send({ message: 'Error fetching students data' });
    }
});

// Data insert route
app.post('/api/datainsert', asyncHandler(async (req, res) => {
    const studentData = req.body;

    // Get the max StudentID
    const existingStudent = await dbOperation.getStudentById();

    // Set the new StudentID
    studentData.StudentID = existingStudent ? existingStudent.StudentID + 1 : 1;

    // Insert the new student data
    const result = await dbOperation.createStudents(studentData);
    res.status(201).send({ message: 'Student data inserted successfully', result });
}));

// Sign-up route
app.post('/api/signin', asyncHandler(async (req, res) => {
    const { Username, Password } = req.body;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(Password, 10);

    const result = await dbOperation.createUser(Username, hashedPassword);
    res.status(201).send({ message: 'User data inserted successfully', result });
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send({ message: 'Server error' });
});

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
