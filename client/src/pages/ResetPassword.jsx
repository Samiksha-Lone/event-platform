import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { passwordStrength } from '../utils/validation'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const strength = passwordStrength(password);

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setMsg('');
    setError('');
    
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/reset-password/${token}`, 
        { password },
        { headers: { 'Content-Type': 'application/json' } }
    );

    const { score } = passwordStrength(password);
    if (score < 5) {
      setError(
        'Password must be at least 8 characters and include uppercase, number and special character.'
      );
      return;
    }
    
    setMsg(res.data.message);
    setTimeout(() => navigate('/user/login'), 1500);
      
    } catch (err) {
        console.error('reset error:', err.response?.data);
        setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white border dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">
          Reset Password
        </h1>

        <Input
          id="password"
          name="password"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Strength bar */}
        <div className="mt-2">
          <div className="w-full h-2 overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full ${strength.color} transition-all`}
              style={{ width: `${strength.percent}%` }}
            />
          </div>
          {strength.label && (
            <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
              Strength: {strength.label}
            </p>
          )}
        </div>

        {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <Button type="submit" variant="primary" className="w-full mt-4">
          Update password
        </Button>
      </form>
    </div>
  );
}
