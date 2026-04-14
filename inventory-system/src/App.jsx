import React, { useState, useEffect } from 'react';
// Added useUser to the imports below
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Bell, Globe, Search, X, Info } from 'lucide-react';

import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Manufacturing from './pages/Manufacturing';
import History from './pages/History';
import initialData from './data/inventoryData.json';


const NotificationDropdown = ({ notifications, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-800">System Alerts</h4>
              <span className="bg-blue-100 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full">
                {notifications.length} ACTIVE
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
                  No active notifications
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  
 const { user, isLoaded } = useUser();


  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_products');
      return saved ? JSON.parse(saved) : initialData.products;
    } catch (e) { return initialData.products; }
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [batches, setBatches] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_batches');
      return saved ? JSON.parse(saved) : [
        { 
          id: 'B-9001', 
          name: 'Shift-A Gears', 
          productId: 1, 
          plannedQty: 10, 
          actualQty: 0, 
          status: 'Pending', 
          materials: [{ id: 2, name: 'Raw Steel Bar', qty: 20 }], 
          startDate: null, 
          endDate: null 
        }
      ];
    } catch (e) { return []; }
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('ss_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ss_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('ss_batches', JSON.stringify(batches));
  }, [batches]);

  // Persistent notifications effect
  useEffect(() => {
    localStorage.setItem('ss_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (title, message) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
    addNotification("Inventory Update", `Added ${newProduct.name} to the system.`);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Delete this product from system?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addNotification("System Action", `Product ID ${productId} has been removed.`);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to permanently clear all transaction history?")) {
      setOrderHistory([]);
      addNotification("Data Cleaned", "Transaction history has been wiped.");
    }
  };

  const handleStockChange = (productId, amount) => {
    setProducts(prev => prev.map(item => {
      if (Number(item.id) === Number(productId)) {
        const currentQty = Number(item.quantity) || 0;
        const newQty = Math.max(0, currentQty + amount);
        
        // Notify if stock gets low
        if (newQty < 10 && currentQty >= 10) {
          addNotification("Low Stock Alert", `${item.name} is running low (${newQty} left).`);
        }
        
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCompleteOrder = (newOrder) => {
    newOrder.items.forEach(item => {
      const adjustment = newOrder.type === 'Sales' ? -item.quantity : item.quantity;
      handleStockChange(item.productId, adjustment);
    });
    setOrderHistory(prev => [newOrder, ...prev]);
    addNotification("Order Processed", `${newOrder.type} transaction ${newOrder.id} finalized.`);
  };

  const handleBatchAction = (batchId, action, extraData = {}) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    if (action === 'START') {
      for (const mat of batch.materials) {
        const invItem = products.find(p => Number(p.id) === Number(mat.id));
        if (!invItem || Number(invItem.quantity) < mat.qty) {
          alert( `Stock Error: Insufficient ${mat.name}`);
          return;
        }
      }
      batch.materials.forEach(m => handleStockChange(m.id, -m.qty));
      setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'In Progress', startDate: new Date().toLocaleString() } : b));
      
      setOrderHistory(prev => [{
        id:` MFG-USE-${batch.id}`,
        type: 'Manufacturing',
        items: batch.materials.map(m => ({ ...m, productId: m.id, name: m.name })),
        total: 0,
        status: 'Consumption',
        timestamp: new Date().toLocaleString()
      }, ...prev]);
      
      addNotification("Production Started", `Batch ${batch.name} is now in progress.`);
    }

    if (action === 'COMPLETE') {
      handleStockChange(batch.productId, Number(extraData.actualQty));
      setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'Completed', actualQty: extraData.actualQty, endDate: new Date().toLocaleString() } : b));
      addNotification("Production Finished",`Batch ${batch.name} completed. ${extraData.actualQty} units added to stock.`);
    }

    if (action === 'CANCEL') {
      if (batch.status === 'In Progress') {
        batch.materials.forEach(m => handleStockChange(m.id, m.qty));
      }
      setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: 'Cancelled' } : b));
      addNotification("Batch Cancelled", `Production for ${batch.name} was stopped.`);
    }
  };

  const handleCreateBatch = (newBatch) => {
    setBatches(prev => [newBatch, ...prev]);
    addNotification("New Batch Created", `${newBatch.name} added to the queue.`);
  };

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard': 
        return <Dashboard products={products || []} batches={batches || []} orderHistory={orderHistory || []} setView={setCurrentView} userName={user?.firstName || user?.fullName || "User"} 
 />;
      case 'inventory': 
        return <Inventory products={products || []} onAddProduct={handleAddProduct} onDeleteProduct={handleDeleteProduct} />;
      case 'orders': 
        return <Orders products={products || []} onCompleteOrder={handleCompleteOrder} orderHistory={orderHistory || []} onClearHistory={handleClearHistory} />;
      case 'manufacturing': 
        return <Manufacturing batches={batches || []} products={products || []} onAction={handleBatchAction} onCreate={handleCreateBatch} />;
      case 'history': 
        return <History orderHistory={orderHistory} onClearHistory={handleClearHistory} />;
      default: return <Dashboard products={products || []} />;
    }
  };

  return (
    <>
      <SignedOut>
        <div className="flex h-screen items-center justify-center bg-slate-900">
          <div className="text-center">
            <h1 className="text-white text-4xl font-black mb-8 tracking-tighter uppercase">Business Master <span className="text-blue-500 italic">SME</span></h1>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all transform hover:scale-105">
                ACCESS SYSTEM
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 overflow-hidden">
          <Sidebar setView={setCurrentView} currentView={currentView} />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  <Globe size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Authorized Session</span>
                </div>
                <div className="relative w-48 xl:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input type="text" placeholder="Quick Search..." className="w-full bg-slate-50 border-none rounded-full py-1.5 pl-9 pr-4 text-xs" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <NotificationDropdown 
                  notifications={notifications} 
                  onRemove={removeNotification} 
                />
                
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-800">
                      {user?.firstName || user?.fullName || "System Admin"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">Administrator</p>
                  </div>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
              <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize">{currentView}</h2>
                    <p className="text-slate-500 text-sm mt-1">Management Console</p>
                  </div>
                </header>
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {renderContent()}
                </div>
              </div>
            </main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default App;