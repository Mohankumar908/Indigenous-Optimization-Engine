export type VariableType = 'continuous' | 'integer' | 'binary';

export interface Variable {
  name: string;
  type: VariableType;
  lower_bound?: number;
  upper_bound?: number;
  objective_coeff?: number;
  unit?: string;
}

export interface Constraint {
  name: string;
  expression: string;
  sense: '<=' | '>=' | '==';
  rhs: number;
  unit?: string;
}

export interface RefineryParameters {
  crude_a_avail: number;
  crude_b_avail: number;
  crude_c_avail: number;
  crude_a_cost: number;
  crude_b_cost: number;
  crude_c_cost: number;
  unit_1_capacity: number;
  unit_2_capacity: number;
  demand_petrol: number;
  demand_diesel: number;
  demand_lpg: number;
  storage_petrol: number;
  storage_diesel: number;
  storage_lpg: number;
  transport_cost_rate: number;
  operating_cost_fixed: number;
}

export interface OptimizationModel {
  id: string;
  name: string;
  description?: string;
  model_type: string;
  objective_sense: 'minimize' | 'maximize';
  status: string;
  variables: Variable[];
  constraints: Constraint[];
  parameters: RefineryParameters;
  created_at?: string;
}

export interface PresolveStage {
  name: string;
  status: string;
  detail: string;
}

export interface PresolveReport {
  original_variables: number;
  reduced_variables: number;
  original_constraints: number;
  reduced_constraints: number;
  redundant_constraints_removed: number;
  bounds_tightened_count: number;
  zero_coefficients_purged: number;
  matrix_sparsity: string;
  presolve_time_ms: number;
  stages: PresolveStage[];
}

export interface CpuGpuExecutionReport {
  is_simulation: boolean;
  architecture: string;
  cpu_role: {
    tasks: string[];
    cores_utilized: number;
    cpu_utilization_pct: number;
    time_ms: number;
  };
  gpu_role: {
    tasks: string[];
    device_target: string;
    warp_occupancy_pct: number;
    gpu_utilization_pct: number;
    time_ms: number;
    simulated_speedup: string;
  };
  memory: {
    host_ram_mb: number;
    vram_allocated_mb: number;
    utilization_pct: number;
  };
}

export interface BranchAndBoundNode {
  id: string;
  label: string;
  status: 'active' | 'feasible' | 'infeasible' | 'pruned_bound' | 'pruned_infeasible' | 'optimal';
  lp_obj: number | null;
  fractional_var?: string;
  fractional_val?: number;
  depth: number;
  prune_reason?: string;
  is_best_integer?: boolean;
  children?: BranchAndBoundNode[];
}

export interface BranchAndBoundData {
  root: BranchAndBoundNode;
  stats: {
    nodes_explored: number;
    nodes_pruned: number;
    integer_solutions_found: number;
    best_objective_cr: number;
    optimality_gap: number;
  };
}

export interface ProductionPlanItem {
  decision: string;
  value: number | string;
  unit: string;
  type: string;
  cost_contribution?: number;
  yield_pct?: string;
  load_pct?: string;
  status: string;
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  detail: string;
}

export interface ValidationReport {
  constraint_violations: number;
  feasibility: 'VALID' | 'INFEASIBLE';
  solution_status: 'VERIFIED' | 'FAILED';
  numerical_tolerance: string;
  checks: ValidationCheck[];
}

export interface SolverResult {
  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE' | 'RUNNING';
  model_type: string;
  objective_value: string;
  objective_raw: number;
  objective_sense: string;
  runtime_seconds: number;
  optimality_gap: number;
  variables_count: number;
  constraints_count: number;
  nodes_explored: number;
  nodes_pruned: number;
  memory_usage_mb: number;
  vram_usage_mb: number;
  presolver: PresolveReport;
  cpu_gpu_execution: CpuGpuExecutionReport;
  branch_and_bound: BranchAndBoundData;
  production_plan: ProductionPlanItem[];
  validation: ValidationReport;
  charts: {
    production_mix: Array<{ name: string; tonnes: number; share: number; fill: string }>;
    crude_source_mix: Array<{ source: string; tonnes: number; cost_crores: number }>;
    cost_breakdown: Array<{ category: string; amount_crores: number; pct: number }>;
    resource_utilization: Array<{ resource: string; used: number; total: number; unit: string }>;
    convergence_history: Array<{ iteration: number; primal_bound: number; dual_bound: number; gap_pct: number }>;
    cpu_vs_gpu_execution_chart: Array<{ problem_size: string; cpu_time: number; gpu_time: number; speedup: number }>;
  };
  metadata: {
    organization: string;
    problem_statement_id: string;
    theme: string;
    solver_engine: string;
    gpu_hardware_target: string;
    simulated_notice: string;
  };
  run_id?: string;
}

export interface BenchmarkItem {
  problem_size: string;
  variables_count: number;
  constraints_count: number;
  non_zeros: number;
  cpu_time_sec: number;
  gpu_time_sec: number;
  speedup_ratio: number;
  optimality_gap: number;
}
