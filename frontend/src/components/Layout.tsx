import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { roleMap } from '../utils';
import { LogOut, Menu, X } from 'lucide-react';

import type { ReactNode } from 'react';

interface LayoutProps {
  role: string;
  menuItems: { label: string; path: string; icon: string }[];
  children?: ReactNode;
}

export default function Layout({ role, menuItems, children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, clearRole } = useUserStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const roleInfo = roleMap[role];

  const handleLogout = () => {
    clearRole();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <div className="text-xl font-bold text-gray-800">司法拍卖平台</div>
                <div className="text-xs text-gray-500 mt-1">{roleInfo?.label}</div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                  {userName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{userName}</div>
                  <div className="text-xs text-gray-500 truncate">{roleInfo?.label}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span>退出登录</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mx-auto" />
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {roleInfo?.icon} {roleInfo?.label}工作台
            </h1>
            <div className="text-sm text-gray-500">
              欢迎回来，{userName}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
