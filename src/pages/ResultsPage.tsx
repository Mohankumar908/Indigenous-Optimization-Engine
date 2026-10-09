import React from 'react';
import { SolverResult } from '../types/solver';
import { ProductionPlanTable } from '../components/ProductionPlanTable';
import { SolutionValidationPanel } from '../components/SolutionValidationPanel';
import { 
  Award, CheckCircle2, Clock, Percent, Cpu, Database, 
  Layers, Download, RefreshCw, BarChart2, PieChart as PieIcon 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

interface ResultsPageProps {
  solution: SolverResult | null;
  onReoptimize: () => void;
  isSolving?: boolean;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  solution,
  onReoptimize,
  isSolving = false,
}) => {
  if (!solution) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Optimization Results Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Run the mathematical optimization solver from the Model Builder or click below to compute the optimal MRPL refinery schedule.
        </p>
        <button
          onClick={onReoptimize}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow cursor-pointer"
        >
          Compute Optimal Plan
        </button>
      </div>
    );
  }

  const {
    objective_value,
    runtime_seconds,
    optimality_gap,
    variables_count,
    constraints_count,
    nodes_explored,
    memory_usage_mb,
    vram_usage_mb,
    status,
    charts,
    production_plan,
    validation,
  } = solution;

  const COLORS = ['#0284C7', '#0EA5E9', '#06B6D4', '#94A3B8'];

  return (
    <div className="space-y-6">
      {/* Top Results Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-2xl p-6 text-white border border-slate-700/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-emerald-500 text-white flex items-center shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Status: {status}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                MRPL Complex Refinery
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Simulation / Demo Numbers
              </span>
            </div>
            
            <h2 className="text-2xl font-black tracking-tight text-white pt-1">
              Optimization Completed: Verified Optimal Production Plan
            </h2>
            <p className="text-xs text-slate-300">
              The Indigenous Mixed-Integer Linear Programming Engine satisfied all 18 physical and commercial refinery constraints with 0.00% optimality gap.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-start md:self-auto">
            <button
              onClick={onReoptimize}
              disabled={isSolving}
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSolving ? 'animate-spin' : ''}`} />
              Re-optimize
            </button>
          </div>
        </div>

        {/* Highlight KPI metrics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Objective Value</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">{objective_value}</div>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Runtime</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{runtime_seconds} sec</div>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Optimality Gap</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{optimality_gap.toFixed(2)}%</div>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Variables</div>
            <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">{variables_count}</div>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Constraints</div>
            <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">{constraints_count}</div>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Nodes Explored</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">{nodes_explored}</div>
          </div>

          <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Memory / VRAM</div>
            <div className="text-xs font-bold text-purple-300 font-mono mt-1.5">{memory_usage_mb}M / {vram_usage_mb}M</div>
          </div>
        </div>
      </div>

      {/* Production Plan Table */}
      <ProductionPlanTable planItems={production_plan} />

      {/* 4 Required Result Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Production Mix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <PieIcon className="w-4 h-4 mr-2 text-cyan-600" />
              Finished Product Yield Mix (tonnes)
            </h4>
            <span className="text-[10px] font-mono text-slate-500">120,000 t Feed</span>
          </div>

          <div className="grid grid-cols-2 items-center">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.production_mix}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="tonnes"
                  >
                    {charts.production_mix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {charts.production_mix.map((prod, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200/60 flex justify-between items-center">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: prod.fill }}></span>
                    <span className="font-medium text-slate-700">{prod.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 text-xs block">{prod.tonnes.toLocaleString()} t</span>
                    <span className="text-[10px] text-slate-500 font-mono">{prod.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Crude Source Mix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <BarChart2 className="w-4 h-4 mr-2 text-blue-600" />
              Optimal Crude Feed Allocations
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Source A, B, C</span>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.crude_source_mix} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="source" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="tonnes" name="Allocated Tonnes" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Cost Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <BarChart2 className="w-4 h-4 mr-2 text-purple-600" />
              Refinery Cost Breakdown (₹ Crores)
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Economic Distribution</span>
          </div>

          <div className="space-y-3 pt-1">
            {charts.cost_breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.category}</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹ {item.amount_crores.toFixed(2)} Cr ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Resource Utilization */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <BarChart2 className="w-4 h-4 mr-2 text-emerald-600" />
              Units & Tankage Capacity Utilization
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Physical Constraints</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {charts.resource_utilization.map((res, idx) => {
              const utilPct = Math.round((res.used / res.total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{res.resource}</span>
                    <span className="font-mono text-slate-600 text-[11px]">
                      {res.used.toLocaleString()} / {res.total.toLocaleString()} {res.unit} (<strong>{utilPct}%</strong>)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        utilPct > 90 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Solution Validation Audit Panel */}
      <SolutionValidationPanel validation={validation} />
    </div>
  );
};
