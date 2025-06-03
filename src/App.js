import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';

// Lazy load route components
const Home = lazy(() => import('./components/Home'));
const CompanyDetail = lazy(() => import('./components/CompanyDetail'));
const Profile = lazy(() => import('./components/Profile'));
const MessagePage = lazy(() => import('./pages/MessagePage'));
const PostOrder = lazy(() => import('./pages/PostOrder'));
const Orders = lazy(() => import('./pages/Orders')); // Lazy load Orders component
const Cart = lazy(() => import('./pages/Cart')); // Lazy load Cart component

// PrivateRoute component
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

// AppRoutes separated to allow access to AuthContext
function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Redirect to /home if already logged in and trying to access /signup */}
        {currentUser && <Route path="/signup" element={<Navigate to="/" replace />} />}

        {/* Protected routes */}
        <Route
          path="/company/:id"
          element={
            <CompanyDetail />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <MessagePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/post-order"
          element={
            <PrivateRoute>
              <PostOrder />
            </PrivateRoute>
          }
        />
        {/* New Orders route */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        {/* New Cart route */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router basename="/">
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
