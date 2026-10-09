import React from 'react';
import { Cpu, Zap, Activity, Database, GitBranch, Layers, ShieldCheck, Play, Award, Terminal } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunDemo: () => void;
  isSolving?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onRunDemo, isSolving }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'model_builder', label: 'Model Builder', icon: Layers },
    { id: 'solver_execution', label: 'Solver Execution', icon: Zap },
    { id: 'results', label: 'Results & Plan', icon: ShieldCheck },
    { id: 'benchmarks', label: 'Benchmarks', icon: GitBranch },
    { id: 'architecture', label: 'Architecture & CUDA', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Top organization announcement bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-cyan-400 font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 mr-1 text-amber-400" />
            SIH 2026 Problem ID: 26119
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-medium">
            Organization: <strong className="text-white">Mangalore Refinery and Petrochemicals Limited (MRPL)</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Theme: Smart Automation</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
            Hybrid CPU+GPU Accelerator Active
          </span>
          <span className="text-slate-400 font-mono">v1.0-indigenous</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white font-bold ring-2 ring-cyan-400/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center">
                  Indigenous Optimization Engine
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 text-cyan-300 rounded border border-cyan-800">
                  MILP / GPU
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Hybrid CPU-GPU Mathematical Optimization Platform
              </p>
            </div>
          </div>

          {/* Quick Demo CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onRunDemo}
              disabled={isSolving}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-md shadow-cyan-500/25 border border-cyan-400/40 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 mr-1.5 fill-current ${isSolving ? 'animate-spin' : ''}`} />
              {isSolving ? 'Solving Pipeline...' : 'LOAD DEMO REFINERY MODEL'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-800 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
