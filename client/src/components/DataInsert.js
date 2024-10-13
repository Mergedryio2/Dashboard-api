import React, { useState } from 'react';
import './DataInsert.css'; // Import the CSS file

const DataInsert = () => {
    const [studentData, setStudentData] = useState({
        StudentID: 0,
        SexID: 1,
        DVRTID: 0,
        EducationID: 1,
        CertID: 1,
        FathersPrestigeScore: 0,
        SchoolTypeID: 1
    });

    // Update state based on form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await fetch('/datainsert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData), // Send the student data as JSON
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Data inserted successfully:', result);
                // Optionally, reset the form or give feedback to the user
                setStudentData({
                    SexID: 1,
                    DVRTID: 0,
                    EducationID: 1,
                    CertID: 1,
                    FathersPrestigeScore: 0,
                    SchoolTypeID: 1
                });
            } else {
                console.error('Error inserting data:', result);
                // Handle error (e.g., show an error message to the user)
            }
        } catch (error) {
            console.error('Error sending data:', error);
            // Handle fetch error
        }
    };
    async function BackToDashboard (){
        window.location.href = '/dashboard';
    }
    
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Student Data Entry</h2>
                <label>
                    Sex:
                    <select name="SexID" value={studentData.SexID} onChange={handleChange}>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                    </select>
                </label>

                <label>
                    DVRT Score:
                    <input
                        type="text"
                        name="DVRTID"
                        value={studentData.DVRTID}
                        onChange={handleChange}
                    />
                </label>

                <label htmlFor="EducationID">Education Level</label>
                <select name="EducationID" value={studentData.EducationID} onChange={handleChange} required>
                    <option value="1">Primary terminal leaver</option>
                    <option value="2">Junior cycle incomplete: vocational school</option>
                    <option value="3">Junior cycle incomplete: secondary school</option>
                    <option value="4">Junior cycle terminal leaver: vocational school</option>
                    <option value="5">Junior cycle terminal leaver: secondary school</option>
                    <option value="6">Senior cycle incomplete: vocational school</option>
                    <option value="7">Senior cycle incomplete: secondary school</option>
                    <option value="8">Senior cycle terminal leaver: vocational school</option>
                    <option value="9">Senior cycle terminal leaver: secondary school</option>
                    <option value="10">3rd level incomplete</option>
                    <option value="11">3rd level complete</option>
                </select>
                <br></br>
                <label>
                    Leaving Certificate:
                    <input
                        type="checkbox"
                        name="CertID"
                        value={studentData.CertID}
                        onChange={e => setStudentData({ ...studentData, CertID: e.target.checked ? 2 : 1 })}
                    />
                </label>
                <br></br>
                <label>
                    Father's Prestige Score:
                    <input
                        type="text"
                        name="FathersPrestigeScore"
                        value={studentData.FathersPrestigeScore}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    School Type:
                    <select name="SchoolTypeID" value={studentData.SchoolTypeID} onChange={handleChange}>
                        <option value="1">Secondary</option>
                        <option value="2">Vocational</option>
                        <option value="9">Primary terminal leaver</option>
                    </select>
                </label>

                <button onClick={handleSubmit}>Submit</button>

                </form>
            <button onClick={BackToDashboard}>Back to Dashboard</button>
        </div>
    );
};

export default DataInsert;
