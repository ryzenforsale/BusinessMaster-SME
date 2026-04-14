import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddProductModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', productCode: '', description: '', weight: '', price: '', quantity: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      id: Date.now(), 
      price: Number(formData.price), 
      quantity: Number(formData.quantity) 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900 italic">Add New Inventory SKU</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-8 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Product Name</label>
            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" 
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Product Code</label>
            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" 
              onChange={e => setFormData({...formData, productCode: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Weight (e.g., 2kg)</label>
            <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" 
              onChange={e => setFormData({...formData, weight: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
            <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-20 resize-none" 
              onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price ($)</label>
            <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" 
              onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Stock Quantity</label>
            <input required type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" 
              onChange={e => setFormData({...formData, quantity: e.target.value})} />
          </div>
          <button type="submit" className="col-span-2 mt-4 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
            Add Product to Inventory
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;