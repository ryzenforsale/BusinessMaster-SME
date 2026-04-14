import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Plus, Layers, Calendar, Package } from 'lucide-react';

const Manufacturing = ({ batches, products, onCreate, onUpdate, onAction }) => {
  const [showModal, setShowModal] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', productId: '', plannedQty: 1, materials: [] });

  const stats = {
    active: batches.filter(b => b.status === 'In Progress').length,
    completed: batches.filter(b => b.status === 'Completed').length,
    pending: batches.filter(b => b.status === 'Pending').length
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'In Progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Batches', val: stats.active, icon: <Play />, color: 'text-blue-500' },
          { label: 'Completed (Month)', val: stats.completed, icon: <CheckCircle />, color: 'text-emerald-500' },
          { label: 'Pending Approval', val: stats.pending, icon: <Layers />, color: 'text-amber-500' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl bg-slate-50 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-900">Manufacturing Queue</h3>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95">
          <Plus size={18}/> Create New Batch
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-8 py-5">Batch Details</th>
              <th className="px-8 py-5">Output Product</th>
              <th className="px-8 py-5 text-center">Quantity</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {batches.map(batch => (
              <tr key={batch.id} className="group hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-900">{batch.name}</p>
                  <p className="text-[10px] font-mono text-slate-400">{batch.id}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Package size={14}/></div>
                    <span className="font-bold text-sm text-slate-700">
                      {products.find(p => Number(p.id) === Number(batch.productId))?.name || 'Unknown'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <p className="text-sm font-black italic">{batch.status === 'Completed' ? batch.actualQty : batch.plannedQty}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Units</p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(batch.status)}`}>
                    {batch.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {batch.status === 'Pending' && (
                      <button onClick={() => window.confirm("Start Production?") && onAction(batch.id, 'START')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"><Play size={18}/></button>
                    )}
                    {batch.status === 'In Progress' && (
                      <button onClick={() => {
                        const qty = prompt("Enter actual quantity produced:", batch.plannedQty);
                        if(qty) onAction(batch.id, 'COMPLETE', { actualQty: Number(qty) });
                      }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"><CheckCircle size={18}/></button>
                    )}
                    {(batch.status === 'Pending' || batch.status === 'In Progress') && (
                      <button onClick={() => window.confirm("Cancel Batch?") && onAction(batch.id, 'CANCEL')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"><XCircle size={18}/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl p-10 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-6 italic tracking-tight">Start New Batch</h3>
            <div className="space-y-4">
              
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Identifier</label>
                  <input 
                    placeholder="Batch Name (e.g. Morning Shift A)" 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-bold" 
                    onChange={e => setNewBatch({...newBatch, name: e.target.value})} 
                  />
                </div>

              
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Output Product</label>
                  <select 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 transition-all outline-none font-bold" 
                    onChange={e => setNewBatch({...newBatch, productId: Number(e.target.value)})}
                  >
                      <option>Select Finished Product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

        
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Planned Quantity (Units)</label>
                  <input 
                    type="number"
                    min="1"
                    placeholder="Enter quantity..." 
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-blue-500 transition-all outline-none font-black italic" 
                    value={newBatch.plannedQty}
                    onChange={e => setNewBatch({...newBatch, plannedQty: Number(e.target.value)})} 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setShowModal(false)} 
                      className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        onCreate({
                          ...newBatch, 
                          id: `B-${Date.now().toString().slice(-4)}`, 
                          status: 'Pending', 
                          materials: [] // Your App.jsx handleBatchAction adds materials based on the product
                        });
                        setShowModal(false);
                        setNewBatch({ name: '', productId: '', plannedQty: 1, materials: [] }); // Reset state
                      }} 
                      className="flex-[2] bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-tighter shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
                    >
                      Create Batch
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manufacturing;