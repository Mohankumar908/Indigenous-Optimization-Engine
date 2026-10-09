import React from 'react';
import { SolverResult } from '../types/solver';
import { PresolverFlow } from '../components/PresolverFlow';
import { SolverExecutionView } from '../components/SolverExecutionView';
import { CpuGpuArchitectureView } from '../components/CpuGpuArchitectureView';
import { BranchAndBoundTree } from '../components/BranchAndBoundTree';
import { Zap, Play, CheckCircle2, ArrowRight } from 'lucide-react';

interface SolverExecutionPageProps {
  solution: SolverResult | null;
  isSolving: boolean;
  onRunOptimization: () => void;
  onViewResults: () => void;
}

export const SolverExecutionPage: React.FC<SolverExecutionPageProps> = ({
  solution,
  isSolving,
  onRunOptimization,
  onViewResults,
}) => {
  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
              <Zap className="w-5 h-5 mr-2 text-cyan-600" />
              Solver Execution & Heterogeneous Pipeline
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              {isSolving ? 'EXECUTING...' : solution ? 'OPTIMAL SOLUTION VERIFIED' : 'READY TO RUN'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual inspection of Presolver matrix reduction, CPU-GPU workload distribution, and Branch & Bound tree exploration
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRunOptimization}
            disabled={isSolving}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition disabled:opacity-50 flex items-center cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 mr-1.5 fill-current ${isSolving ? 'animate-spin' : ''}`} />
            {isSolving ? 'Solving Pipeline...' : 'Run Optimization'}
          </button>

          {solution && (
            <button
              onClick={onViewResults}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 flex items-center shadow transition cursor-pointer"
            >
              <span>Production Schedule</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Presolver Stage */}
      <PresolverFlow presolveData={solution?.presolver} isActive={true} />

      {/* 2. MILP Solver Pipeline Animation */}
      <SolverExecutionView
        onRunOptimization={onRunOptimization}
        isSolving={isSolving}
        solution={solution}
        onViewResults={onViewResults}
      />

      {/* 3. CPU + GPU Execution View (Heterogeneous Workload Split) */}
      <CpuGpuArchitectureView
        executionReport={solution?.cpu_gpu_execution}
        isSimulating={isSolving}
      />

      {/* 4. Branch and Bound Decision Tree */}
      <BranchAndBoundTree
        treeData={solution?.branch_and_bound}
        isAnimating={isSolving}
      />
    </div>
  );
};
