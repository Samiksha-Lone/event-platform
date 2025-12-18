export function validateEmail(email) {
  if (!email) return 'Email is required';
  const rx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!rx.test(email)) return 'Please enter a valid email address';
  return '';
}

export function validatePassword(password, { min = 6, requireUpper = true, requireNumber = true } = {}) {
  if (!password) return 'Password is required';
  if (password.length < min) return `Password must be at least ${min} characters`;
  if (requireUpper && !/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (requireNumber && !/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
}

export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateEvent(data) {
  const errs = {};
  if (!data.title || data.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
  if (!data.date) errs.date = 'Date is required';
  if (!data.time) errs.time = 'Time is required';
  if (!data.location || data.location.trim().length < 3) errs.location = 'Location is required';
  if (!data.capacity || Number.isNaN(Number(data.capacity)) || Number(data.capacity) <= 0) errs.capacity = 'Capacity must be a positive number';
  return errs;
}

export function validateImage(file, { maxSizeMB = 2 } = {}) {
  if (!file) return '';
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type)) return 'Unsupported image type';
  const max = maxSizeMB * 1024 * 1024;
  if (file.size > max) return `Image must be under ${maxSizeMB}MB`;
  return '';
}

export function passwordStrength(password = '') {
  if (!password) return { score: 0, percent: 0, label: '', color: 'bg-red-500' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];
  const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
  return {
    score,
    percent: Math.round((score / 4) * 100),
    label: labels[score],
    color: colors[score],
  };
}

export function validateConfirm(password, confirm) {
  if (confirm === undefined || confirm === null || confirm === '') return 'Confirm password is required';
  if (password !== confirm) return 'Passwords do not match';
  return '';
}
