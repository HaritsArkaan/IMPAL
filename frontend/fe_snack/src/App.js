import logo from './logo.svg';
import "./App.css";
import Dashboard from "./component/dashboard";
import Filter from './component/filter';
import FoodDetail from './component/detailjajanan';
import { Route } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/filter" element={<Filter/>}/>
        <Route path="/detailjajanan" element={<FoodDetail/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
