import { OptimizationModel, SolverResult, BenchmarkItem } from '../types/solver';

const API_BASE = '/api';

export const solverApi = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getModels(): Promise<OptimizationModel[]> {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  async getModel(id: string): Promise<OptimizationModel> {
    const res = await fetch(`${API_BASE}/models/${id}`);
    if (!res.ok) throw new Error('Failed to fetch model');
    return res.json();
  },

  async createModel(model: Partial<OptimizationModel>): Promise<{ id: string; model: OptimizationModel }> {
    const res = await fetch(`${API_BASE}/models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model),
    });
    if (!res.ok) throw new Error('Failed to create model');
    return res.json();
  },

  async validateModel(id: string) {
    const res = await fetch(`${API_BASE}/models/${id}/validate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Validation failed');
    return res.json();
  },

  async solveModel(id: string, overrides?: any): Promise<SolverResult> {
    const res = await fetch(`${API_BASE}/models/${id}/solve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(overrides || {}),
    });
    if (!res.ok) throw new Error('Solving failed');
    return res.json();
  },

  async getModelResults(id: string): Promise<SolverResult> {
    const res = await fetch(`${API_BASE}/models/${id}/results`);
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  async getBenchmarks(): Promise<BenchmarkItem[]> {
    const res = await fetch(`${API_BASE}/benchmarks`);
    if (!res.ok) throw new Error('Failed to fetch benchmarks');
    return res.json();
  },

  async solveDirect(payload: any): Promise<SolverResult> {
    const res = await fetch(`${API_BASE}/solve-direct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Solving direct failed');
    return res.json();
  }
};
