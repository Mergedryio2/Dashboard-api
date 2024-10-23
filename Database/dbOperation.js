const config = require('./dbconfig');
const sql = require('mysql2/promise'); // Use promise-based API
// const bcrypt = require('bcrypt'); // Add this line at the top of your file
// Function to get the maximum StudentID
async function getStudentById() {
    try {
        const pool = await sql.createConnection(config);
        console.log('Fetching max StudentID from SQL Server');

        const [rows] = await pool.query('SELECT MAX(StudentID) as StudentID FROM Student');

        console.log(rows[0]);
        return rows[0]; // Return the first row containing StudentID
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
}

// Function to get all students
const getStudents = async () => {
    try {
        const pool = await sql.createConnection(config);
        console.log('Fetching Students data from SQL Server');

        const [rows] = await pool.query(`SELECT 
	s.studentID,
	s2.Description as Sex,
	s.DVRTID ,
	el.Description as EducationLevel,
	lc.Taken ,
	s.FathersPrestigeScore ,
	st.TypeDescription as SchoolType
FROM Student s
JOIN Sex s2 ON s.SexID = s2.SexID 
JOIN EducationLevel el ON s.EducationID = el.EducationID 
JOIN SchoolType st ON s.SchoolTypeID = st.SchoolTypeID 
JOIN LeavingCertificate lc ON s.CertID = lc.LeavingCertID `);
        // console.log(rows);
        return rows;
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
};

// Function to create a new student
const createStudents = async (Students) => {
    try {
        const pool = await sql.createConnection(config);
        console.log('Inserting a new Student into SQL Server');

        const query = `
            INSERT INTO Student (StudentID, SexID, DVRTID, EducationID, CertID, FathersPrestigeScore, SchoolTypeID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            Students.StudentID,
            Students.SexID,
            Students.DVRTID,
            Students.EducationID,
            Students.CertID,
            Students.FathersPrestigeScore,
            Students.SchoolTypeID
        ];

        const [result] = await pool.query(query, values);
        console.log('Inserted Student:', Students.StudentID);
        return result; // Return the inserted StudentID
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
};

async function getUser(username, password) {
    const pool = await sql.createConnection(config);
    
    try {
        // Fetch user by username
        const [rows] = await pool.query('SELECT * FROM Users WHERE Username = ? AND Password = ?', [username,password]);

        // Check if user exists
        if (rows.length === 0) {
            console.log('User not found for username:', username);
            return null; // User not found
        }

        const user = rows[0]; // Get the first user record
        console.log('User found:', user);

        console.log('Password valid for user:', username);
        return user; // Return the user object if found and password is valid
    } catch (error) {
        console.error('Database query error:', error);
        throw error; // Throw error to be handled in the calling function
    } finally {
        await pool.end(); // Ensure the connection is closed
    }
}
  

// Function to create a new user
const createUser = async (username, password) => {
    try {
        const pool = await sql.createConnection(config);
        console.log('Creating a new User in SQL Server');

        const [rows] = await pool.query('SELECT MAX(UserId) AS maxUserId FROM Users');
        const userID = parseInt(rows[0].maxUserId) + 1;

        const query = 'INSERT INTO Users (UserId,Username, Password) VALUES (?, ?, ?)';
        const values = [userID ,username, password];

        const [result] = await pool.query(query, values);
        console.log('Inserted User:', result);
        return result; // Return the new UserID
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
};

module.exports = {
    createStudents,
    getStudents,
    getStudentById,
    
    getUser,
    createUser
};
