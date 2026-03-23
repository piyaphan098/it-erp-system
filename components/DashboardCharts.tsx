"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const TICKET_COLORS = {
  OPEN: '#f59e0b', // amber-500
  IN_PROGRESS: '#3b82f6', // blue-500
  RESOLVED: '#10b981', // emerald-500
};

const ASSET_COLORS = {
  AVAILABLE: '#10b981', // emerald-500
  IN_USE: '#3b82f6', // blue-500
  MAINTENANCE: '#ef4444', // red-500
};

export default function DashboardCharts({ 
  ticketsData, 
  assetsData,
  dict
}: { 
  ticketsData: { name: string, value: number }[],
  assetsData: { name: string, value: number }[],
  dict: any
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
      <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center">
          {dict.ticketsByStatus || "Tickets by Status"}
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ticketsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {ticketsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TICKET_COLORS[entry.name as keyof typeof TICKET_COLORS] || '#8884d8'} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend formatter={(value) => <span className="text-gray-700 dark:text-gray-300">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 text-center">
          {dict.assetsByStatus || "Assets by Status"}
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={assetsData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {assetsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ASSET_COLORS[entry.name as keyof typeof ASSET_COLORS] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
