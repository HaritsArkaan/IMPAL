import logo from './logo.svg';
import "./App.css";
import Landing from "./component/landing"
import Dashboard from "./component/dashboard";
import Filter from './component/filter';
import FoodDetail from './component/detailjajanan';
import TambahJajanan from './component/tambahJajanan';
import Profile from './component/profile';
import { Route } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';
import LoginForm from './component/login';
import RegisterForm from './component/register';
import Review from './component/Reviewku';
import Jajananku from './component/jajananku';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/filter" element={<Filter/>}/>
        <Route path="/detailjajanan" element={<FoodDetail/>}/>
        <Route path="/add" element={<TambahJajanan/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/review" element={<Review/>}/>
        <Route path="/jajananku" element={<Jajananku/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
