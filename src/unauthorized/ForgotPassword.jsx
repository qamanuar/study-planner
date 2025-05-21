import { useState } from 'react';
import { supabase } from '../supabaseClient';
import LoginPage from './LoginPage';
import { useNavigate } from 'react-router-dom';

function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('Password updated successfully!');
    }
    
    setTimeout(() => {
    navigate('/dashboard'); // Navigate after 2 seconds
    }, 2000); 

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />
        <button
          onClick={handleUpdatePassword}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Password
        </button>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}

export default UpdatePasswordPage;
