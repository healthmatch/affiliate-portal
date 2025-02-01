import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LandingPages from './pages/LandingPages';
import ApiConfig from './pages/ApiConfig';
import Reporting from './pages/Reporting';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="landing-pages" element={<LandingPages />} />
            <Route path="api-config" element={<ApiConfig />} />
            <Route path="reporting" element={<Reporting />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;