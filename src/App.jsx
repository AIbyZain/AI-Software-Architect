import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import { checkHealth } from './services/api';
import { readResultFromSession } from './hooks/useGenerateArchitecture';

export default function App() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    checkHealth()
      .then(() => !cancelled && setBackendStatus('online'))
      .catch(() => !cancelled && setBackendStatus('offline'));
    return () => {
      cancelled = true;
    };
  }, []);

  const activeResult = location.state?.result ?? readResultFromSession();
  const projectName =
    location.pathname === '/architecture' ? activeResult?.project_name : null;

  return (
    <>
      <Navbar projectName={projectName} backendStatus={backendStatus} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/architecture" element={<ResultsPage />} />
      </Routes>
    </>
  );
}
