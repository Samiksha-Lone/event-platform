import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { validateEmail, validatePassword, validateName, passwordStrength, validateConfirm } from '../utils/validation';

export default function Signup({ onNavigate }) {

  const navigate = useNavigate(); // Hook at top level
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Validation helper (uses shared utilities)
  const validateForm = () => {
    const newErrors = {};
    const nameErr = validateName(name);
    if (nameErr) newErrors.name = nameErr;
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;
    const confirmErr = validateConfirm(password, confirmPassword);
    if (confirmErr) newErrors.confirm = confirmErr;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      
      const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
      };

      try {
        await axios.post("http://localhost:3000/auth/register", formData, {
          withCredentials: true
        });

        navigate('/');

      } catch (error) {
        console.error('Status:', error.response?.status);
        console.error('Error data:', error.response?.data); // Backend message!
        console.error('Request payload:', error.config?.data);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const strength = passwordStrength(password);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 sm:px-6">
      <Card className="w-full max-w-lg p-6 sm:p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-bold text-indigo-600 dark:text-indigo-500">
            EventHub
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Create your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors({ ...errors, name: '' });
              }
            }}
            error={errors.name}
            icon={<FiUser size={20} />}
          />
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
              const val = e.target.value;
              setPassword(val);
              if (errors.password) {
                setErrors({ ...errors, password: '' });
              }
              if (errors.confirm && confirmPassword && confirmPassword === val) {
                setErrors((prev) => ({ ...prev, confirm: '' }));
              }
            }}
            error={errors.password}
            icon={<FiLock size={20} />}
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => {
              const val = e.target.value;
              setConfirmPassword(val);
              if (errors.confirm) setErrors({ ...errors, confirm: '' });
            }}
            error={errors.confirm}
            icon={<FiLock size={20} />}
          />

          {/* Password strength meter */}
          <div className="-mt-2">
            <div className="w-full h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div className={`${strength.color} h-2`} style={{ width: `${strength.percent}%` }} />
            </div>
            {password && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{strength.label}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
          >
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-bold text-indigo-600 dark:text-indigo-500 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
