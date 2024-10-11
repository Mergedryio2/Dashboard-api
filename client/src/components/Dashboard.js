import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography,TextField ,Grid} from '@mui/material';

import { Bar} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Dashboard = () => {
  const [returnData, setReturnData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const [filter, setFilter] = useState(''); // State for the filter input
  const [sortConfig, setSortConfig] = useState({ key: ('StudentID'), direction: 'ascending' });

  const [topRecords, setTopRecords] = useState(10); // State for number of top records
  

  const chartDataDVRT = {
    labels: returnData.map(item => `${item.StudentID}`), // Label based on StudentID
    datasets: [
      {
        label: 'DVRT Score',
        data: returnData.map(item => item.DVRTID), // Data points from the API
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
      }
    ]
  };

  // Chart data for Fathers Prestige Score
  const chartDataPrestige = {
    labels: returnData.map(item => `${item.StudentID}`), // Label based on StudentID
    datasets: [
      {
        label: 'Fathers Prestige Score',
        data: returnData.map(item => item.FathersPrestigeScore), // Data points from the API
        backgroundColor: 'rgba(153, 102, 255, 0.6)', // Different color for this chart
      }
    ]
  };
  
  // Filtered data based on input
  const filteredData = returnData.filter(item =>
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );
    // Function to handle input change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Sort the filtered data
  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Limit the sorted data based on topRecords state
  const limitedData = sortedData.slice(0, topRecords);
  
  // Function to request sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const newData = await response.json();

      // Log the fetched data for debugging
      console.log('Fetched Data:', newData);

      if (newData && newData.recordset) {
        setReturnData(newData.recordset);
      } else {
        console.error('Unexpected data format:', newData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading when data is fetched
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // Handle top records input change
  const handleTopRecordsChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setTopRecords(isNaN(value) ? 10 : value); // Default to 10 if input is invalid
  };

  async function GoToDataInsert (){
    window.location.href = '/datainsert';
  }
  async function BackToLogin (){
    window.location.href = '/login';
  }


  return (
    <div>
    <Typography variant="h4" align="center">Dashboard</Typography>
      <Grid container spacing={3} style={{ marginTop: '20px' }}></Grid>
      <Grid item xs={12} sm={6} md={6}>
        <button onClick={GoToDataInsert}>Go to Insert Student</button>
        </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <button onClick={BackToLogin}>Back to Login</button>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {/* First Chart */}
          <Grid item xs={12} sm={6} md={6}>
            <Bar data={chartDataDVRT} />
          </Grid>

          {/* Second Chart */}
          <Grid item xs={12} sm={6} md={6}>
            <Bar data={chartDataPrestige} />
          </Grid>

          {/* You can add more charts here */}
          {/* <Grid item xs={12} sm={6} md={6}>
            <Bar data={anotherChartData} />
          </Grid> */}
        </Grid>


      <TextField
        label="Filter"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: '20px' }} // Add some spacing
      />

      <TextField
        label="Top Records"
        variant="outlined"
        type="number"
        value={topRecords}
        onChange={handleTopRecordsChange}
        style={{ marginBottom: '20px', marginLeft: '20px' }}
      />
      
      {loading ? (
        <CircularProgress />
      ) : limitedData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(returnData[0]).map((key, index) => (
                  <TableCell key={index} onClick={() => requestSort(key)} style={{ cursor: 'pointer' }}>
                    <strong>{key}</strong>
                    {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : null}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {limitedData.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(item).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1">No data available</Typography>
      )}
    </div>

  );
};


export default Dashboard;
