import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Login from "./jsxml//Login";
import Dashboard from "./jsxml//Dashboard";
import Catalogue from './jsxml//Catalogue'; 
import AdminBookList from './jsxml/AdminBookList'; 
import Register from "./jsxml/Register";
import DashboardPersonnel from "./jsxml/DashboardPersonnel.jsx";
import DashboardMembre from './jsxml/DashboardMembre.jsx';
import UserManagement from './jsxml/UserManagement';
import PredictionTestPage from "./jsxml/PredictionTestPage";
import AccessDenied from './jsxml/AccessDenied'; 
import AdminLoans from './jsxml/AdminLoans.jsx'

const Guarded = ({ children, roleRequired }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  if (!token) return <Navigate to="/" replace />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/access-denied" replace />;

  return children;
};


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/catalogue" element={<Guarded roleRequired="utilisateur"><Catalogue /> </Guarded>} />                 
        <Route path="/usermanagement"  element={<Guarded roleRequired="personnel"> <UserManagement /> </Guarded> }  />
        <Route path="/predictions" element={ <Guarded roleRequired="personnel"><PredictionTestPage /> </Guarded> } />
        <Route path="/dashboard" element={<Guarded roleRequired="utilisateur"><Dashboard /> </Guarded>} />
        <Route path="/dashboard-membre" element={ <Guarded roleRequired="membre"> <DashboardMembre /></Guarded>} />
        <Route path="/dashboard-personnel" element={<Guarded roleRequired="personnel"><DashboardPersonnel /></Guarded>}/>
        <Route path="/AdminBookList" element={<Guarded roleRequired="personnel"><AdminBookList /></Guarded>}/>
        <Route path="/AdminLoans" element={<Guarded roleRequired="personnel"><AdminLoans /></Guarded>}/>
      </Routes>
    </Router>
  );
}

export default App;
