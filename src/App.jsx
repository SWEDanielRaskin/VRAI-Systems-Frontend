import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import VoiceCalls from './pages/VoiceCalls';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import ServicesManager from './pages/ServicesManager';
import Customers from './pages/Customers';
import MessageCustomizer from './pages/MessageCustomizer';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import LoginRedirect from './components/LoginRedirect';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginRedirect />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/voice-calls" element={
            <ProtectedRoute>
              <Layout>
                <VoiceCalls />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Layout>
                <Messages />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Layout>
                <Customers />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings/message-customizer" element={
            <ProtectedRoute>
              <Layout>
                <MessageCustomizer />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/services-manager" element={
            <ProtectedRoute>
              <Layout>
                <ServicesManager />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
