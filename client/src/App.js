// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Home from './Pages/Home';
import HotelDetails from './Pages/HotelDetails';
import PrivateRoute from './Components/PrivateRoute';
import { UserProvider } from './UserContext';
import AdminDashboard from './Pages/AdminDashboard';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
            <Route path="/admin" 
            element={<PrivateRoute>
              <AdminDashboard /> 
              </PrivateRoute>
              } 
              />
              <Route
                path="/hotel/:hotelId"
                element={
                  <PrivateRoute>
                    <HotelDetails />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;


