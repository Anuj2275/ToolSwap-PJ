import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddToolPage from './pages/AddToolPage';
import ToolDetailPage from './pages/ToolDetailPage';
import ProfilePage from './pages/ProfilePage';
import EditToolPage from './pages/EditToolPage';


function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto p-4">

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tool/:id/edit" element={<EditToolPage />} />
          <Route path="/add-tool" element={<AddToolPage />} />
          <Route path="/tool/:id" element={<ToolDetailPage />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;