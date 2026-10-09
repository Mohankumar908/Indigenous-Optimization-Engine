import { OptimizationModel } from '../types/solver';

export const SAMPLE_REFINERY_MODEL: OptimizationModel = {
  id: "mrpl-sample-model",
  name: "MRPL Complex Refinery Production Planning Model",
  description: "Optimization of crude mix (Arabian Light, Bonny Light, Basrah Heavy) for CDU & FCCU units to meet Petrol, Diesel, and LPG delivery obligations.",
  model_type: "MILP",
  objective_sense: "minimize",
  status: "configured",
  variables: [
    { name: "x1_crude_A", type: "continuous", lower_bound: 0, upper_bound: 60000, objective_coeff: 42000, unit: "tonnes" },
    { name: "x2_crude_B", type: "continuous", lower_bound: 0, upper_bound: 50000, objective_coeff: 39500, unit: "tonnes" },
    { name: "x3_crude_C", type: "continuous", lower_bound: 0, upper_bound: 40000, objective_coeff: 44000, unit: "tonnes" },
    { name: "y1_petrol", type: "continuous", lower_bound: 42000, upper_bound: 55000, objective_coeff: 1250, unit: "tonnes" },
    { name: "y2_diesel", type: "continuous", lower_bound: 58000, upper_bound: 70000, objective_coeff: 1100, unit: "tonnes" },
    { name: "y3_lpg", type: "continuous", lower_bound: 15000, upper_bound: 22000, objective_coeff: 950, unit: "tonnes" },
    { name: "z1_unit1", type: "binary", lower_bound: 0, upper_bound: 1, objective_coeff: 2500000, unit: "status" },
    { name: "z2_unit2", type: "binary", lower_bound: 0, upper_bound: 1, objective_coeff: 2000000, unit: "status" }
  ],
  constraints: [
    { name: "crude_availability_limit", expression: "x1 + x2 + x3 <= 140000", sense: "<=", rhs: 140000, unit: "tonnes" },
    { name: "petrol_demand_satisfaction", expression: "0.362 * (x1 + x2 + x3) >= 42000", sense: ">=", rhs: 42000, unit: "tonnes" },
    { name: "diesel_demand_satisfaction", expression: "0.495 * (x1 + x2 + x3) >= 58000", sense: ">=", rhs: 58000, unit: "tonnes" },
    { name: "lpg_demand_satisfaction", expression: "0.128 * (x1 + x2 + x3) >= 15000", sense: ">=", rhs: 15000, unit: "tonnes" },
    { name: "unit_1_capacity_limit", expression: "0.52 * (x1 + x2 + x3) - 75000 * z1 <= 0", sense: "<=", rhs: 0, unit: "tonnes" },
    { name: "unit_2_capacity_limit", expression: "0.48 * (x1 + x2 + x3) - 65000 * z2 <= 0", sense: "<=", rhs: 0, unit: "tonnes" },
    { name: "petrol_storage_limit", expression: "y1 <= 55000", sense: "<=", rhs: 55000, unit: "tonnes" },
    { name: "diesel_storage_limit", expression: "y2 <= 70000", sense: "<=", rhs: 70000, unit: "tonnes" },
    { name: "lpg_storage_limit", expression: "y3 <= 22000", sense: "<=", rhs: 22000, unit: "tonnes" }
  ],
  parameters: {
    crude_a_avail: 60000,
    crude_b_avail: 50000,
    crude_c_avail: 40000,
    crude_a_cost: 42000,
    crude_b_cost: 39500,
    crude_c_cost: 44000,
    unit_1_capacity: 75000,
    unit_2_capacity: 65000,
    demand_petrol: 42000,
    demand_diesel: 58000,
    demand_lpg: 15000,
    storage_petrol: 55000,
    storage_diesel: 70000,
    storage_lpg: 22000,
    transport_cost_rate: 850,
    operating_cost_fixed: 4500000
  }
};
