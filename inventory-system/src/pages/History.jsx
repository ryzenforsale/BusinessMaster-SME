import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  TrendingUp, 
  ShoppingCart, 
  Truck, 
  Settings, 
  Calendar,
  ChevronRight,
  Trash2,
  FileText
} from 'lucide-react';

const History = ({ orderHistory = [], onClearHistory }) => {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

 
  const filteredOrders = useMemo(() => {
    // Ensure orderHistory is always an array before filtering
    if (!Array.isArray(orderHistory)) return [];

    return orderHistory.filter(order => {
      
      if (!order || typeof order !== 'object' || Array.isArray(order)) return false;

      const orderId = String(order.id || '').toLowerCase();
      const term = searchTerm.trim().toLowerCase();
      
      const matchesType = filterType === 'All' || order.type === filterType;
     
      const matchesSearch = orderId.includes(term) || 
                            (Array.isArray(order.items) && order.items.some(item => 
                              String(item?.name || '').toLowerCase().includes(term)
                            ));
                           
      return matchesType && matchesSearch;
    });
  }, [orderHistory, filterType, searchTerm]);

  
  const metrics = useMemo(() => {
    if (!Array.isArray(orderHistory)) return { totalRevenue: 0, mfgActive: 0, purchaseVolume: 0 };

    return {
      totalRevenue: orderHistory
        .filter(o => o?.type === 'Sales')
        .reduce((acc, curr) => acc + (Number(curr?.total) || 0), 0),
      mfgActive: orderHistory.filter(o => o?.type === 'Manufacturing' && o?.status !== 'Completed').length,
      purchaseVolume: orderHistory.filter(o => o?.type === 'Purchase').length
    };
  }, [orderHistory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Consumption': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Revenue Pool</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter italic">${metrics.totalRevenue.toLocaleString()}</h4>
            <div className="flex items-center gap-2 mt-3 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <TrendingUp size={14} strokeWidth={3}/> Live Ledger Active
            </div>
          </div>
          <ShoppingCart size={100} className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 text-slate-900" />
        </div>

        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group text-white">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">In-Production</p>
            <h4 className="text-4xl font-black tracking-tighter italic">{metrics.mfgActive} <span className="text-blue-500 text-xl">Batches</span></h4>
            <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-widest mt-3">Active Manufacturing Nodes</p>
          </div>
          <Settings size={100} className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-45 transition-transform duration-700 text-blue-500" />
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">System Controls</p>
          <div className="flex gap-3">
            <button className="flex-1 bg-slate-50 hover:bg-slate-100 p-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 group">
              <Download size={18} className="text-slate-600 group-hover:text-blue-600 transition-colors"/> 
              <span className="text-[10px] font-black uppercase tracking-widest">Export</span>
            </button>
            <button 
              onClick={onClearHistory} 
              className="flex-1 bg-rose-50 hover:bg-rose-500 hover:text-white p-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 text-rose-600"
            >
              <Trash2 size={18}/> 
              <span className="text-[10px] font-black uppercase tracking-widest">Wipe</span>
            </button>
          </div>
        </div>
      </div>

      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex gap-2 p-1.5 bg-slate-50 rounded-[1.5rem] w-full md:w-auto overflow-x-auto scrollbar-hide">
          {['All', 'Sales', 'Purchase', 'Manufacturing'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterType === type 
                  ? 'bg-white text-blue-600 shadow-md scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions by ID or name..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

   
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => (
            <div 
              key={order.id ||` history-item-${idx}`} 
              className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-wrap md:flex-nowrap items-center gap-6"
            >
              <div className={`w-16 h-16 rounded-[1.5rem] shrink-0 flex items-center justify-center transition-all group-hover:scale-110 ${
                order.type === 'Sales' ? 'bg-rose-50 text-rose-500' : 
                order.type === 'Purchase' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {order.type === 'Sales' ? <ShoppingCart size={28} strokeWidth={2.5}/> : 
                 order.type === 'Purchase' ? <Truck size={28} strokeWidth={2.5}/> : <Settings size={28} strokeWidth={2.5}/>}
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-xs font-black text-slate-900 tracking-tight">{order.id || 'UNTITLED_LOG'}</span>
                  <span className={`px-4 py-1 rounded-full text-[8px] font-black border uppercase tracking-[0.2em] ${getStatusColor(order.status)}`}>
                    {order.status || 'Verified'}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-md">
                  {Array.isArray(order.items) && order.items.length > 0 
                    ? order.items.map(i => `${i?.name || 'Unknown'} (${i?.quantity || 0})`).join(' • ')
                    : 'System-level transaction recorded'}
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-center px-10 border-x border-slate-50">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Calendar size={12}/>
                  <span className="text-[9px] font-black uppercase tracking-widest">Timestamp</span>
                </div>
                <span className="text-[11px] font-black text-slate-800">{order.timestamp || 'Real-time'}</span>
              </div>

              <div className="text-right min-w-[140px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Valuation</p>
                <p className={`text-2xl font-black italic tracking-tighter ${order.type === 'Sales' ? 'text-slate-900' : 'text-slate-900'}`}>
                  {order.type === 'Manufacturing' ? 'N/A' : `$${(Number(order.total) || 0).toLocaleString()}`}
                </p>
              </div>

              <div className="p-2 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                <ChevronRight size={24} strokeWidth={3}/>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 animate-pulse">
            <div className="flex flex-col items-center gap-4 opacity-30">
              <FileText size={64} className="text-slate-900" strokeWidth={1} />
              <p className="text-slate-400 font-black tracking-[0.3em] uppercase text-xs">
                {orderHistory.length === 0 ? "Ledger is currently empty" : "No match for specified query"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;