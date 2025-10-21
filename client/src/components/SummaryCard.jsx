import React from "react";

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

      {/* Main card */}
      <div className="relative z-10">
        {/* Icon and title section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl flex items-center justify-center group-hover:from-green-400/30 group-hover:to-emerald-400/30 transition-all duration-300">
              <div className="text-green-300 group-hover:text-green-200 transition-colors duration-300 transform group-hover:scale-110">
                {icon}
              </div>
            </div>
            <h3 className="text-green-200 text-sm font-medium uppercase tracking-wider">{title}</h3>
          </div>
        </div>

        {/* Value section */}
        <div className="space-y-2">
          <div className="text-4xl font-bold text-white group-hover:text-green-100 transition-colors duration-300">
            {value}
          </div>

          {/* Animated underline */}
          <div className="w-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full group-hover:w-full transition-all duration-500"></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
      </div>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-50"></div>
    </div>
  );
};

export default SummaryCard;
