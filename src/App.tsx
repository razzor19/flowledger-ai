import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './screens/Splash';
import Onboarding from './screens/Onboarding';
import Dashboard from './screens/Dashboard';
import Transactions from './screens/Transactions';
import Report from './screens/Report';
import Settings from './screens/Settings';
import BottomNav from './components/BottomNav';
import GlobalHeader from './components/GlobalHeader';
import './App.css';

import SplitScreen from './screens/SplitScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<LayoutWithNav />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="split" element={<SplitScreen />} />
            <Route path="report" element={<Report />} />
            <Route path="settings" element={<Settings />} />
            <Route index element={<Navigate to="/app/dashboard" replace />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function LayoutWithNav() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '70px', overflowY: 'auto' }}>
      <GlobalHeader />
      <div style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="split" element={<SplitScreen />} />
          <Route path="report" element={<Report />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}

export default App;