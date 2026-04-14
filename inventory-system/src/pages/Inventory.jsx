import React, { useState } from 'react';
import { Search, Plus, Trash2, Layers, Filter, X, Hash } from 'lucide-react';
import AddProductModal from '../components/modals/AddProductModal';

const Inventory = ({ products, onAddProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

 
  const filtered = products.filter(p => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCode = (p.productCode || "").toLowerCase().includes(codeFilter.toLowerCase()) || 
                        p.id.toString().includes(codeFilter);
    
    const matchesSearch = matchesName && matchesCode;

    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Low Stock') return matchesSearch && Number(p.quantity) < 20;
    return matchesSearch && p.category === activeFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- TOP ACTION BAR --- */}
  <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 w-full lg:w-1/3">
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`p-4 rounded-2xl border transition-all active:scale-95 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${
              isFilterVisible ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
            }`}
          >
            {isFilterVisible ? <X size={16} /> : <Filter size={16} />}
            {isFilterVisible ? 'Close Filters' : 'Filter Ops'}
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={16} strokeWidth={3} />
            Register Product
          </button>
        </div>
      </div>

    
      {isFilterVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-800">
          <div className="relative">
            <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-4 mb-2 block">Search Product Name</label>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Ex: Gear, Steel..." 
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest ml-4 mb-2 block">Search Product Code</label>
            <div className="relative">
              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Ex: IND-9001..." 
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                value={codeFilter}
                onChange={(e) => setCodeFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

   
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Low Stock', 'Raw Material', 'Finished Good'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeFilter === tab 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-400 shadow-sm'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">In-Stock</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 tracking-tight">{p.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">CODE: {p.productCode || p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="font-black text-slate-900 italic">${Number(p.price).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`text-lg font-black italic ${Number(p.quantity) < 20 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {p.quantity} Units
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      Number(p.quantity) < 20 
                        ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {Number(p.quantity) < 20 ? 'Critical' : 'Healthy'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-3 bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:border-rose-100 rounded-2xl transition-all shadow-sm active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search size={32} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No assets match your current configuration</p>
          </div>
        )}
      </div>

      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} onSubmit={onAddProduct} />}
    </div>
  );
};

export default Inventory;