import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ChartSection = ({ data }) => {
  // Use provided data or fallback to mock data
  const chartData = data?.emissionTrends || [
    { month: "Jan", emissions: 400 },
    { month: "Feb", emissions: 350 },
    { month: "Mar", emissions: 300 },
    { month: "Apr", emissions: 450 },
    { month: "May", emissions: 380 },
  ];

  const categoryData = data?.categoryBreakdown || [
    { category: 'Travel', emissions: 650, percentage: 52 },
    { category: 'Food', emissions: 320, percentage: 26 },
    { category: 'Energy', emissions: 180, percentage: 14 },
    { category: 'Transport', emissions: 97, percentage: 8 }
  ];

  const COLORS = ['#10b981', '#059669', '#0f766e', '#0d9488'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Emission Trends Line Chart */}
      <div className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse"></div>
            <h3 className="text-xl font-bold text-white">Emission Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
              <Line
                type="monotone"
                dataKey="emissions"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2, fill: 'rgba(255,255,255,0.2)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Pie Chart */}
      <div className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
            <h3 className="text-xl font-bold text-white">Emissions by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="emissions"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="group bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 lg:col-span-2">
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-orange-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 animate-pulse"></div>
            <h3 className="text-xl font-bold text-white">Recent Activities</h3>
          </div>
          <div className="space-y-4">
            {data?.recentActivities?.slice(0, 5).map((activity) => (
              <div key={activity.id} className="group/item flex justify-between items-center p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 hover:border-green-400/30 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <div>
                    <p className="font-semibold text-white group-hover/item:text-green-100 transition-colors">
                      {activity.description}
                    </p>
                    <p className="text-sm text-green-200 capitalize font-medium">
                      {activity.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-300 text-lg">
                    {activity.carbon_emission} kg CO₂
                  </p>
                  <p className="text-sm text-green-200">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center text-green-200 py-8 bg-white/5 rounded-2xl border border-white/10">
                No recent activities found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
