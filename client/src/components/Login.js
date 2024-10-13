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
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: User.Username, Password: User.Password }),
      });
  
      console.log('Response Status:', response.status);
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setErrorMessage('Login successful');
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.text(); // Get raw response
        console.error('Error response:', errorData);
        setErrorMessage('Error: ' + errorData); // Display raw error message
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred while logging in: ' + (error.message || error));
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
