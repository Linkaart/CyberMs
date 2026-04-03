import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VulnerabilityList from './pages/VulnerabilityList';
import VulnerabilityDetails from './pages/VulnerabilityDetails';
import AuditLog from './pages/AuditLog';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return <div />; // or a spinner
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <SnackbarProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vulnerabilities"
          element={
            <PrivateRoute>
              <VulnerabilityList />
            </PrivateRoute>
          }
        />
        <Route
          path="/vulnerabilities/:id"
          element={
            <PrivateRoute>
              <VulnerabilityDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/audit-log"
          element={
            <PrivateRoute>
              <AuditLog />
            </PrivateRoute>
          }
        />
      </Routes>
    </SnackbarProvider>
  );
}
