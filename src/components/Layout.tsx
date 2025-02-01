import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import { Heart, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout() {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4">
                <Heart className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  HealthMatch
                </span>
              </div>
              <div className="mt-8 flex-grow flex flex-col">
                <Navigation />
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        {user?.email?.[0].toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user?.email}
                      </p>
                      <button
                        onClick={handleLogout}
                        className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center"
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}