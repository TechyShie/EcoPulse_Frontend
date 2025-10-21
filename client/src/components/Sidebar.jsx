import React from "react";
import { Activity, Settings, Leaf, BarChart3, Target } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-80 h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white flex flex-col p-8 shadow-2xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Logo Section */}
      <div className="mb-16 relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-green-400/30 hover:border-green-400/50 transition-all duration-300 group">
            <Leaf className="w-8 h-8 text-green-100 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">EcoPulse</h2>
            <p className="text-green-200 text-sm font-medium">Carbon Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-3 relative z-10">
        <a
          href="/dashboard"
          className="group/nav flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-green-400/40 transition-all duration-300 shadow-lg hover:shadow-green-400/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl flex items-center justify-center group-hover/nav:from-green-400/30 group-hover/nav:to-emerald-400/30 transition-all duration-300 border border-green-400/20 group-hover/nav:border-green-400/40 shadow-md group-hover/nav:shadow-green-400/30">
            <BarChart3 size={20} className="text-green-100 group-hover/nav:text-white group-hover/nav:scale-110 transition-all duration-300" />
          </div>
          <span className="font-semibold text-lg text-white group-hover/nav:text-green-100 transition-colors duration-300">
            Dashboard
          </span>
          <div className="w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse ml-auto"></div>
        </a>

        <a
          href="#"
          className="group/nav flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-blue-400/40 transition-all duration-300 shadow-lg hover:shadow-blue-400/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-xl flex items-center justify-center group-hover/nav:from-blue-400/30 group-hover/nav:to-indigo-400/30 transition-all duration-300 border border-blue-400/20 group-hover/nav:border-blue-400/40 shadow-md group-hover/nav:shadow-blue-400/30">
            <Activity size={20} className="text-blue-100 group-hover/nav:text-white group-hover/nav:scale-110 transition-all duration-300" />
          </div>
          <span className="font-semibold text-lg text-white group-hover/nav:text-blue-100 transition-colors duration-300">
            Activities
          </span>
          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse ml-auto"></div>
        </a>

        <a
          href="#"
          className="group/nav flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-purple-400/40 transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl flex items-center justify-center group-hover/nav:from-purple-400/30 group-hover/nav:to-pink-400/30 transition-all duration-300 border border-purple-400/20 group-hover/nav:border-purple-400/40 shadow-md group-hover/nav:shadow-purple-400/30">
            <Target size={20} className="text-purple-100 group-hover/nav:text-white group-hover/nav:scale-110 transition-all duration-300" />
          </div>
          <span className="font-semibold text-lg text-white group-hover/nav:text-purple-100 transition-colors duration-300">
            Goals
          </span>
          <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60 animate-pulse ml-auto"></div>
        </a>

        <a
          href="#"
          className="group/nav flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-orange-400/40 transition-all duration-300 shadow-lg hover:shadow-orange-400/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-xl flex items-center justify-center group-hover/nav:from-orange-400/30 group-hover/nav:to-red-400/30 transition-all duration-300 border border-orange-400/20 group-hover/nav:border-orange-400/40 shadow-md group-hover/nav:shadow-orange-400/30">
            <Settings size={20} className="text-orange-100 group-hover/nav:text-white group-hover/nav:scale-110 transition-all duration-300" />
          </div>
          <span className="font-semibold text-lg text-white group-hover/nav:text-orange-100 transition-colors duration-300">
            Settings
          </span>
          <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-pulse ml-auto"></div>
        </a>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-white/20 relative z-10">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <p className="text-green-200 text-sm font-medium">Track your impact</p>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-green-300">
            <div className="w-2 h-2 bg-green-400 rounded-full pulse-indicator"></div>
            <span>Live data</span>
          </div>
          <div className="text-xs text-green-400 opacity-75 font-medium">
            © 2025 EcoPulse Analytics
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
