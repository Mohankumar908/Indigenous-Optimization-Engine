/**
 * Indigenous GPU-Accelerated Optimization Solver
 * SIH 2026 Problem Statement ID: 26119 | Organization: MRPL
 * 
 * C++/CUDA Foreign Function Interface (FFI) Header
 * This header defines the exact ABI for plugging in native C++ MILP branch-and-cut
 * and NVIDIA CUDA acceleration kernels without modifying higher-level REST APIs.
 */

#ifndef INDIGENOUS_CUDA_SOLVER_H
#define INDIGENOUS_CUDA_SOLVER_H

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <stdbool.h>

// Compressed Sparse Row (CSR) matrix representation on Device (GPU)
typedef struct {
    int32_t num_rows;
    int32_t num_cols;
    int32_t nnz;            // Number of non-zero elements
    double* d_values;       // GPU device pointer to non-zero values
    int32_t* d_col_indices; // GPU device pointer to column indices
    int32_t* d_row_offsets; // GPU device pointer to row offset pointers
} GpuSparseMatrixCSR;

// Solver problem descriptor
typedef struct {
    int32_t num_variables;
    int32_t num_constraints;
    const double* obj_coefficients;
    const double* lower_bounds;
    const double* upper_bounds;
    const uint8_t* var_types; // 0: Continuous, 1: Integer, 2: Binary
    GpuSparseMatrixCSR constraint_matrix;
    const double* rhs_values;
    const char* constraint_senses; // '<', '>', '='
} IndigenousSolverProblem;

// Solver execution results and hardware telemetry
typedef struct {
    int32_t exit_status;        // 0: Optimal, 1: Feasible, 2: Infeasible, 3: Unbounded
    double objective_value;
    double optimality_gap;
    int64_t nodes_explored;
    int64_t nodes_pruned;
    double cpu_time_ms;
    double gpu_kernel_time_ms;
    double total_runtime_ms;
    double* primal_solution;
    double* dual_solution;
    int32_t num_constraint_violations;
} IndigenousSolverResult;

/**
 * Initialize GPU execution context and allocate CUDA device streams
 */
int32_t indigenous_gpu_init(int32_t device_id);

/**
 * Launch parallel Sparse Matrix-Vector Multiplication (SpMV) on CUDA cores
 * Computes: y = alpha * A * x + beta * y
 */
void launch_cuda_spmv_csr(
    const GpuSparseMatrixCSR* A,
    const double* d_x,
    double* d_y,
    double alpha,
    double beta,
    void* cuda_stream
);

/**
 * Parallel batch feasibility check for candidate Branch & Bound nodes on GPU
 * Evaluates up to 1024 LP relaxations simultaneously across SMs
 */
void launch_cuda_parallel_feasibility_check(
    const GpuSparseMatrixCSR* A,
    const double* d_candidate_vectors,
    int32_t num_candidates,
    const double* d_rhs,
    uint8_t* d_feasibility_flags,
    void* cuda_stream
);

/**
 * Primary MILP Entry point: CPU coordinates B&B while GPU accelerates matrix kernels
 */
int32_t indigenous_solve_milp(
    const IndigenousSolverProblem* problem,
    IndigenousSolverResult* result
);

/**
 * Free GPU device buffers and release CUDA stream handles
 */
void indigenous_gpu_cleanup();

#ifdef __cplusplus
}
#endif

#endif // INDIGENOUS_CUDA_SOLVER_H
