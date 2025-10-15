import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Catalogue from './Catalogue'; 
import AdminBookList from './AdminBookList'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogue" element={<Catalogue />} />                 
        <Route path="/AdminBookList" element={<AdminBookList />} />                 


      </Routes>
    </Router>
  );
}

export default App;
