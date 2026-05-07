import { Navigate, Route, Routes, useLocation, Link } from 'react-router-dom';
import { Home, ListChecks, Clock } from 'lucide-react';
import HeuteScreen from './screens/HeuteScreen';
import AufgabenScreen from './screens/AufgabenScreen';
import ZeiterfassungScreen from './screens/ZeiterfassungScreen';

const TABS = [
  { path: '/heute', label: 'Heute', Icon: Home },
  { path: '/aufgaben', label: 'Aufgaben', Icon: ListChecks },
  { path: '/zeiterfassung', label: 'Zeiterfassung', Icon: Clock },
];

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-gray-100">
      {/* Header */}
      <header className="pt-safe bg-white border-b border-gray-100 shadow-sm">
        <div className="px-5 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            {TABS.find((t) => pathname.startsWith(t.path))?.label ?? 'FocusStack'}
          </h1>
        </div>
      </header>

      {/* Screen-Inhalt */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/heute" replace />} />
          <Route path="/heute" element={<HeuteScreen />} />
          <Route path="/aufgaben" element={<AufgabenScreen />} />
          <Route path="/zeiterfassung" element={<ZeiterfassungScreen />} />
        </Routes>
      </main>

      {/* Tab-Bar */}
      <nav className="pb-safe bg-white border-t border-gray-200">
        <div className="flex">
          {TABS.map(({ path, label, Icon }) => {
            const aktiv = pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  aktiv ? 'text-brand' : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={aktiv ? 2.5 : 1.8} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
