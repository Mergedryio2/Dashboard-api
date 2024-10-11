
const express   = require('express'),
    cors        = require('cors'),
    // Student     = require('./Database/Students'),
    // bcrypt      = require('bcrypt'), // Import bcrypt for password hashing
    // jwt         = require('jsonwebtoken'); // Import jsonwebtoken for token creation
    dbOperation = require("./Database/dbOperation")
const app = express();
const port = 5000;

app.use(express.json());
// app.use(express.urlencoded());
app.use(cors());

app.post('/dashboard',async(req,res) => {
    console.log('getStudents');
    const result = await dbOperation.getStudents();
    res.send(result);
})

app.post('/login',async (req,res) => {
    console.log('Login');
    const result = await dbOperation.getUser();
    res.send(result);
})

app.post('/datainsert',async (req,res) => {
    try {
        // Step 1: Check if StudentID exists
        const existingStudent = await dbOperation.getStudentById();
        const studentData = req.body;
        
        let newStudentID;
        if (existingStudent) {
            // If exists, increment the StudentID
            studentData.StudentID = existingStudent.StudentID + 1; // Incrementing logic
        } else {
            // If not exists, set the StudentID to 1 or your preferred starting point
            studentData.StudentID = 1; 
        }
        // console.log(studentData);

        // Step 2: Insert the new student data with the new StudentID
        const result = await dbOperation.createStudents(studentData);
        res.send({ message: 'Student data inserted successfully', result });
    } catch (error) {
        console.error('Error inserting student data:', error);
        res.send({ message: 'Error inserting student data' });
    }
})

app.post('/signin',async (req,res) => {
    try {
        // Step 1: Check if StudentID exists
        const UserData = req.body;

        const result = await dbOperation.createUser(UserData);
        res.send({ message: 'User data inserted successfully', result });
    } catch (error) {
        console.error('Error inserting user data:', error);
        res.send({ message: 'Error inserting user data' });
    }
})


app.listen(port, () => console.log(`Listening on port ${port}`));
