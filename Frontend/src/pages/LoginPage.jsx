import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // The fully functional handleSubmit with the fetch request is restored here
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        navigate('/dashboard'); // Or navigate to any other page
      } else {
        // Handle login failure from the backend
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    // Main container to center the form
    <div className="flex items-center justify-center min-h-screen bg-fuchsia-50">
      
      {/* The form "card" */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        
        {/* Header section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="mt-2 text-gray-500">Please sign in to continue</p>
        </div>

        {/* The form with the restored onSubmit handler */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          
          {/* Email input field */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent transition-all"
            />
          </div>

          {/* Password input field */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 mt-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent transition-all"
            />
          </div>

          {/* Extra options like "Forgot Password?" */}
          <div className="flex items-center justify-end">
            <a href="#" className="text-sm text-fuchsia-600 hover:text-fuchsia-800 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg shadow-md hover:from-fuchsia-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-300 ease-in-out"
            >
              Sign In
            </button>
          </div>
          
        </form>

        {/* Footer for signup link */}
        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-fuchsia-600 hover:text-fuchsia-800 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;