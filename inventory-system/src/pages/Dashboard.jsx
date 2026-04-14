import React from 'react';
import { 
  TrendingUp, 
  Package, 
  Truck, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  ChevronRight
} from 'lucide-react';

const Dashboard = ({ products, batches, orderHistory, setView, userName }) => {
  
  // --- STATS LOGIC ---
  const totalStock = products.reduce((acc, p) => acc + Number(p.quantity), 0);
  const lowStockItems = products.filter(p => Number(p.quantity) < 20).length;
  const activeBatches = batches.filter(b => b.status === 'In Progress').length;
  const recentOrders = orderHistory.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
     
      <div >
        <div className="relative z-10">
          <h1 className="text-1xl md:text-2xl font-black tracking-tighter uppercase italic">
            Hi {userName || "Admin"},
          </h1>
          <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mt-2">
            System Overview & Real-time Analytics
          </p>
        </div>
       
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Inventory Assets" 
          value={totalStock.toLocaleString()} 
          label="Total Units" 
          icon={<Package size={24} />} 
          trend="+12%" 
          color="blue"
        />
        <StatCard 
          title="Production" 
          value={activeBatches} 
          label="Active Batches" 
          icon={<TrendingUp size={24} />} 
          trend="Live" 
          color="emerald"
        />
        <StatCard 
          title="Alerts" 
          value={lowStockItems} 
          label="Low Stock Items" 
          icon={<AlertTriangle size={24} />} 
          trend="Action Required" 
          color="rose"
          isAlert={lowStockItems > 0}
        />
        <StatCard 
          title="Shipments" 
          value={orderHistory.filter(o => o.type === 'Sales').length} 
          label="Completed Sales" 
          icon={<Truck size={24} />} 
          trend="+5.4%" 
          color="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Activity</h3>
            <button 
              onClick={() => setView('history')}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              View Full Log <ChevronRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    order.type === 'Sales' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {order.type === 'Sales' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.items[0]?.name} {order.items.length > 1 && +`${order.items.length - 1}`}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{order.id} • {order.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900 italic">${Number(order.total).toLocaleString()}</p>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${
                    order.type === 'Sales' ? 'text-emerald-500' : 'text-blue-500'
                  }`}>{order.type}</p>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                No recent transactions
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-400">System Pulse</h3>
          <div className="space-y-6 relative z-10">
            <PulseItem label="Database Latency" value="24ms" status="Optimal" />
            <PulseItem label="Sync Status" value="Real-time" status="Connected" />
            <PulseItem label="Security Protocol" value="Active" status="SSL-6" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, label, icon, trend, color, isAlert }) => {
  const colors = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    slate: 'bg-slate-900'
  };

  return (
    <div className={`bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group ${isAlert ? 'ring-2 ring-rose-500/20' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-widest ${
          color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
        }`}>
          {trend}
        </span>
      </div>
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-2xl font-black text-slate-900 tracking-tighter mb-1">{value}</p>
      <p className="text-[10px] font-medium text-slate-400 italic">{label}</p>
    </div>
  );
};

const PulseItem = ({ label, value, status }) => (
  <div className="flex justify-between items-center group cursor-default">
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-lg font-black italic group-hover:text-blue-400 transition-colors">{value}</p>
    </div>
    <div className="flex flex-col items-end">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mb-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
      <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">{status}</span>
    </div>
  </div>
);

export default Dashboard;