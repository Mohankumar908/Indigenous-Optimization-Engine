import React, { useState } from 'react';
import { 
  Terminal, Cpu, Zap, Database, ArrowRight, ShieldCheck, 
  FileCode2, CheckCircle2, Copy, Check, Layers, GitMerge 
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'cuda_header' | 'cuda_kernel' | 'milp_engine' | 'sqlite_schema'>('cuda_header');
  const [copied, setCopied] = useState(false);

  const fileContents = {
    cuda_header: `// File: backend/cuda_bridge/c_cuda_solver.h
// Indigenous GPU-Accelerated Optimization Solver (MRPL / SIH 2026)

#ifndef INDIGENOUS_CUDA_SOLVER_H
#define INDIGENOUS_CUDA_SOLVER_H

#ifdef __cplusplus
extern "C" {
#endif

// Compressed Sparse Row (CSR) matrix representation on Device (GPU)
typedef struct {
    int32_t num_rows;
    int32_t num_cols;
    int32_t nnz;            // Number of non-zero elements
    double* d_values;       // GPU device pointer to non-zero values
    int32_t* d_col_indices; // GPU device pointer to column indices
    int32_t* d_row_offsets; // GPU device pointer to row offset pointers
} GpuSparseMatrixCSR;

// Launch parallel Sparse Matrix-Vector Multiplication (SpMV) on CUDA cores
void launch_cuda_spmv_csr(
    const GpuSparseMatrixCSR* A,
    const double* d_x,
    double* d_y,
    double alpha,
    double beta,
    void* cuda_stream
);

// Parallel batch feasibility check for candidate Branch & Bound nodes on GPU
void launch_cuda_parallel_feasibility_check(
    const GpuSparseMatrixCSR* A,
    const double* d_candidate_vectors,
    int32_t num_candidates,
    const double* d_rhs,
    uint8_t* d_feasibility_flags,
    void* cuda_stream
);

#ifdef __cplusplus
}
#endif
#endif`,
    cuda_kernel: `// File: backend/cuda_bridge/cuda_kernels.cu
// CUDA Kernels for High-Throughput Matrix & Constraint Acceleration

#include "c_cuda_solver.h"
#include <cuda_runtime.h>

#define WARP_SIZE 32
#define BLOCK_SIZE 256

__global__ void spmv_csr_vector_kernel(
    int num_rows,
    const double* __restrict__ values,
    const int* __restrict__ col_indices,
    const int* __restrict__ row_offsets,
    const double* __restrict__ x,
    double* __restrict__ y,
    double alpha,
    double beta
) {
    int global_warp_id = (blockIdx.x * blockDim.x + threadIdx.x) / WARP_SIZE;
    int lane_id = threadIdx.x % WARP_SIZE;
    
    if (global_warp_id < num_rows) {
        int row_start = row_offsets[global_warp_id];
        int row_end   = row_offsets[global_warp_id + 1];
        
        double sum = 0.0;
        for (int i = row_start + lane_id; i < row_end; i += WARP_SIZE) {
            sum += values[i] * x[col_indices[i]];
        }
        
        // Warp reduction using shuffle down intrinsics
        #pragma unroll
        for (int offset = WARP_SIZE / 2; offset > 0; offset /= 2) {
            sum += __shfl_down_sync(0xFFFFFFFF, sum, offset);
        }
        
        if (lane_id == 0) {
            y[global_warp_id] = alpha * sum + beta * y[global_warp_id];
        }
    }
}`,
    milp_engine: `// File: backend/solver/milp_engine.py
# Indigenous MILP Engine: Presolver, LP Relaxation & B&B Driver

class IndigenousMILPEngine:
    def __init__(self, model_dict):
        self.variables = model_dict.get("variables", [])
        self.constraints = model_dict.get("constraints", [])
        self.params = model_dict.get("parameters", {})
        
    def run_presolver(self):
        # Redundant constraint detection & bound tightening
        ...
        
    def solve_mrpl_refinery(self):
        # Coordinated CPU B&B and GPU SpMV
        ...`,
    sqlite_schema: `-- File: backend/database/db.py (Modular for PostgreSQL)
CREATE TABLE models (id TEXT PRIMARY KEY, name TEXT, raw_model JSON);
CREATE TABLE variables (model_id TEXT, name TEXT, var_type TEXT, lower_bound REAL);
CREATE TABLE constraints (model_id TEXT, name TEXT, expression TEXT, rhs REAL);
CREATE TABLE optimization_runs (id TEXT PRIMARY KEY, model_id TEXT, status TEXT, objective_value REAL);
CREATE TABLE solutions (run_id TEXT, model_id TEXT, production_plan JSON);
CREATE TABLE benchmarks (problem_size TEXT, cpu_time_sec REAL, gpu_time_sec REAL, speedup_ratio REAL);`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-cyan-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Indigenous Engine Architecture & Hardware Blueprint
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
            MRPL Problem ID: 26119
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Architectural decomposition separating high-level business models, Presolvers, host CPU Branch & Bound control, and native CUDA GPU vector kernels.
        </p>
      </div>

      {/* End-to-End Architectural Flow Diagram */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-inner">
        <div className="text-xs font-mono uppercase text-cyan-400 font-bold mb-4 flex items-center">
          <Layers className="w-4 h-4 mr-2" />
          End-to-End System Pipeline Flow
        </div>

        <div className="grid grid-cols-1 md:grid-cols-8 gap-3 items-center text-xs font-mono">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            <div className="text-slate-400 text-[10px]">01</div>
            <div className="font-bold text-white mt-1">Industrial User</div>
            <div className="text-[10px] text-slate-400 mt-1">MRPL Planner</div>
          </div>

          <div className="text-center text-cyan-400 hidden md:block">→</div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
            <div className="text-slate-400 text-[10px]">02</div>
            <div className="font-bold text-white mt-1">Python REST API</div>
            <div className="text-[10px] text-slate-400 mt-1">FastAPI / Express</div>
          </div>

          <div className="text-center text-cyan-400 hidden md:block">→</div>

          <div className="p-3 bg-slate-900 rounded-lg border border-cyan-800/80 text-center">
            <div className="text-cyan-400 text-[10px]">03</div>
            <div className="font-bold text-white mt-1">Presolver</div>
            <div className="text-[10px] text-cyan-300 mt-1">Bound Reduction</div>
          </div>

          <div className="text-center text-cyan-400 hidden md:block">→</div>

          <div className="p-3 bg-gradient-to-br from-blue-900 to-cyan-900 rounded-lg border border-cyan-500 text-center shadow-lg">
            <div className="text-cyan-300 text-[10px]">04</div>
            <div className="font-bold text-white mt-1">MILP Engine</div>
            <div className="text-[10px] text-cyan-200 mt-1">CPU + GPU Hetero</div>
          </div>

          <div className="text-center text-cyan-400 hidden md:block">→</div>

          <div className="p-3 bg-slate-900 rounded-lg border border-emerald-800 text-center">
            <div className="text-emerald-400 text-[10px]">05</div>
            <div className="font-bold text-white mt-1">Validator</div>
            <div className="text-[10px] text-emerald-300 mt-1">7-Point Audit</div>
          </div>
        </div>

        {/* Heterogeneous Workload Split Deep-Dive */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-xl p-5 border border-blue-600/40">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-3">
              <Cpu className="w-5 h-5" />
              <span>Host CPU Responsibilities (Sequential & Logic-Heavy)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono">1.</span>
                <span>Branch-and-Bound tree exploration & priority queue node ranking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono">2.</span>
                <span>Node selection heuristic (Best-Bound Search / Depth-First Dive)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono">3.</span>
                <span>Presolving, variable bound tightening, and dual reduction</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono">4.</span>
                <span>Gomory mixed-integer cutting plane generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono">5.</span>
                <span>Memory management & unified PCIe DMA stream controller</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-5 border border-cyan-500/40">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-3">
              <Zap className="w-5 h-5" />
              <span>Target GPU Responsibilities (Massive Parallel SIMD)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400 font-mono">1.</span>
                <span>Sparse Matrix-Vector Multiplication (SpMV) in CSR format</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400 font-mono">2.</span>
                <span>Parallel constraint evaluation across thousands of candidate allocations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400 font-mono">3.</span>
                <span>Objective gradient dot products and reduced cost computation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400 font-mono">4.</span>
                <span>Massive vector operations and SIMD pivot arithmetic</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400 font-mono">5.</span>
                <span>Parallel batch feasibility filtering for candidate B&B child nodes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Code Inspector for Evaluators */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center">
              <FileCode2 className="w-4 h-4 mr-2 text-cyan-600" />
              Native Code Inspector & Integration Hooks
            </h3>
            <p className="text-xs text-slate-500">
              Inspect the C++/CUDA FFI headers and kernels designed for indigenous solver compilation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg bg-slate-200/70 p-0.5 text-xs font-mono">
              {[
                { id: 'cuda_header', label: 'c_cuda_solver.h' },
                { id: 'cuda_kernel', label: 'cuda_kernels.cu' },
                { id: 'milp_engine', label: 'milp_engine.py' },
                { id: 'sqlite_schema', label: 'schema.sql' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFile(f.id as any)}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                    selectedFile === f.id
                      ? 'bg-slate-900 text-cyan-400 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4">
          <pre className="font-mono text-xs text-slate-200 overflow-x-auto max-h-96 leading-relaxed">
            {fileContents[selectedFile]}
          </pre>
        </div>
      </div>
    </div>
  );
};
