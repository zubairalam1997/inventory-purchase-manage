import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUpPage(){
    const [employeeName, setEmployeeName] = useState('');
    const [jobDesignation, setJobDesignation] = useState('');
    const [employeeMail, setEmployeeMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
    
        // Basic validation (replace with your actual signup logic)
        if (!employeeName || !jobDesignation || !employeeMail || !password) {
          setError('Please fill in all fields');
          return;
        }
        try{
            axios.post("http://localhost:5000/employees",{
                employeeName:employeeName,
                jobDesignation:jobDesignation,
                employeeMail:employeeMail,
                password:password

            });
            setEmployeeName('');
            setJobDesignation('');
            setEmployeeMail('');
            setPassword('');
            alert("Employee data added successfully!");

        }catch (error){
            console.error('Error adding Employee data:', error);
            alert("Error adding Employee data. Please check the console.");
        }
    
        // Replace with your actual signup logic (e.g., API call)
        console.log('Signup successful:', { employeeName, jobDesignation, employeeMail, password });
        setError('');
        // Simulate successful signup, then navigate to login.
        navigate('/login');
      };
    return(
        <div className="flex items-center justify-center h-screen p-2 bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign Up</h2>
            {error && <p className="text-red-500 mb-2 text-center">{error}</p> }
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeName">
              Employee Name
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="employeeName"
              type="text"
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </div>
          <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeName">
              Job Designation
            </label>
            <input 
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id='jobDesignation'
            type='text'
            placeholder='Your Job Profile in company'
            value={jobDesignation}
            onChange={(e)=> setJobDesignation(e.target.value)}/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeMail">
              Employee Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="employeeMail"
              type="email"
              placeholder="Employee Email"
              value={employeeMail}
              onChange={(e) => setEmployeeMail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign Up
            </button>
          </div>
          </form>
          <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
            </div>
        </div>
    )
}

export default SignUpPage;