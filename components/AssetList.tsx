"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { updateAssetName, deleteMultipleAssets } from "@/app/(dashboard)/assets/action";

export default function AssetList({ assets, isAdminOrSupport }: { assets: any[], isAdminOrSupport: boolean }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const handleEditClick = (id: string, currentName: string) => {
    if (!isAdminOrSupport) return;
    setEditingId(id);
    setEditName(currentName);
  };

  const saveName = async (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    await updateAssetName(id, editName);
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveName(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && assets.length > 0) {
      const all: Record<string, boolean> = {};
      assets.forEach(a => { all[a.id] = true; });
      setSelectedIds(all);
    } else {
      setSelectedIds({});
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteSelected = async () => {
    if (!confirm("Are you sure you want to delete the selected assets?")) return;
    const idsToDelete = Object.keys(selectedIds).filter(id => selectedIds[id]);
    await deleteMultipleAssets(idsToDelete);
    setSelectedIds({});
  };

  const hasSelected = Object.values(selectedIds).some(Boolean);

  return (
    <div>
      {isAdminOrSupport && hasSelected && (
        <div className="mb-4">
          <button
            onClick={handleDeleteSelected}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Selected
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              {isAdminOrSupport && (
                <th scope="col" className="px-4 py-3.5 text-left w-12">
                  <input
                    type="checkbox"
                    checked={assets.length > 0 && Object.keys(selectedIds).length === assets.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                  />
                </th>
              )}
              <th scope="col" className={`${!isAdminOrSupport ? 'pl-4 sm:pl-6' : ''} py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white`}>
                Asset Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Serial Number
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Assigned To
              </th>
              {isAdminOrSupport && (
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={isAdminOrSupport ? 6 : 5} className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No assets found.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {isAdminOrSupport && (
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      <input
                        type="checkbox"
                        checked={!!selectedIds[asset.id]}
                        onChange={() => handleSelectOne(asset.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                      />
                    </td>
                  )}
                  <td className={`whitespace-nowrap py-4 pr-3 text-sm font-medium text-gray-900 dark:text-white ${!isAdminOrSupport ? 'pl-4 sm:pl-6' : ''}`}>
                    {editingId === asset.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, asset.id)}
                          autoFocus
                          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-gray-900 dark:text-white dark:ring-gray-700"
                        />
                        <button onClick={() => saveName(asset.id)} className="text-green-600 hover:text-green-500">
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-500">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className={isAdminOrSupport ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 group flex items-center" : ""} 
                        onClick={() => handleEditClick(asset.id, asset.name)}
                        title={isAdminOrSupport ? "Click to edit" : ""}
                      >
                        {asset.name}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {asset.serialNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      asset.status === 'IN_USE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {asset.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {asset.assignedTo ? (asset.assignedTo.name || asset.assignedTo.email) : "Unassigned"}
                  </td>
                  {isAdminOrSupport && (
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/assets/${asset.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        Details<span className="sr-only">, {asset.name}</span>
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
