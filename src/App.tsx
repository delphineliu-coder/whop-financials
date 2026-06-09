import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NodeDetail from './pages/NodeDetail';
import OperatingIncomeDetail from './pages/OperatingIncomeDetail';
import PasswordGate from './components/PasswordGate';

function App() {
  return (
    <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detail/operatingIncome" element={<OperatingIncomeDetail />} />
          <Route path="/detail/:nodeId" element={<NodeDetail />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  );
}

export default App