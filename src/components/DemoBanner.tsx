import React from 'react';
import { Info, Play, RefreshCw, Cpu, Layers } from 'lucide-react';

interface DemoBannerProps {
  onRunDemo: () => void;
  onOpenModelBuilder: () => void;
  isSolving?: boolean;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onRunDemo, onOpenModelBuilder, isSolving }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900/90 via-slate-900 to-slate-900 border-b border-cyan-800/40 text-slate-200 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-400 shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-800">
                PROTOTYPE SIMULATION & ARCHITECTURAL VALIDATION
              </span>
              <span className="text-xs text-slate-400 font-mono">SIH 2026</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
              This prototype simulates an <strong>Indigenous MILP & LP Optimization Engine</strong> designed for <strong>MRPL refinery production planning</strong>. 
              The computational workflow is architected with a modular FFI/C++ interface so real <strong>CUDA GPU kernels</strong> can be connected seamlessly. All hardware metrics shown are clearly tagged as <em>Demo/Simulated</em>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            onClick={onOpenModelBuilder}
            className="px-3 py-1.5 text-xs font-medium rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Configure Model
          </button>
          <button
            onClick={onRunDemo}
            disabled={isSolving}
            className="px-3.5 py-1.5 text-xs font-bold rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 mr-1.5 fill-current ${isSolving ? 'animate-spin' : ''}`} />
            {isSolving ? 'Solving Pipeline...' : 'Run Full Workflow'}
          </button>
        </div>
      </div>
    </div>
  );
};
