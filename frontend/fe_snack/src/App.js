import logo from './logo.svg';
import "./App.css";
import Dashboard from "./component/dashboard";
import Filter from './component/filter';
import { Route } from 'react-router-dom';
import { BrowserRouter, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/filter" element={<Filter/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
