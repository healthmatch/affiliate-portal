import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MonitorPlay, Settings, Terminal, BarChart3 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Landing Pages', href: '/landing-pages', icon: MonitorPlay },
  { name: 'API Config', href: '/api-config', icon: Terminal },
  { name: 'Reporting', href: '/reporting', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`
          }
        >
          <item.icon
            className={`mr-3 h-5 w-5 flex-shrink-0`}
            aria-hidden="true"
          />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}