import logo from './logo.svg';
import "./App.css";
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from "./component/landing"
import Dashboard from "./component/dashboard";
import Filter from './component/filter';
import FoodDetail from './component/detailjajanan';
import TambahJajanan from './component/tambahJajanan';
import Profile from './component/profile';
import LoginForm from './component/login';
import RegisterForm from './component/register';
import Review from './component/Reviewku';
import Jajananku from './component/jajananku';

function App() {
  const [showLanding, setShowLanding] = useState(true);

  const handleLandingComplete = () => {
    setShowLanding(false);
  };

  return (
    <BrowserRouter>
      {showLanding ? (
        <Landing onComplete={handleLandingComplete} />
      ) : (
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/detailjajanan" element={<FoodDetail />} />
          <Route path="/add" element={<TambahJajanan />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/review" element={<Review />} />
          <Route path="/jajananku" element={<Jajananku />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}


export default App;
