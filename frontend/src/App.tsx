import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MarketingLayout from './components/MarketingLayout';
import AppLayout from './components/AppLayout';
import Landing from './pages/marketing/Landing';
import Pricing from './pages/marketing/Pricing';
import Login from './pages/marketing/Login';
import Dashboard from './pages/app/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing Routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<div className="p-16 text-center">Features Page Prototype</div>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/use-cases" element={<div className="p-16 text-center">Use Cases Page Prototype</div>} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="datasets" element={<div className="text-slate-500">Datasets Management View</div>} />
          <Route path="evaluation" element={<div className="text-slate-500">Model Registry & Evaluation View</div>} />
          <Route path="explainability" element={<div className="text-slate-500">Detailed Explainability Dashboard</div>} />
          <Route path="settings" element={<div className="text-slate-500">Workspace Settings</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
