import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = UserAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
  const email = prompt('Please enter your email to reset your password:');
  if (!email) return;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5174/update-password', // Change to your deployed URL
  });

  if (error) {
    alert('Error sending reset email: ' + error.message);
  } else {
    alert('Password reset email sent!');
  }
};


  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-sm text-gray-500 mb-1">Please enter your details</h2>
        <h1 className="text-2xl font-bold mb-6">Welcome to Planner</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
            required
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border mt-2 border-gray-300 rounded py-2 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
        </form>

        <div className="flex justify-center items-center text-sm text-gray-600 mt-4 gap-1">
          <p>Don’t have an account?</p>
          <Link to="/signup">
            <span className="text-blue-500 hover:underline">Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
