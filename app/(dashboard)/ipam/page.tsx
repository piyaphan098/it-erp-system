"use client";

import { useState } from "react";
import { 
  Search, 
  Loader2, 
  Plus, 
  Printer, 
  Monitor, 
  Server, 
  Router, 
  HelpCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { addDeviceToAssets } from "./action";

interface DeviceItem {
  ip: string;
  hostname: string;
  macAddress: string;
  vendor: string;
  os: string;
  category: string;
  icon: string;
  openPorts: number[];
  isOnline: boolean;
  lastScanned: string;
}

export default function IPAMPage() {
  const [ipRange, setIpRange] = useState("192.168.1.0/24");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<DeviceItem[]>([]);
  const [error, setError] = useState("");
  const [addedMacs, setAddedMacs] = useState<Record<string, boolean>>({});
  const [selectedIPs, setSelectedIPs] = useState<Record<string, boolean>>({});

  const handleNameChange = (ip: string, newName: string) => {
    setResults(results.map(r => r.ip === ip ? { ...r, hostname: newName } : r));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && results.length > 0) {
      const all: Record<string, boolean> = {};
      results.forEach(r => { all[r.ip] = true; });
      setSelectedIPs(all);
    } else {
      setSelectedIPs({});
    }
  };

  const handleSelectOne = (ip: string) => {
    setSelectedIPs(prev => ({ ...prev, [ip]: !prev[ip] }));
  };

  const handleSyncSelected = async () => {
    const toSync = results.filter(r => selectedIPs[r.ip] && !addedMacs[r.ip]);
    for (const device of toSync) {
      const result = await addDeviceToAssets(device);
      if (result.success) {
        setAddedMacs(prev => ({ ...prev, [device.ip]: true }));
      } else {
        alert(`Failed to add ${device.ip}: ${result.error}`);
      }
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    setError("");
    setResults([]);
    setSelectedIPs({});

    try {
      const res = await fetch(`/api/scan-network?range=${encodeURIComponent(ipRange)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to scan network");
      }

      setResults(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddToAssets = async (device: DeviceItem) => {
    // Optimistic UI update or just wait for success
    const result = await addDeviceToAssets(device);
    
    if (result.success) {
      setAddedMacs((prev) => ({ ...prev, [device.ip]: true }));
    } else {
      alert(result.error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Printer": return <Printer className="w-5 h-5 text-purple-500" />;
      case "Windows PC/Workstation": return <Monitor className="w-5 h-5 text-blue-500" />;
      case "Server": return <Server className="w-5 h-5 text-orange-500" />;
      case "Network Device/Switch": return <Router className="w-5 h-5 text-green-500" />;
      case "Server / Network Device": return <Server className="w-5 h-5 text-yellow-500" />;
      default: return <HelpCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IP Address Management (IPAM)</h1>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              IP Range (CIDR)
            </label>
            <input
              type="text"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              placeholder="e.g. 192.168.1.0/24"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={startScan}
            disabled={isScanning || !ipRange}
            className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isScanning ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Scanning Network...
              </>
            ) : (
              <>
                <Search className="-ml-1 mr-2 h-5 w-5" />
                Start Network Scan
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md flex items-start">
            <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Scan Results</h2>
        {Object.values(selectedIPs).some(Boolean) && (
          <button
            onClick={handleSyncSelected}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Sync Selected to Assets
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-black uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={results.length > 0 && Object.keys(selectedIPs).length === results.length}
                    onChange={handleSelectAll}
                    disabled={results.length === 0}
                    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Device Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-800">
              {results.length === 0 && !isScanning && !error && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No devices scanned yet. Enter an IP range and click "Start Network Scan".
                  </td>
                </tr>
              )}
              {results.map((device, idx) => (
                <tr key={`${device.ip}-${idx}`} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={!!selectedIPs[device.ip]}
                      onChange={() => handleSelectOne(device.ip)}
                      disabled={!!addedMacs[device.ip]}
                      className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${device.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {device.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{device.ip}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={device.hostname !== "Unknown Device" ? device.hostname : ""}
                      onChange={(e) => handleNameChange(device.ip, e.target.value)}
                      placeholder="Unknown Device"
                      className="text-sm font-medium text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500 focus:outline-none w-full md:w-48 pb-1"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      MAC: {device.macAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <span className="text-xl mr-2">{device.icon}</span>
                      <span>{device.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{device.vendor}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {device.os !== "Unknown OS" ? device.os : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {addedMacs[device.ip] ? (
                      <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddToAssets(device)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Sync to Assets
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
