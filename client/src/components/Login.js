import React, { useState } from 'react';
import './Login.css'; // Import the CSS file

const Login = () => {
  // Initialize User state with an object
  const [User, setUser] = useState({
    Username: '',
    Password: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: User.Username, Password: User.Password }),
      });
  
      // Log the raw response
      console.log('Raw response:', response);
  
      if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
        const data = await response.json();
        
        // Assuming the API returns a recordset with user data
        if (data.recordset && data.recordset.length > 0) {
          const user = data.recordset.find(record =>
            record.Username === User.Username && record.Password === User.Password
          );
  
          if (user) {
            localStorage.setItem('token', data.token);
            console.log('Login successful:', user);
            setErrorMessage('Login successful');
            window.location.href = '/dashboard';
          } else {
            setErrorMessage('Invalid username or password');
          }
        } else {
          setErrorMessage('No user found');
        }
      } else {
        setErrorMessage('Unexpected response from server');
        console.error('Unexpected response details:', {
          status: response.status,
          statusText: response.statusText,
          contentType: response.headers.get('Content-Type')
        });
      }
    } catch (error) {
      console.error('Login error:', error.message || error);
      setErrorMessage('An error occurred while logging in');
    }
  };
  
  
  

  const handleSignin = async () => {
    try {
      const response = await fetch('./signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: User.Username, Password: User.Password }), // Use the User object
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Sign In error:', error);
      setErrorMessage('An error occurred while signing in');
    }
  };

  // Update User state based on input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value // Update the corresponding field in the User object
    }));
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <input
        type="text"
        name="Username"
        placeholder="Username"
        value={User.Username}
        onChange={handleChange}
      />
      <input
        type="password"
        name="Password"
        placeholder="Password"
        value={User.Password}
        onChange={handleChange}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignin}>Sign in</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
