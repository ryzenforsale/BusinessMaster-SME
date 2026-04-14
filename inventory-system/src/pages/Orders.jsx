import React, { useState, useEffect } from 'react';
import { Plus, Trash2, History, ArrowRightLeft, PackageCheck, X, ShoppingCart } from 'lucide-react';

const Orders = ({ products, onCompleteOrder, orderHistory, onClearHistory }) => {
  const [orderType, setOrderType] = useState('Sales');
  const [cart, setCart] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({ id: '', qty: 1 });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // 1. Sync initial selection
  useEffect(() => {
    if (products && products.length > 0 && !currentSelection.id) {
      setCurrentSelection(prev => ({ ...prev, id: products[0].id.toString() }));
    }
  }, [products]);

  // 2. Add to Cart Logic
  const addToCart = () => {
    const product = products.find(p => Number(p.id) === Number(currentSelection.id));
    if (!product) return;
    const qty = Number(currentSelection.qty);
    if (qty <= 0) return;

    if (orderType === 'Sales' && product.quantity < qty) {
      alert(`Insufficient stock! ${product.name} only has ${product.quantity} units.`);
      return;
    }

    setCart([...cart, {
      productId: product.id,
      name: product.name,
      productCode: product.productCode, // Added productCode to cart
      quantity: qty,
      price: product.price,
      subtotal: product.price * qty
    }]);
  };

  // 3. Finalize Logic
  const handleFinalize = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      type: orderType,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.subtotal, 0),
      status: 'Processing',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onCompleteOrder(newOrder);
    setCart([]);
  };

  return (
    <div className="relative min-h-screen p-4">
      <div className="flex justify-between items-center mb-8 max-w-5xl">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Order Management</h3>
        <button 
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl"
        >
          <History size={18}/> Transaction History
        </button>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm max-w-5xl">
  
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${orderType === 'Sales' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
              <ShoppingCart size={24}/>
            </div>
            <h4 className="font-black text-slate-800 text-lg">{orderType} Mode</h4>
          </div>

          <button 
            type="button"
            onClick={() => {
              setOrderType(prev => prev === 'Sales' ? 'Purchase' : 'Sales');
              setCart([]); // Clear cart when switching modes
            }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
              orderType === 'Sales' 
              ? 'bg-rose-50 border-rose-100 text-rose-600' 
              : 'bg-emerald-50 border-emerald-100 text-emerald-600'
            }`}
          >
            <ArrowRightLeft size={16}/> SWITCH TO {orderType === 'Sales' ? 'PURCHASE' : 'SALES'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Product</label>
            <select 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] font-bold"
              value={currentSelection.id}
              onChange={(e) => setCurrentSelection({...currentSelection, id: e.target.value})}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.quantity} in stock)</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Qty</label>
            <input 
              type="number" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] font-bold"
              value={currentSelection.qty}
              onChange={(e) => setCurrentSelection({...currentSelection, qty: e.target.value})}
            />
          </div>
          <button 
            onClick={addToCart}
            className="bg-blue-600 text-white p-4 rounded-[1.25rem] font-black hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20}/> Add to List
          </button>
        </div>

        {cart.length > 0 ? (
          <div className="space-y-4">
             {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-bold">{item.name} x {item.quantity}</p>
                  <p className="font-black">${item.subtotal}</p>
                </div>
             ))}
             <button 
               onClick={handleFinalize}
               className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black mt-4 flex items-center justify-center gap-3 shadow-2xl"
             >
               <PackageCheck size={24}/> Finalize {orderType} Order
             </button>
          </div>
        ) : (
          <div className="py-16 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
            No items in order yet.
          </div>
        )}
      </div>

      {isHistoryOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setIsHistoryOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-slate-900 z-50 p-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10 text-white">
              <h2 className="text-xl font-black uppercase tracking-tight">Transaction History</h2>
              <div className="flex items-center gap-4">
                {orderHistory.length > 0 && (
                  <button 
                    onClick={onClearHistory}
                    className="text-[10px] font-black uppercase bg-rose-600/20 text-rose-400 px-3 py-1 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Clear History
                  </button>
                )}
                <button onClick={() => setIsHistoryOpen(false)}><X size={28}/></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {orderHistory.length === 0 ? (
                <p className="text-slate-500 text-center font-bold mt-10">No transactions recorded.</p>
              ) : (
                orderHistory.map(order => (
                  <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-white">
                    <div className="flex justify-between mb-4">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${order.type === 'Sales' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {order.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">{order.timestamp}</span>
                    </div>
                    
                    {/* Items with Names and Codes */}
                    <div className="space-y-2 mb-4 border-b border-white/5 pb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono italic">{item.productCode}</p>
                          </div>
                          <p className="text-xs font-black text-slate-400">x{item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-end">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {order.id}</p>
                      <p className="text-2xl font-black text-white">${order.total}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;