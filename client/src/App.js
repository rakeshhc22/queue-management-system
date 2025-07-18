import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QueueDetail from "./pages/QueueDetail";
import Login from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AllQueues from "./pages/AllQueues";
import Register from './pages/Register';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/queue" element={<AllQueues />} />
        <Route path="/queue/:id" element={<QueueDetail />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

