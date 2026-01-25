import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;
    const passwordErr = validatePassword(password);
    if (passwordErr) newErrors.password = passwordErr;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      const credentials = {
        email: email.trim(),
        password: password
      };

      setErrors({});
      setSuccess('');
      clearError();
      
      const result = await login(credentials);

      if (result.success) {
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setErrors({ submit: result.error });
      }
    } else {
      setErrors(newErrors);
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden transition-colors duration-500 bg-white dark:bg-neutral-950">
      <main className="flex items-center justify-center min-h-screen px-4 py-12 overflow-y-auto sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          <div className="p-6 transition-colors duration-500 bg-white border shadow-2xl sm:p-8 dark:bg-neutral-900 rounded-2xl border-neutral-200 dark:border-neutral-800">
            <div className="mb-4 text-center">
              <h1 className="mb-2 text-3xl font-black text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 dark:from-indigo-500 dark:to-indigo-400 bg-clip-text drop-shadow-lg">
                EventHub
              </h1>
              <p className="text-sm font-medium text-neutral-600 dark:text-gray-400">
                Sign in to your account
              </p>
            </div>

            {success && (
              <div className="p-3 mb-4 text-sm text-green-700 transition-colors duration-500 border border-green-300 shadow-md dark:text-green-400 dark:border-green-600/50 bg-green-50 dark:bg-green-500/10 rounded-2xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="p-3 mb-4 text-sm text-red-700 transition-colors duration-500 border border-red-300 shadow-md dark:text-red-400 dark:border-red-600/50 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.submit}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                error={errors.email}
                icon={<FiMail size={20} />}
                required
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
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                error={errors.password}
                icon={<FiLock size={20} />}
                required
              />

              <div className="flex">
                <p
                  className="mt-1 ml-auto text-sm text-indigo-600 cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot password?
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2 group"
                disabled={authLoading}
              >
                {authLoading ? (
                  <>
                    <svg className="inline w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>


            <div className="pt-8 mt-10 text-center transition-colors duration-500 border-t border-neutral-200 dark:border-neutral-700">
              <p className="text-base text-neutral-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/user/register')}
                  className="text-base font-bold text-indigo-600 transition-colors duration-200 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline-offset-4 hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
