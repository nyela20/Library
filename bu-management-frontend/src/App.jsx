import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Dashboard from './Dashboard';
import EditBook from './EditBook';
import Register from './Register';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/editbook" element={<EditBook />} />
        <Route path="/register" element={<Register />} />



      </Routes>
    </BrowserRouter>
  );
}
export default App;
