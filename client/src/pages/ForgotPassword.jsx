import { useState } from 'react';
import { api } from '../utils/api';
import Input from '../components/Input';
import Button from '../components/Button';

// Uses centralized API instance (src/utils/api.js)

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-950">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white border dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800">
        <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white">
          Forgot Password
        </h1>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Enter your email and we will send you a reset link.
        </p>

        <Input
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <Button type="submit" variant="primary" className="w-full mt-4">
          Send reset link
        </Button>
      </form>
    </div>
  );
}
