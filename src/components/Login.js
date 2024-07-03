import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { setUser } = useUser();
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (
      !username.trim() ||
      !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(username)
    ) {
      toast.error('Username must be alphanumeric.');
      return;
    }

    setUser({ username });
    toast.success(`Welcome, ${username}!`);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md w-full"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
