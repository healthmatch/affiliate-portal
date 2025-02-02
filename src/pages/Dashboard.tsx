import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, Terminal, BarChart3, Settings } from 'lucide-react';

const quickActions = [
  {
    name: 'Landing Pages',
    description: 'Create and manage your landing pages',
    href: '/landing-pages',
    icon: MonitorPlay,
  },
  {
    name: 'API Explorer',
    description: 'Explore and test the API endpoints',
    href: '/api-config',
    icon: Terminal,
  },
  {
    name: 'Reporting',
    description: 'View analytics and reports',
    href: '/reporting',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    description: 'Manage your account settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.name}
            onClick={() => navigate(action.href)}
            className="relative bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left"
          >
            <div>
              <span className="inline-flex items-center justify-center rounded-md bg-primary-dark/10 p-3">
                <action.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                {action.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}