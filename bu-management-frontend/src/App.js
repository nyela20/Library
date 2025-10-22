import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Catalogue from './Catalogue'; 
import AdminBookList from './AdminBookList'; 
import Register from "./Register";
import DashboardPersonnel from "./dashboard-personnel";
import DashboardMembre from './DashboardMembre.jsx';
import UserManagement from './UserManagement';
import PredictionTestPage from "./PredictionTestPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogue" element={<Catalogue />} />                 
        <Route path="/AdminBookList" element={<AdminBookList />} />                 
        <Route path="/register" element={<Register />} />
        <Route path="/usermanagement"  element={<UserManagement />} />
        <Route path="/predictions"  element={<PredictionTestPage />} />
        <Route path="/dashboard-personnel" element={< DashboardPersonnel />} />
       <Route path="/dashboard-membre" element={<DashboardMembre />} />

      


      </Routes>
    </Router>
  );
}

export default App;
