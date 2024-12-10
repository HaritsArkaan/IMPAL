import logo from './logo.svg';
import "./App.css";
import Landing from "./component/landing"
import Dashboard from "./component/dashboard";
import Filter from './component/filter';
import FoodDetail from './component/detailjajanan';
import TambahJajanan from './component/tambahJajanan';
import { Route } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/filter" element={<Filter/>}/>
        <Route path="/detailjajanan" element={<FoodDetail/>}/>
        <Route path="/add" element={<TambahJajanan/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
