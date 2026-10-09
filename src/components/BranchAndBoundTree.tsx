import React, { useState } from 'react';
import { GitBranch, CheckCircle2, XCircle, AlertCircle, Award, ZoomIn, Play, Info } from 'lucide-react';
import { BranchAndBoundData, BranchAndBoundNode } from '../types/solver';

interface BranchAndBoundTreeProps {
  treeData?: BranchAndBoundData;
  isAnimating?: boolean;
}

export const BranchAndBoundTree: React.FC<BranchAndBoundTreeProps> = ({
  treeData,
  isAnimating = false,
}) => {
  const [selectedNode, setSelectedNode] = useState<any>({
    id: "node_4",
    label: "Branch: Unit_2 = 1",
    status: "optimal",
    lp_obj: 12.48,
    depth: 2,
    detail: "Global Optimal Integer Solution satisfying all MRPL operational limits"
  });

  const stats = treeData?.stats ?? {
    nodes_explored: 19,
    nodes_pruned: 8,
    integer_solutions_found: 3,
    best_objective_cr: 12.48,
    optimality_gap: 0.00,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimal':
        return { bg: 'bg-emerald-500 text-white border-emerald-600', label: 'Best Integer (Optimal)' };
      case 'feasible':
        return { bg: 'bg-blue-500 text-white border-blue-600', label: 'Feasible Relaxation' };
      case 'pruned_bound':
        return { bg: 'bg-amber-500 text-white border-amber-600', label: 'Pruned by Bound' };
      case 'pruned_infeasible':
        return { bg: 'bg-rose-500 text-white border-rose-600', label: 'Pruned (Infeasible)' };
      default:
        return { bg: 'bg-slate-600 text-white border-slate-700', label: status };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitBranch className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Branch-and-Bound Search Tree Visualization
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              Dual Bounding Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulates parallel node bounding with Gomory cuts and GPU batch feasibility filtering
          </p>
        </div>

        {/* Tree Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            Optimal Solution
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
            Feasible LP Node
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            Pruned (Bound)
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5"></span>
            Pruned (Infeasible)
          </span>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Nodes Explored</div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{stats.nodes_explored}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Nodes Pruned</div>
          <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{stats.nodes_pruned}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Best Objective (Cost)</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">₹ {stats.best_objective_cr.toFixed(2)} Cr</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-500">Optimality Gap</div>
          <div className="text-xl font-bold font-mono text-blue-600 mt-0.5">{stats.optimality_gap.toFixed(2)}%</div>
        </div>
      </div>

      {/* Visual Interactive Tree Graphic */}
      <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="text-xs font-mono text-slate-400 mb-6 flex justify-between items-center">
          <span>INTERACTIVE B&B DECISION GRAPH (Click nodes to inspect LP bounds)</span>
          <span className="text-cyan-400">Search Strategy: Best-Bound / Strong Branching</span>
        </div>

        <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto py-2">
          
          {/* LEVEL 0: Root Node */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setSelectedNode({
                id: "node_0",
                label: "Root Continuous Relaxation",
                status: "feasible",
                lp_obj: 12.18,
                fractional_var: "x1 (Crude Source A) = 3.72",
                depth: 0,
                detail: "Continuous LP relaxation solved via GPU-accelerated Simplex. Found fractional value on crude source A."
              })}
              className="p-3 rounded-lg bg-blue-900/80 border-2 border-blue-400 text-white shadow-lg text-center w-64 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="text-[10px] font-mono text-blue-200 font-bold uppercase">Root Node #0</div>
              <div className="text-xs font-bold mt-0.5">Continuous LP: ₹ 12.18 Cr</div>
              <div className="text-[11px] text-cyan-300 font-mono mt-0.5">Fractional: x1 = 3.72</div>
            </button>
          </div>

          {/* Connectors to Level 1 */}
          <div className="w-full flex justify-center items-center space-x-32 text-slate-500 text-xs font-mono">
            <div className="flex flex-col items-center">
              <span className="text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                x1 ≤ 3.0
              </span>
              <div className="w-0.5 h-6 bg-slate-700"></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-rose-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                x1 ≥ 4.0
              </span>
              <div className="w-0.5 h-6 bg-slate-700"></div>
            </div>
          </div>

          {/* LEVEL 1: Branch Children */}
          <div className="w-full flex justify-around items-start">
            
            {/* Left Branch (Node 1 - Feasible) */}
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => setSelectedNode({
                  id: "node_1",
                  label: "Branch: x1 ≤ 3.0",
                  status: "feasible",
                  lp_obj: 12.35,
                  depth: 1,
                  fractional_var: "Unit_2 (FCCU) = 0.64",
                  detail: "Constrained crude allocation on source A. Unit 2 status fractional (0.64). Further branching required."
                })}
                className="p-3 rounded-lg bg-blue-900/70 border-2 border-blue-400 text-white w-56 text-center hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-[10px] font-mono text-blue-200 font-bold">Node #1 [x1 ≤ 3.0]</div>
                <div className="text-xs font-bold text-white">LP Bound: ₹ 12.35 Cr</div>
                <div className="text-[11px] text-cyan-300 font-mono">Unit_2 = 0.64 (Fractional)</div>
              </button>

              {/* Sub-branch connectors */}
              <div className="w-full flex justify-around text-slate-500 text-xs font-mono">
                <div className="flex flex-col items-center">
                  <span className="text-amber-400 text-[10px]">z2 = 0</span>
                  <div className="w-0.5 h-4 bg-slate-700"></div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-emerald-400 text-[10px]">z2 = 1</span>
                  <div className="w-0.5 h-4 bg-slate-700"></div>
                </div>
              </div>

              {/* LEVEL 2: Leaves under Node 1 */}
              <div className="flex space-x-3">
                {/* Node 3 - Pruned by Bound */}
                <button
                  onClick={() => setSelectedNode({
                    id: "node_3",
                    label: "Branch: Unit_2 = 0 (Offline)",
                    status: "pruned_bound",
                    lp_obj: 13.80,
                    depth: 2,
                    detail: "FCCU Unit 2 shut down. Objective shoots to ₹ 13.80 Cr due to heavy diesel penalty. Pruned because bound exceeds best incumbent (12.48)."
                  })}
                  className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-600 text-amber-200 w-28 text-center hover:scale-105 transition cursor-pointer"
                >
                  <div className="text-[9px] font-mono text-amber-400 font-bold">Node #3</div>
                  <div className="text-[11px] font-bold">₹ 13.80 Cr</div>
                  <div className="text-[9px] text-amber-400">Pruned: Bound</div>
                </button>

                {/* Node 4 - Optimal integer solution! */}
                <button
                  onClick={() => setSelectedNode({
                    id: "node_4",
                    label: "Branch: Unit_2 = 1 (Online)",
                    status: "optimal",
                    lp_obj: 12.48,
                    depth: 2,
                    is_best_integer: true,
                    detail: "All discrete binary and integer variables satisfy integrality. Lowest cost verified: ₹ 12.48 Cr."
                  })}
                  className="p-2.5 rounded-lg bg-emerald-950 border-2 border-emerald-400 text-emerald-100 w-32 text-center ring-2 ring-emerald-500/50 hover:scale-105 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <div className="text-[9px] font-mono text-emerald-300 font-bold flex items-center justify-center">
                    <Award className="w-3 h-3 mr-0.5 text-amber-300" /> Optimal
                  </div>
                  <div className="text-xs font-bold text-white">₹ 12.48 Cr</div>
                  <div className="text-[9px] text-emerald-300 font-mono">Gap: 0.00%</div>
                </button>
              </div>

            </div>

            {/* Right Branch (Node 2 - Infeasible) */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setSelectedNode({
                  id: "node_2",
                  label: "Branch: x1 ≥ 4.0",
                  status: "pruned_infeasible",
                  lp_obj: null,
                  depth: 1,
                  detail: "Excessive crude feed exceeds physical day-tank storage. Infeasible constraints detected by parallel GPU check."
                })}
                className="p-3 rounded-lg bg-rose-950/80 border border-rose-600 text-rose-200 w-48 text-center hover:scale-105 transition cursor-pointer"
              >
                <div className="text-[10px] font-mono text-rose-300 font-bold">Node #2 [x1 ≥ 4.0]</div>
                <div className="text-xs font-bold text-rose-200">Pruned: Infeasible</div>
                <div className="text-[10px] text-rose-400 mt-0.5">Tank Capacity Violated</div>
              </button>
            </div>

          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-700/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white font-mono">{selectedNode.label}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${getStatusBadge(selectedNode.status).bg}`}>
                  {getStatusBadge(selectedNode.status).label}
                </span>
                <span className="text-slate-400 font-mono">Depth: {selectedNode.depth}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {selectedNode.detail}
              </p>
            </div>
            <div className="shrink-0 text-right font-mono">
              <span className="text-slate-400 text-[10px] block">LP Objective Value:</span>
              <span className="text-sm font-bold text-cyan-400">
                {selectedNode.lp_obj ? `₹ ${selectedNode.lp_obj} Cr` : 'Infeasible (None)'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
