import React from 'react';
import { LayoutDashboard, Box, ShoppingCart, Factory, History, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ setView, currentView }) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'inventory', icon: <Box size={20} />, label: 'Inventory' },
    { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { id: 'manufacturing', icon: <Factory size={20} />, label: 'Manufacturing' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Box className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">Business Master</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">SME Suite v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="bg-slate-900 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Cloud Sync</p>
          </div>
          <p className="text-xs text-white font-medium">All systems operational</p>
        </div>
       
      </div>
    </aside>
  );
};

export default Sidebar;