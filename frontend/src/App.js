import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import DevProfile from "./pages/DevProfile";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Marketplace from "./pages/Marketplace";
import Models from "./pages/Models";
import ModelDetail from "./pages/ModelDetail";
import ModelEdit from "./pages/ModelEdit";
import UserModels from "./pages/UserModels";
import ApiTester from "./pages/ApiTester";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected Routes for any authenticated user */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user", "developer"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes for specific roles */}
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dev-profile"
                element={
                  <ProtectedRoute allowedRoles={["developer"]}>
                    <DevProfile />
                  </ProtectedRoute>
                }
              />

              {/* Marketplace Routes */}
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute allowedRoles={["user", "developer"]}>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/marketplace/:id"
                element={
                  <ProtectedRoute allowedRoles={["user", "developer"]}>
                    <ModelDetail />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/models/published"
                element={
                  <ProtectedRoute allowedRoles={["user", "developer"]}>
                    <UserModels />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/usage-history"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    {/* UsageHistory component would go here in a real implementation */}
                    <div>Usage History Page</div>
                  </ProtectedRoute>
                }
              />

              {/* Developer Routes */}
              <Route
                path="/models"
                element={
                  <ProtectedRoute allowedRoles={["developer"]}>
                    <Models />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/models/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={["developer"]}>
                    <ModelEdit />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/api-tester"
                element={
                  <ProtectedRoute allowedRoles={["user", "developer", "admin"]}>
                    <ApiTester />
                  </ProtectedRoute>
                }
              />

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
