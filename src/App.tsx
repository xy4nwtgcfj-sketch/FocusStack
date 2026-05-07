import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HeutePage from './pages/HeutePage';
import AufgabenPage from './pages/AufgabenPage';
import ZeiterfassungPage from './pages/ZeiterfassungPage';

const TITLE_MAP: Record<string, string> = {
  '/heute': 'Heute',
  '/aufgaben': 'Aufgaben',
  '/zeiterfassung': 'Zeiterfassung',
};

export default function App() {
  const { pathname } = useLocation();
  const title = TITLE_MAP[pathname] ?? 'FocusStack';

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-gray-100">
      <header className="pt-safe bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
        <div className="px-5 py-4 flex items-center gap-3">
          <span className="text-2xl font-bold text-brand">⚡</span>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/heute" replace />} />
          <Route path="/heute" element={<HeutePage />} />
          <Route path="/aufgaben" element={<AufgabenPage />} />
          <Route path="/zeiterfassung" element={<ZeiterfassungPage />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
}
