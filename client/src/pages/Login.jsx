import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail, validatePassword } from '../utils/validation';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Login({ onNavigate }) {

  const navigate = useNavigate(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {

      const formData = {
        email: e.target.email.value,
        password: e.target.password.value
      }

      try {
        await axios.post("http://localhost:3000/auth/login", formData, {
        withCredentials: true
      });
      
      navigate('/dashboard');
      
      } catch (error) {
        console.error('Status:', error.response?.status);
        console.error('Error data:', error.response?.data); 
        console.error('Request payload:', error.config?.data);
      }
      
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-20 sm:px-6">
      <Card className="w-full max-w-lg">
        
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-bold text-indigo-600 dark:text-indigo-500">
            EventHub
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors({ ...errors, email: '' });
              }
            }}
            error={errors.email}
            icon={<FiMail size={20} />}
          />
          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors({ ...errors, password: '' });
              }
            }}
            error={errors.password}
            icon={<FiLock size={20} />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-8"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="font-bold text-indigo-600 dark:text-indigo-500 hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
