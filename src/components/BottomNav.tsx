import { NavLink } from 'react-router-dom';
import { Home, ListChecks, Clock } from 'lucide-react';

const TABS = [
  { to: '/heute', label: 'Heute', Icon: Home },
  { to: '/aufgaben', label: 'Aufgaben', Icon: ListChecks },
  { to: '/zeiterfassung', label: 'Zeiterfassung', Icon: Clock },
];

export default function BottomNav() {
  return (
    <nav className="pb-safe bg-white border-t border-gray-200">
      <div className="flex">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-brand' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
