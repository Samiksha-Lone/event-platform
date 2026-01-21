import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import CreateEvent from '../pages/CreateEvent';
import EventDetails from '../pages/EventDetails';
import UserDashboard from '../pages/UserDashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import EditEvent from '../pages/EditEvent'
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  )
}

export default AppRoutes