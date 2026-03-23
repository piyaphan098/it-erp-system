"use client";

import { useState } from "react";
import { Plus, Search, Minus, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { addInventoryItem, addStock, issueItem } from "@/app/(dashboard)/inventory/action";

export default function InventoryManager({ items, isAdminOrSupport }: { items: any[], isAdminOrSupport: boolean }) {
  const [q, setQ] = useState("");
  
  // Modals state
  const [showAddItem, setShowAddItem] = useState(false);
  const [stockInModal, setStockInModal] = useState<any | null>(null);
  const [stockOutModal, setStockOutModal] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(q.toLowerCase()) || 
    i.category.toLowerCase().includes(q.toLowerCase()) ||
    (i.brand && i.brand.toLowerCase().includes(q.toLowerCase()))
  );

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await addInventoryItem(formData);
    setLoading(false);
    if (result.success) {
      setShowAddItem(false);
    } else {
      setError(result.error);
    }
  };

  const handleStockIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await addStock(formData);
    setLoading(false);
    if (result.success) {
      setStockInModal(null);
    } else {
      setError(result.error);
    }
  };

  const handleStockOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await issueItem(formData);
    setLoading(false);
    if (result.success) {
      setStockOutModal(null);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IT Consumables Stock</h1>
        <div className="mt-4 sm:mt-0 space-x-3 flex">
          <a href="/inventory/transactions" className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Activity className="w-4 h-4 mr-2" /> Transaction Logs
          </a>
          {isAdminOrSupport && (
            <button onClick={() => setShowAddItem(true)} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 transition-colors">
              <Plus className="w-4 h-4 mr-2" /> Add New Item
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg border border-gray-100 dark:border-gray-800 p-4">
        <div className="relative max-w-lg mb-4">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <Search className="h-5 w-5 text-gray-400" />
           </div>
           <input
             type="text"
             placeholder="Search inventory..."
             value={q}
             onChange={(e) => setQ(e.target.value)}
             className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
           />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-black uppercase">
               <tr>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Item Name</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Category & Brand</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Current Stock</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Location</th>
                 {isAdminOrSupport && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">Actions</th>}
               </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-800">
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">No items found.</td>
                </tr>
              )}
              {filteredItems.map(item => {
                const isLowStock = item.quantity <= item.minQuantity;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                       <span className="font-semibold">{item.category}</span> {item.brand && `(${item.brand})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                       {isLowStock ? (
                         <span className="inline-flex items-center text-red-600 font-bold dark:text-red-400"><AlertTriangle className="w-4 h-4 mr-1"/> Low Stock</span>
                       ) : (
                         <span className="inline-flex items-center text-green-600 font-medium dark:text-green-400"><CheckCircle2 className="w-4 h-4 mr-1"/> Good</span>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                       {item.quantity} {item.unit || "pcs"} <span className="text-xs text-gray-400 font-normal">(Min: {item.minQuantity})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.location || "-"}</td>
                    {isAdminOrSupport && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                         <button onClick={() => setStockInModal(item)} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60">
                           <Plus className="w-3.5 h-3.5 mr-1"/> Stock In
                         </button>
                         <button onClick={() => setStockOutModal(item)} className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:hover:bg-orange-800/60">
                           <Minus className="w-3.5 h-3.5 mr-1"/> Issue Item
                         </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-70" onClick={() => setShowAddItem(false)}></div>
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full p-6 relative border border-gray-700">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Inventory Master</h3>
               {error && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-2 rounded">{error}</div>}
               <form onSubmit={handleAddItem} className="space-y-4">
                 <div><label className="block text-sm font-medium text-gray-300">Item Name *</label><input required name="name" type="text" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-medium text-gray-300">Category *</label><input required name="category" type="text" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" placeholder="e.g. Peripherals" /></div>
                   <div><label className="block text-sm font-medium text-gray-300">Brand</label><input name="brand" type="text" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-medium text-gray-300">Min Quantity</label><input name="minQuantity" type="number" defaultValue="5" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                   <div><label className="block text-sm font-medium text-gray-300">Unit</label><input name="unit" type="text" defaultValue="pcs" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 </div>
                 <div><label className="block text-sm font-medium text-gray-300">Current Stock</label><input name="quantity" type="number" defaultValue="0" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div><label className="block text-sm font-medium text-gray-300">Location</label><input name="location" type="text" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" placeholder="e.g. Store Room A" /></div>
                 <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                   <button disabled={loading} type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">{loading ? "Saving..." : "Save Item"}</button>
                   <button type="button" onClick={() => setShowAddItem(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                 </div>
               </form>
            </div>
          </div>
        </div>
      )}

      {stockInModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-70" onClick={() => setStockInModal(null)}></div>
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md w-full p-6 relative border border-gray-700">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Stock In: {stockInModal.name}</h3>
               {error && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-2 rounded">{error}</div>}
               <form onSubmit={handleStockIn} className="space-y-4 mt-4">
                 <input type="hidden" name="itemId" value={stockInModal.id} />
                 <div><label className="block text-sm font-medium text-gray-300">Quantity to Add *</label><input required min="1" name="quantity" type="number" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div><label className="block text-sm font-medium text-gray-300">Reason / Reference</label><input name="reason" type="text" placeholder="e.g. Restock from Supplier A" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                   <button disabled={loading} type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">{loading ? "Saving..." : "Confirm Stock In"}</button>
                   <button type="button" onClick={() => setStockInModal(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                 </div>
               </form>
            </div>
          </div>
        </div>
      )}

      {stockOutModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-70" onClick={() => setStockOutModal(null)}></div>
            <div className="inline-block bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md w-full p-6 relative border border-gray-700">
               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Issue Item: {stockOutModal.name}</h3>
               <p className="text-sm text-gray-400 mb-4">Current Stock: {stockOutModal.quantity}</p>
               {error && <div className="mb-4 text-sm text-red-500 bg-red-100/10 p-2 rounded">{error}</div>}
               <form onSubmit={handleStockOut} className="space-y-4">
                 <input type="hidden" name="itemId" value={stockOutModal.id} />
                 <div><label className="block text-sm font-medium text-gray-300">Quantity to Issue *</label><input required min="1" max={stockOutModal.quantity} name="quantity" type="number" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div><label className="block text-sm font-medium text-gray-300">Requested By *</label><input required name="requestedBy" type="text" placeholder="e.g. John Doe (Accounting)" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div><label className="block text-sm font-medium text-gray-300">Reason / Usage *</label><input required name="reason" type="text" placeholder="e.g. Replace broken mouse" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div><label className="block text-sm font-medium text-gray-300">Related Asset ID (Optional)</label><input name="relatedAssetId" type="text" placeholder="e.g. Device 192.168.1.55" className="mt-1 block w-full rounded-md border-gray-600 bg-gray-900 text-white shadow-sm px-3 py-2" /></div>
                 <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                   <button disabled={loading} type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">{loading ? "Processing..." : "Confirm Issue"}</button>
                   <button type="button" onClick={() => setStockOutModal(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                 </div>
               </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
