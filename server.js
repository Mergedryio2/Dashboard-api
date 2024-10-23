const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const dbOperation = require("./Database/dbOperation");

const app = express();
const port = process.env.PORT || 5000;


// Configure CORS middleware
const corsOptions = {
    origin: ['http://localhost:3000', 'https://database-frontend-git-main-yossaphan-kaenwongs-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you need to send cookies or authorization headers
  };
  
app.use(cors(corsOptions));

app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'https://database-frontend-git-main-yossaphan-kaenwongs-projects.vercel.app'
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});


// Middleware
app.use(express.json());

// Error handling middleware for async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
app.post('/', async (req, res) => {
    const { Username, Password } = req.body;
  
    // Find user in the database (replace this with your database logic)
    const user = await dbOperation.getUser(Username,Password);
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
      
    // If login is successful
    res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  });
// Dashboard route on GET
app.get('/dashboard', async (req, res) => {
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
app.get('/avgscore', async (req, res) => {
    try {
        console.log('Fetching students data...');
        const result = await dbOperation.AvgPrestigeScore();
        
        // Ensure the response structure matches what the frontend expects
        res.json({
            recordset: result // or result.recordset if it's nested
        });
    } catch (error) {
        console.error('Error fetching Average Score data:', error);
        res.status(500).send({ message: 'Error fetching Average Score data' });
    }
});
// Data insert route
app.post('/datainsert', asyncHandler(async (req, res) => {
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
app.post('/signin', asyncHandler(async (req, res) => {
    const { Username, Password } = req.body;

    const result = await dbOperation.createUser(Username, Password);
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
