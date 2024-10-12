const { parse } = require('dotenv');
const config = require('./dbconfig'),
        sql = require('mssql');

async function getStudentById() {
    try {
        let pool = await sql.connect(config);
        console.log('get Max StudentID from SQL Server');

        // Await the query execution to get the result
        let result = await pool.request().query('SELECT MAX(StudentID) as StudentID FROM Students');
        
        // Log the entire result object to understand its structure
        console.log(result.recordset[0]); 
        
        // Accessing the StudentID from the first row of the result set
        return result.recordset[0]; // This will return the first row as an object
    } catch (error) {
        console.log(error);
    }
}
const getStudents = async() => {
    try {
        let pool = await sql.connect(config);
        console.log('get Students data from SQL Server');
        let student = pool.request().query(`
            SELECT 
                s.StudentID,
                se.SexDescription,
                s.DVRTID,
                e.LevelDescription,
                c.CertDescription,
                s.FathersPrestigeScore,
                sch.SchoolTypeDescription
            FROM 
                Students s
            JOIN 
                Sex se ON s.SexID = se.SexID
            JOIN 
                EducationLevel e ON s.EducationID = e.EducationLevelID
            JOIN
                SchoolType sch ON s.SchoolTypeID = sch.SchoolTypeID
            LEFT JOIN 
                LeavingCert c ON s.CertID = c.CertID
            ORDER BY 
                s.StudentID;`);
        console.log(student)
        return student;
    }catch(error){
        console.log(error);
    }
}
const createStudents = async(Students) => {
    try {
        let pool = await sql.connect(config);
        console.log('Create Students to SQL Server');
        let student = pool.request()
    .input('StudentID', sql.Int, Students.StudentID)
    .input('SexID', sql.Int, Students.SexID)  // Ensure this is a valid SexID
    .input('DVRTID', sql.Int, Students.DVRTID)
    .input('EducationID', sql.Int, Students.EducationID)
    .input('CertID', sql.Int, Students.CertID)
    .input('FathersPrestigeScore', sql.Int, Students.FathersPrestigeScore)
    .input('SchoolTypeID', sql.Int, Students.SchoolTypeID)
    .query(`
        INSERT INTO Students (StudentID, SexID, DVRTID, EducationID, CertID, FathersPrestigeScore, SchoolTypeID)
        VALUES (@StudentID, @SexID, @DVRTID, @EducationID, @CertID, @FathersPrestigeScore, @SchoolTypeID)
    `);
        return student;
    }catch(error){
        console.log(error);
    }
}
// Function to get a user from the database
const getUser = async (username, password) => {
    try {
      // Connect to the database
      let pool = await sql.connect(config);
  
      // Query the database for the user
      const result = await pool
        .request()
        .input('Username', sql.VarChar, username)
        .input('Password', sql.VarChar, password)
        .query('SELECT * FROM Users WHERE Username = @Username AND Password = @Password');
  
      // If a user is found, return it
      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else {
        return null; // No user found
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  };
const createUser = async (username, password) => {
    try {
        let pool = await sql.connect(config);
        console.log('Create User to SQL Server');
        
        let users = await pool.request()
            .input('Username', sql.NVarChar, username)
            .input('Password', sql.NVarChar, password)
            .query(`
                INSERT INTO Users (Username, Password)
                VALUES (@Username, @Password)
            `);
        
        return users;  // Return the new UserID
    } catch (error) {
        console.log(error);
        throw error; // Re-throw error to handle it in the route
    }
};


module.exports = {
    createStudents,
    getStudents,
    getUser,
    getStudentById,
    createUser
};