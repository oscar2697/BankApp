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
    <div className="relative z-0 bg-primary">
      <Router>
        <AuthProvider>
          <Toaster 
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
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
    </div>
  );
}

export default App;
