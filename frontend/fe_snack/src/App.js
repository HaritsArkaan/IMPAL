import logo from './logo.svg';
import "./App.css";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Favoritku from './component/favoritku';
import PopUpReview from './component/popUpReview';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/detailjajanan" element={<FoodDetail />} />
        <Route path="/add" element={<TambahJajanan />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/review" element={<Review />} />
        <Route path="/jajananku" element={<Jajananku/>} />
        <Route path="/favoritku" element={<Favoritku/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/popUpReview" element={<PopUpReview />} />
      </Routes>
    </Router>
  );
}

export default App;
