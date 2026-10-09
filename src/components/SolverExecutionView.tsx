import React, { useEffect, useState } from 'react';
import { 
  Play, CheckCircle2, Loader2, ArrowDown, Cpu, Zap, 
  ShieldCheck, AlertTriangle, Terminal, Sparkles, RefreshCw 
} from 'lucide-react';
import { SolverResult } from '../types/solver';

interface SolverExecutionViewProps {
  onRunOptimization: () => void;
  isSolving: boolean;
  solution?: SolverResult | null;
  onViewResults: () => void;
}

export const SolverExecutionView: React.FC<SolverExecutionViewProps> = ({
  onRunOptimization,
  isSolving,
  solution,
  onViewResults,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(isSolving ? 0 : 8);

  const pipelineStages = [
    { id: 'model', name: 'MODEL PARSER', desc: 'Syntax verification, sparsity mapping', check: 'Model Parsed' },
    { id: 'presolve', name: 'PRESOLVER', desc: 'Bound tightening & redundant row purging', check: 'Presolving Complete' },
    { id: 'lp_relax', name: 'LP RELAXATION', desc: 'Continuous primal-dual simplex initialization', check: 'LP Relaxation Complete' },
    { id: 'branch_bound', name: 'BRANCH & BOUND', desc: 'Discrete variable tree exploration & strong branching', check: 'Branch-and-Bound Complete' },
    { id: 'cutting_planes', name: 'CUTTING PLANES', desc: 'Gomory mixed-integer cuts & knapsack inequalities', check: 'Cuts Applied' },
    { id: 'heuristics', name: 'PRIMAL HEURISTICS', desc: 'Feasibility pump & relaxation enforced diving', check: 'Heuristics Converged' },
    { id: 'cpu_gpu', name: 'CPU + GPU COMPUTATION', desc: 'Sparse matrix-vector kernels (SpMV) on CUDA stream', check: 'GPU Kernels Executed' },
    { id: 'validation', name: 'SOLUTION VALIDATION', desc: '7-point feasibility audit & KKT numerical check', check: 'Solution Validated' },
    { id: 'optimal', name: 'OPTIMAL SOLUTION', desc: 'Refinery production schedule finalized with 0.00% gap', check: 'Global Optimum Confirmed' },
  ];

  useEffect(() => {
    if (isSolving) {
      setCurrentStepIndex(0);
      const interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= pipelineStages.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 350);
      return () => clearInterval(interval);
    } else if (solution) {
      setCurrentStepIndex(pipelineStages.length);
    }
  }, [isSolving, solution]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-slate-900 text-base">
              MILP Solver Execution Pipeline
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulated end-to-end execution of indigenous mathematical optimization solver
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRunOptimization}
            disabled={isSolving}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {isSolving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Executing Pipeline...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Re-Run Solver
              </>
            )}
          </button>

          {solution && (
            <button
              onClick={onViewResults}
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center border border-slate-700 transition cursor-pointer"
            >
              View Full Results →
            </button>
          )}
        </div>
      </div>

      {/* Hardware Disclosure Notice */}
      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center space-x-2 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Simulation / Demo Metrics:</strong> Hardware execution values reflect simulated benchmarks. The system is architected for drop-in C++/CUDA acceleration.
        </span>
      </div>

      {/* Execution Pipeline Steps */}
      <div className="space-y-2">
        {pipelineStages.map((stage, idx) => {
          const isComplete = currentStepIndex > idx;
          const isCurrent = isSolving && currentStepIndex === idx;

          return (
            <div
              key={stage.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-cyan-50/80 border-cyan-400 ring-1 ring-cyan-400/50 shadow-sm'
                  : isComplete
                  ? 'bg-slate-50 border-slate-200/80'
                  : 'bg-white border-slate-100 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                    isComplete
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800 tracking-wide font-mono">
                      {stage.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-100 px-1.5 py-0.2 rounded animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{stage.desc}</span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="text-right">
                {isComplete ? (
                  <span className="inline-flex items-center text-xs font-medium text-emerald-600 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {stage.check}
                  </span>
                ) : isCurrent ? (
                  <span className="text-xs font-mono text-cyan-600 font-semibold animate-pulse">
                    Computing...
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-mono">Queued</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal log preview */}
      <div className="bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-1 overflow-x-auto">
        <div className="text-cyan-400 font-bold mb-2 flex items-center text-[11px] uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 mr-1.5" />
          Indigenous Solver Kernel Output Stream (stdout)
        </div>
        <div className="text-slate-400">[0.000s] Initializing Indigenous Mixed-Integer Linear Programming Engine...</div>
        <div className="text-slate-400">[0.014s] Presolver: tight bound propagation completed on 5 variables. Purged 4 redundant constraints.</div>
        <div className="text-slate-300">[0.028s] Initial continuous LP relaxation: Objective = ₹ 12.18 Cr (Fractional x1 = 3.72)</div>
        <div className="text-cyan-300">[0.112s] CUDA: SpMV Kernel launched on 512 warps. Transferred CSR constraint matrix.</div>
        <div className="text-slate-300">[0.840s] Branch-and-bound: 19 nodes explored, 8 branches pruned by bound/infeasibility.</div>
        <div className="text-emerald-400 font-semibold">[2.840s] Optimization Status: OPTIMAL | Objective Value = ₹ 12.48 Cr | Gap = 0.00%</div>
      </div>
    </div>
  );
};
