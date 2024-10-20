const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const dbOperation = require("./Database/dbOperation");

const app = express();
const port = process.env.PORT || 5000;


// Allow CORS from your frontend domain
const allowedOrigins = ['https://database-frontend-pearl.vercel.app'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true, // Enable if you need to use cookies
}));
// Middleware
app.use(express.json());



// Error handling middleware for async routes
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


// Dashboard route on GET
app.get('/dashboard', async (req, res) => {
    try {
        console.log('Fetching students data...');
        const result = await dbOperation.getStudents();
        
        // Make sure the response structure matches what the frontend expects
        res.json({
            recordset: result // or result.recordset if it's nested
        });
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).send({ message: 'Error fetching students data' });
    }
});

// Dashboard route on POST
app.post('/dashboard', async (req, res) => {
    try {
        console.log('Fetching students data...');
        const result = await dbOperation.getStudents();
        
        // Make sure the response structure matches what the frontend expects
        res.json({
            recordset: result // or result.recordset if it's nested
        });
    } catch (error) {
        console.error('Error fetching students data:', error);
        res.status(500).send({ message: 'Error fetching students data' });
    }
});


app.post('/', async (req, res) => {
    try {
        const { Username, Password } = req.body;

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
