import React, { useState } from 'react';
import { Bell, X, Info } from 'lucide-react';

const NotificationDropdown = ({ notifications, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-800">System Notifications</h4>
              <span className="bg-blue-100 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full">
                {notifications.length} NEW
              </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group">
                    <div className="flex gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-xl h-fit">
                        <Info size={14} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-slate-900">{n.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{n.message}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">{n.timestamp}</p>
                      </div>
                    </div>
                    {/* Remove Cross Button */}
                    <button 
                      onClick={() => onRemove(n.id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  No new alerts
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;