import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import CreateEvent from '../pages/CreateEvent';

const AppRoutes = ({ toggleTheme, isDark }) => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/user/register" element={<Register toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/user/login" element={<Login toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/dashboard" element={<Dashboard toggleTheme={toggleTheme} isDark={isDark} />} />
            <Route path="/create-event" element={<CreateEvent toggleTheme={toggleTheme} isDark={isDark} />} />
        </Routes>
    </Router>
  )
}

export default AppRoutes