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
const getUser = async() => {
    try {
        let pool = await sql.connect(config);
        console.log('getUser in SQL Server');
        let student = pool.request().query('SELECT * FROM Users');
        console.log(student)
        return student;
    }catch(error){
        console.log(error);
    }
};
const createUser = async (User) => {
    try {
        let pool = await sql.connect(config);
        console.log('Create User to SQL Server');
        
        let users = await pool.request()
            .input('Username', sql.NVarChar, User.Username)
            .input('Password', sql.NVarChar, User.Password)
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