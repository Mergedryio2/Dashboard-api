class Students{
    constructor(StudentID, SexID, DVRTID, EducationID, CertID, FathersPrestigeScore, SchoolTypeID){
        this.StudentID = StudentID;
        this.SexID = SexID;
        this.DVRTID = DVRTID;
        this.EducationID = EducationID;
        this.CertID = CertID;
        this.FathersPrestigeScore = FathersPrestigeScore;
        this.SchoolTypeID = SchoolTypeID; 
    }
}
class User{
    constructor(UserId,Username,Password) {
        this.UserId = UserId;
        this.Username = Username;
        this.Password = Password;
    }
}
module.exports = {
    Students,
    User
};

