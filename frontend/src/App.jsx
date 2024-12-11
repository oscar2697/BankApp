import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transfer from './components/Transfer';
import History from './components/History';
import CashierDashboard from './components/CashierDashboard';
import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router className="relative z-0 bg-primary">
      <AuthProvider>
        <Toaster 
          position="top-right"
          reverseOrder={false}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/history" element={<History />} />
          <Route path="/cashier" element={<CashierDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
