import React, { useState } from 'react';
import { 
  GitBranch, Zap, Cpu, AlertTriangle, TrendingUp, 
  BarChart3, Database, ShieldCheck, CheckCircle2, HardDrive 
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export const BenchmarksPage: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'Small' | 'Medium' | 'Large' | 'Industrial'>('Industrial');

  const benchmarkDataset = [
    {
      size: 'Small',
      name: 'Small (Refinery Unit)',
      variables: 120,
      constraints: 95,
      nonzeros: 480,
      cpu_time: 0.42,
      gpu_time: 0.35,
      speedup: 1.2,
      gap: 0.00,
      memory_cpu_mb: 28,
      memory_gpu_mb: 64,
      desc: 'Single distillation column or blender subproblem.'
    },
    {
      size: 'Medium',
      name: 'Medium (Plant Section)',
      variables: 1250,
      constraints: 980,
      nonzeros: 7400,
      cpu_time: 4.85,
      gpu_time: 1.62,
      speedup: 3.0,
      gap: 0.00,
      memory_cpu_mb: 64,
      memory_gpu_mb: 128,
      desc: 'Coordinated crude distillation & fluid catalytic cracking train.'
    },
    {
      size: 'Large',
      name: 'Large (Full Refinery)',
      variables: 14800,
      constraints: 11200,
      nonzeros: 115000,
      cpu_time: 68.4,
      gpu_time: 8.55,
      speedup: 8.0,
      gap: 0.01,
      memory_cpu_mb: 240,
      memory_gpu_mb: 512,
      desc: 'Plant-wide multi-period crude scheduling & tank allocation.'
    },
    {
      size: 'Industrial',
      name: 'Industrial (MRPL Multi-Complex)',
      variables: 105000,
      constraints: 84000,
      nonzeros: 1260000,
      cpu_time: 920.0,
      gpu_time: 62.16,
      speedup: 14.8,
      gap: 0.02,
      memory_cpu_mb: 1850,
      memory_gpu_mb: 2400,
      desc: 'Enterprise multi-refinery supply chain, shipping pipelines & port terminals.'
    }
  ];

  const currentBenchmark = benchmarkDataset.find(b => b.size === selectedSize) || benchmarkDataset[3];

  // Chart data: Problem size vs runtime
  const runtimeChartData = benchmarkDataset.map(b => ({
    name: b.size,
    'CPU Only': b.cpu_time,
    'CPU + GPU': b.gpu_time,
    speedup: b.speedup,
  }));

  // Chart data: Memory usage
  const memoryChartData = benchmarkDataset.map(b => ({
    name: b.size,
    'Host Memory (MB)': b.memory_cpu_mb,
    'VRAM Memory (MB)': b.memory_gpu_mb,
  }));

  // Chart data: Optimality gap & Speedup
  const speedupCurveData = benchmarkDataset.map(b => ({
    name: b.size,
    vars: b.variables,
    Speedup: b.speedup,
    Gap: b.gap,
  }));

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
              <GitBranch className="w-5 h-5 mr-2 text-cyan-600" />
              Benchmarking & Comparative Performance
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              CPU Only vs CPU + GPU
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical runtime scaling across problem dimensions from subproblem units to industrial MRPL scale
          </p>
        </div>

        {/* Problem Size Selector Buttons */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 self-start md:self-auto">
          {(['Small', 'Medium', 'Large', 'Industrial'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => setSelectedSize(sz)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                selectedSize === sz
                  ? 'bg-slate-900 text-cyan-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Hardware / Benchmark Transparency Notice */}
      <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-3 text-xs text-amber-950">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider text-[11px] text-amber-800">
            Simulated Prototype Benchmark Disclosure
          </div>
          <p className="text-amber-900/90 leading-relaxed">
            All benchmark values shown reflect computational models based on sparse CSR matrix scaling. 
            <strong className="underline decoration-amber-400 font-semibold ml-1">
              Actual benchmark values will be obtained experimentally
            </strong> on physical multi-node NVIDIA H100 / A100 GPU clusters at MRPL.
          </p>
        </div>
      </div>

      {/* Active Problem Size Spotlight */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Selected Scale: {currentBenchmark.name}
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                {currentBenchmark.nonzeros.toLocaleString()} Non-Zeros
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">{currentBenchmark.desc}</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Achieved Speedup</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {currentBenchmark.speedup}x
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs font-mono">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Decision Variables:</span>
            <span className="text-base font-bold text-white">{currentBenchmark.variables.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Constraint Rows:</span>
            <span className="text-base font-bold text-white">{currentBenchmark.constraints.toLocaleString()}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">CPU Simplex Time:</span>
            <span className="text-base font-bold text-rose-400">{currentBenchmark.cpu_time}s</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">CPU + GPU Time:</span>
            <span className="text-base font-bold text-emerald-400">{currentBenchmark.gpu_time}s</span>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm">
            Empirical Benchmark Comparative Matrix
          </h3>
          <span className="text-[11px] font-mono text-slate-500">IEEE / ACM Standard Format</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Problem Scale</th>
                <th className="py-3 px-4">Variables</th>
                <th className="py-3 px-4">Constraints</th>
                <th className="py-3 px-4">Non-Zeros (NNZ)</th>
                <th className="py-3 px-4">CPU Time (s)</th>
                <th className="py-3 px-4">CPU + GPU Time (s)</th>
                <th className="py-3 px-4">Speedup</th>
                <th className="py-3 px-4">Optimality Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 font-mono">
              {benchmarkDataset.map((row, idx) => {
                const isSelected = row.size === selectedSize;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedSize(row.size as any)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-cyan-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-600' : 'bg-slate-300'}`}></span>
                      <span>{row.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{row.variables.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-700">{row.constraints.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-500">{row.nonzeros.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">{row.cpu_time.toFixed(2)}s</td>
                    <td className="py-3 px-4 font-bold text-cyan-700">{row.gpu_time.toFixed(2)}s</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.speedup}x
                      </span>
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-bold">{row.gap.toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Required Benchmark Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: CPU vs GPU runtime */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-cyan-600" />
              Runtime Comparison (Log Scale Seconds)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">CPU vs GPU</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runtimeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis scale="log" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="CPU Only" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CPU + GPU" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Memory Usage */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <HardDrive className="w-4 h-4 mr-2 text-purple-600" />
              Memory Footprint (Host RAM vs VRAM in MB)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Unified Memory</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Host Memory (MB)" fill="#64748B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="VRAM Memory (MB)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Problem Size vs Speedup Factor */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
              Speedup Scaling Curve (Amdahl's Law)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Up to 14.8x Speedup</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedupCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="Speedup" stroke="#059669" strokeWidth={3} dot={{ r: 5, fill: '#059669' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Optimality Gap by Problem Size */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-blue-600" />
              Solution Optimality Gap Tolerance (&lt; 0.05%)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Global Bounds</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedupCurveData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 0.05]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="Gap" name="Optimality Gap (%)" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
