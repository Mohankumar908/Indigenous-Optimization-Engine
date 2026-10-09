import React from 'react';
import { Filter, ArrowDown, CheckCircle, Zap, Sparkles, TrendingDown, Cpu } from 'lucide-react';
import { PresolveReport } from '../types/solver';

interface PresolverFlowProps {
  presolveData?: PresolveReport;
  isActive?: boolean;
}

export const PresolverFlow: React.FC<PresolverFlowProps> = ({ presolveData, isActive = true }) => {
  const steps = [
    { title: 'Input Model', desc: 'Raw LP/MILP formulation with 18 constraints', icon: '01' },
    { title: 'Model Analysis', desc: 'Sparsity matrix inspection & coefficient checks', icon: '02' },
    { title: 'Redundant Constraint Detection', desc: 'Identify dominated & parallel hyperplanes', icon: '03' },
    { title: 'Variable Bound Tightening', desc: 'Propagate bound implications across rows', icon: '04' },
    { title: 'Constraint Simplification', desc: 'Eliminate fixed variables & zero columns', icon: '05' },
    { title: 'Reduced Model', desc: 'Optimized CSR matrix sent to GPU accelerator', icon: '06' },
    { title: 'Optimization', desc: 'Hybrid B&B tree & GPU sparse SIMD execution', icon: '07' },
  ];

  const origVars = presolveData?.original_variables ?? 12;
  const redVars = presolveData?.reduced_variables ?? 9;
  const origCons = presolveData?.original_constraints ?? 18;
  const redCons = presolveData?.reduced_constraints ?? 14;
  const redundantRemoved = presolveData?.redundant_constraints_removed ?? 4;
  const boundsTightened = presolveData?.bounds_tightened_count ?? 5;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              Indigenous Presolver & Problem Reducer
              <span className="ml-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Presolve Active
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Heuristic analysis, variable bound tightening, and redundant constraint elimination before matrix dispatch
            </p>
          </div>
        </div>

        <div className="text-right flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-mono">Presolve Runtime:</span>
          <span className="text-xs font-bold text-slate-800 font-mono bg-slate-100 px-2 py-1 rounded">
            {presolveData?.presolve_time_ms ? `${presolveData.presolve_time_ms} ms` : '15.60 ms'}
          </span>
        </div>
      </div>

      {/* Dynamic Reduction Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium">Variables Reduction</div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-slate-900 font-mono">{redVars}</span>
            <span className="text-xs text-slate-400 line-through font-mono">from {origVars}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" />
            {Math.round(((origVars - redVars) / origVars) * 100)}% compressed
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium">Constraints Reduction</div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-slate-900 font-mono">{redCons}</span>
            <span className="text-xs text-slate-400 line-through font-mono">from {origCons}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" />
            {Math.round(((origCons - redCons) / origCons) * 100)}% pruned
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium">Redundant Detected</div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-cyan-600 font-mono">{redundantRemoved}</span>
            <span className="text-xs text-slate-500">constraints</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Dominated rows purged</div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium">Bound Tightening</div>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-xl font-bold text-blue-600 font-mono">{boundsTightened}</span>
            <span className="text-xs text-slate-500">bounds</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Implied limits tightened</div>
        </div>
      </div>

      {/* Visual Pipeline Flow Diagram */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-inner">
        <div className="text-xs font-mono uppercase text-cyan-400 font-semibold mb-4 tracking-wider flex items-center">
          <Zap className="w-3.5 h-3.5 mr-1.5" />
          Presolver Execution Pipeline
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                idx === 6
                  ? 'bg-blue-950/80 border-cyan-500 text-cyan-200'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-700">
                    {step.icon}
                  </span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-bold text-xs leading-tight text-white mb-1">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 leading-snug">
                  {step.desc}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex justify-end mt-2 text-cyan-500">
                  <span className="text-xs font-mono">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
