import React from 'react';
import { Cpu, Zap, Database, ArrowRight, ArrowLeft, RefreshCw, HardDrive, ShieldCheck, Activity } from 'lucide-react';
import { CpuGpuExecutionReport } from '../types/solver';

interface CpuGpuArchitectureViewProps {
  executionReport?: CpuGpuExecutionReport;
  isSimulating?: boolean;
}

export const CpuGpuArchitectureView: React.FC<CpuGpuArchitectureViewProps> = ({
  executionReport,
  isSimulating = false,
}) => {
  const cpuPct = executionReport?.cpu_role.cpu_utilization_pct ?? 78.4;
  const gpuPct = executionReport?.gpu_role.gpu_utilization_pct ?? 62.8;
  const memPct = executionReport?.memory.utilization_pct ?? 68.2;

  const cpuTasks = executionReport?.cpu_role.tasks ?? [
    "Branch-and-Bound tree management",
    "Node selection (Best-Bound Search)",
    "Presolving & bound propagation",
    "Gomory cutting planes generation",
    "Primal heuristics (Feasibility Pump)",
    "Memory management & solver control"
  ];

  const gpuTasks = executionReport?.gpu_role.tasks ?? [
    "Sparse Matrix-Vector Multiplication (SpMV - CSR format)",
    "Constraint parallel evaluation",
    "Objective gradient & dot products",
    "Massive vector operations & SIMD arithmetic",
    "Parallel batch feasibility checks for 512 candidate nodes"
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header with simulation tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center">
              Hybrid CPU-GPU Architecture & Workload Split
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              Prototype Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Heterogeneous decomposition: Latency-sensitive B&B decision logic on Host CPU + High-throughput matrix kernels on GPU
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5"></span>
            PCIe Gen4 / C++ FFI Active
          </span>
        </div>
      </div>

      {/* Real-time Utilization Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Utilization */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase text-slate-600 flex items-center">
              <Cpu className="w-4 h-4 mr-1.5 text-blue-600" />
              CPU Host Utilization
            </span>
            <span className="font-mono text-sm font-bold text-slate-900">{cpuPct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${cpuPct}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500">
            <span>16 Cores Allocated</span>
            <span className="font-mono">{executionReport?.cpu_role.time_ms ?? 1980.5} ms</span>
          </div>
        </div>

        {/* GPU Utilization */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase text-slate-600 flex items-center">
              <Zap className="w-4 h-4 mr-1.5 text-cyan-600" />
              GPU Kernel Utilization
            </span>
            <span className="font-mono text-sm font-bold text-cyan-700">{gpuPct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${gpuPct}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500">
            <span>CUDA Warp Occupancy: 89.2%</span>
            <span className="font-mono">{executionReport?.gpu_role.time_ms ?? 859.5} ms</span>
          </div>
        </div>

        {/* Memory Utilization */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold uppercase text-slate-600 flex items-center">
              <Database className="w-4 h-4 mr-1.5 text-purple-600" />
              Unified Memory Bus
            </span>
            <span className="font-mono text-sm font-bold text-slate-900">{memPct}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mt-2">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${memPct}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500">
            <span>Host: 142MB | VRAM: 312MB</span>
            <span className="text-purple-700 font-semibold">Zero-Copy DMA</span>
          </div>
        </div>
      </div>

      {/* Main Architecture Diagram with Interactive Bus */}
      <div className="bg-slate-900 rounded-xl p-6 text-white border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-center">
          
          {/* CPU Box (Host) */}
          <div className="lg:col-span-3 bg-slate-800/90 rounded-lg p-5 border border-blue-500/40 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-400 font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">CPU Host Manager</h4>
                  <span className="text-[10px] text-blue-300 font-mono">Control & Tree Traversal</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                16 Threads
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Allocated CPU Responsibilities:
              </span>
              {cpuTasks.map((task, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="text-blue-400 font-mono mt-0.5">•</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated High-Speed Interconnect Bus */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-4 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold text-center">
              PCIe 4.0 x16 / NVLink Bus
            </div>
            
            <div className="w-full relative py-2 flex flex-col items-center justify-center">
              <div className="w-full h-1 bg-slate-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 animate-data-flow"></div>
              </div>
              <div className="flex justify-between w-full text-slate-400 text-[10px] mt-1 font-mono">
                <span>TX: CSR Matrices</span>
                <span>RX: Feasible Nodes</span>
              </div>
            </div>

            <div className="text-[10px] bg-slate-800 px-2 py-1 rounded text-cyan-300 border border-slate-700 font-mono text-center">
              64.0 GB/s Bandwidth
            </div>
          </div>

          {/* GPU Box (Accelerator) */}
          <div className="lg:col-span-3 bg-slate-800/90 rounded-lg p-5 border border-cyan-500/40 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-cyan-600/30 border border-cyan-500 flex items-center justify-center text-cyan-400 font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">GPU Vector Accelerator</h4>
                  <span className="text-[10px] text-cyan-300 font-mono">CUDA / Indigenous Kernels</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Massive SIMD
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Accelerated GPU Responsibilities:
              </span>
              {gpuTasks.map((task, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <span className="text-cyan-400 font-mono mt-0.5">•</span>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footnote note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Target Architecture: C++/CUDA library <code className="text-cyan-400">libindigenous_solver.so</code></span>
          <span className="text-amber-400">Simulation metrics for SIH evaluation</span>
        </div>
      </div>
    </div>
  );
};
