import React from 'react';
import { 
  Activity, Layers, Database, Clock, Percent, Zap, 
  Play, CheckCircle2, TrendingUp, Cpu, ArrowUpRight, BarChart3 
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { SolverResult } from '../types/solver';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';

interface DashboardPageProps {
  solution: SolverResult | null;
  onRunDemo: () => void;
  onOpenModelBuilder: () => void;
  onOpenSolverExecution: () => void;
  onOpenResults: () => void;
  isSolving?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  solution,
  onRunDemo,
  onOpenModelBuilder,
  onOpenSolverExecution,
  onOpenResults,
  isSolving = false,
}) => {
  // Demo benchmark data for CPU vs GPU chart
  const cpuVsGpuData = solution?.charts.cpu_vs_gpu_execution_chart ?? [
    { problem_size: 'Small (100)', cpu_time: 0.42, gpu_time: 0.35, speedup: 1.2 },
    { problem_size: 'Medium (1K)', cpu_time: 4.85, gpu_time: 1.62, speedup: 3.0 },
    { problem_size: 'Large (15K)', cpu_time: 68.4, gpu_time: 8.55, speedup: 8.0 },
    { problem_size: 'MRPL Industrial (100K)', cpu_time: 920.0, gpu_time: 62.16, speedup: 14.8 },
  ];

  // Convergence data
  const convergenceData = solution?.charts.convergence_history ?? [
    { iteration: 1, primal_bound: 14.85, dual_bound: 10.20, gap_pct: 31.3 },
    { iteration: 5, primal_bound: 13.92, dual_bound: 11.15, gap_pct: 19.9 },
    { iteration: 10, primal_bound: 13.10, dual_bound: 11.90, gap_pct: 9.1 },
    { iteration: 15, primal_bound: 12.65, dual_bound: 12.30, gap_pct: 2.7 },
    { iteration: 19, primal_bound: 12.48, dual_bound: 12.48, gap_pct: 0.0 },
  ];

  // Resource utilization data
  const resourceData = [
    { name: 'Host CPU', util: solution?.cpu_gpu_execution.cpu_role.cpu_utilization_pct ?? 78.4, color: '#2563EB' },
    { name: 'GPU Accelerator', util: solution?.cpu_gpu_execution.gpu_role.gpu_utilization_pct ?? 62.8, color: '#06B6D4' },
    { name: 'System Memory', util: solution?.cpu_gpu_execution.memory.utilization_pct ?? 68.2, color: '#8B5CF6' },
  ];

  // Optimization Status distribution
  const statusData = [
    { name: 'Optimal', count: 18, color: '#10B981' },
    { name: 'Feasible', count: 4, color: '#3B82F6' },
    { name: 'Infeasible', count: 2, color: '#EF4444' },
    { name: 'Running', count: isSolving ? 1 : 0, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* MRPL Refinery Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-700/80 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 text-xs font-mono font-semibold border border-cyan-800">
              SIH 2026 Problem Statement ID: 26119
            </span>
            <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800">
              MRPL Smart Automation
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Indigenous Mathematical Optimization Platform
          </h2>
          
          <p className="text-sm text-slate-300 leading-relaxed">
            High-performance mathematical solver integrating continuous LP relaxation, Branch & Bound mixed-integer programming (MILP), and sparse GPU acceleration (CUDA SpMV) for Mangalore Refinery & Petrochemicals Limited industrial scheduling.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onRunDemo}
              disabled={isSolving}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-xs sm:text-sm text-white shadow-lg shadow-cyan-500/25 flex items-center transition disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-4 h-4 mr-2 fill-current ${isSolving ? 'animate-spin' : ''}`} />
              {isSolving ? 'Running Simulated Solver Pipeline...' : 'LOAD DEMO REFINERY MODEL'}
            </button>

            <button
              onClick={onOpenModelBuilder}
              className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Configure Refinery Variables
            </button>

            <button
              onClick={onOpenSolverExecution}
              className="px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              View Solver Execution Pipeline →
            </button>
          </div>
        </div>

        {/* Decorative background grid pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
      </div>

      {/* 6 Required Dashboard KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Active Models */}
        <MetricCard
          title="Active Models"
          value={3}
          subtitle="MRPL Crude Blends"
          icon={Layers}
          trend="+1 Added"
          trendType="accent"
          isDemo={true}
        />

        {/* 2. Variables */}
        <MetricCard
          title="Variables"
          value={solution?.variables_count ?? 12}
          unit="Decisions"
          subtitle="9 Continuous, 2 Binary"
          icon={Database}
          trend="Presolved"
          trendType="positive"
          isDemo={true}
        />

        {/* 3. Constraints */}
        <MetricCard
          title="Constraints"
          value={solution?.constraints_count ?? 18}
          unit="Equations"
          subtitle="Material, Demand & Unit"
          icon={Activity}
          trend="100% Satisfied"
          trendType="positive"
          isDemo={true}
        />

        {/* 4. Last Optimization Time */}
        <MetricCard
          title="Last Solve Time"
          value={solution?.runtime_seconds ?? 2.84}
          unit="sec"
          subtitle="Simulated C++ Runtime"
          icon={Clock}
          trend="3.3x Speedup"
          trendType="accent"
          isDemo={true}
        />

        {/* 5. Optimality Gap */}
        <MetricCard
          title="Optimality Gap"
          value={`${solution?.optimality_gap ?? 0.00}%`}
          subtitle="Proven Global Optimum"
          icon={Percent}
          trend="Optimal (0.00%)"
          trendType="positive"
          isDemo={true}
        />

        {/* 6. GPU Utilization */}
        <MetricCard
          title="GPU Utilization"
          value={`${solution?.cpu_gpu_execution.gpu_role.gpu_utilization_pct ?? 62.8}%`}
          subtitle="CUDA Tensor Core SpMV"
          icon={Zap}
          trend="89.2% Warp Occupancy"
          trendType="accent"
          isDemo={true}
        />
      </div>

      {/* 4 Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: CPU vs GPU Execution Time */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-cyan-600" />
                Chart A: CPU vs GPU Execution Time
              </h3>
              <p className="text-[11px] text-slate-500">Problem size vs solve execution time (seconds)</p>
            </div>
            <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
              Demo Benchmark
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cpuVsGpuData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="problem_size" tick={{ fontSize: 10, fill: '#64748b' }} angle={-10} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="cpu_time" name="CPU Only (s)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gpu_time" name="CPU + GPU Accelerated (s)" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 font-mono text-center">
            *MRPL industrial scale achieves up to 14.8x acceleration via CUDA sparse matrix SpMV kernels
          </div>
        </div>

        {/* Chart B: Solver Convergence */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                Chart B: Solver Convergence
              </h3>
              <p className="text-[11px] text-slate-500">Iteration vs Primal & Dual Bounds (₹ Crores)</p>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
              0.00% Gap Reached
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="iteration" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Iteration', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[10, 16]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="primal_bound" name="Primal Upper Bound (Cost)" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="dual_bound" name="Dual Lower Bound (Relaxation)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-400 font-mono text-center">
            *Strong branching and cutting planes drive gap closure at iteration 19
          </div>
        </div>

        {/* Chart C: Resource Utilization */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <Cpu className="w-4 h-4 mr-2 text-purple-600" />
                Chart C: Resource Utilization
              </h3>
              <p className="text-[11px] text-slate-500">Live hardware computational utilization during solve</p>
            </div>
            <span className="text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded">
              Real-Time Simulated
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {resourceData.map((res, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">{res.name}</span>
                  <span className="font-mono font-bold text-slate-900">{res.util}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${res.util}%`, backgroundColor: res.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200 space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span>CPU Cores: <strong>16 Threads</strong></span>
              <span>Host RAM: <strong>142.6 MB</strong></span>
            </div>
            <div className="flex justify-between font-mono text-[11px]">
              <span>GPU Target: <strong>CUDA / Indigenous</strong></span>
              <span>VRAM Allocated: <strong>312.4 MB</strong></span>
            </div>
          </div>
        </div>

        {/* Chart D: Optimization Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                Chart D: Optimization Status
              </h3>
              <p className="text-[11px] text-slate-500">Distribution of historical model runs</p>
            </div>
            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
              24 Runs Logged
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={onOpenResults}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center cursor-pointer"
            >
              Inspect Latest Optimal Schedule <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
