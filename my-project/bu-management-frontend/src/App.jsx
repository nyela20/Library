import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Dashboard from './Dashboard';
import EditBook from './EditBook';
import Register from './Register';
import DashboardPersonnel from './dashboard-personnel';
import DashboardMembre from './DashboardMembre.jsx';
import UserManagement from './UserManagement';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/editbook" element={<EditBook />} />
        <Route path="/register" element={< Register/>} />
        <Route path="/dashboard-personnel" element={< DashboardPersonnel/>} />
       <Route path="/usermanagement"  element={<UserManagement />} />


      </Routes>
    </BrowserRouter>
  );
}
export default App;
