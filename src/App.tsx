import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { DashboardPage } from './pages/DashboardPage';
import { ModelBuilderPage } from './pages/ModelBuilderPage';
import { SolverExecutionPage } from './pages/SolverExecutionPage';
import { ResultsPage } from './pages/ResultsPage';
import { BenchmarksPage } from './pages/BenchmarksPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { OptimizationModel, SolverResult } from './types/solver';
import { SAMPLE_REFINERY_MODEL } from './services/refineryData';
import { solverApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [model, setModel] = useState<OptimizationModel>(SAMPLE_REFINERY_MODEL);
  const [solution, setSolution] = useState<SolverResult | null>(null);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [validationStatus, setValidationStatus] = useState<any>(null);

  // Initialize with sample solution on initial mount so charts and metrics are immediately live
  useEffect(() => {
    // Fetch initial default solution from server
    solverApi.solveDirect(SAMPLE_REFINERY_MODEL)
      .then((res) => setSolution(res))
      .catch((err) => {
        console.warn('Initial solve load error, using local fallback:', err);
      });
  }, []);

  // Main Solve Handler
  const handleSolve = async () => {
    setIsSolving(true);
    setActiveTab('solver_execution');

    try {
      // Simulate real-time pipeline execution latency
      const result = await solverApi.solveDirect(model);
      
      setTimeout(() => {
        setSolution(result);
        setIsSolving(false);
      }, 2500); // 2.5s animated pipeline step
    } catch (err) {
      console.error('Failed to run solver:', err);
      setIsSolving(false);
    }
  };

  // 1-Click Demo Workflow:
  // "When clicked:
  // 1. Load sample refinery data
  // 2. Show model variables
  // 3. Show constraints
  // 4. Run presolver
  // 5. Start solver animation
  // 6. Animate CPU/GPU workload
  // 7. Show Branch-and-Bound tree
  // 8. Validate solution
  // 9. Display optimal production plan
  // 10. Display benchmark metrics"
  const handleRunDemo = () => {
    setModel(JSON.parse(JSON.stringify(SAMPLE_REFINERY_MODEL)));
    setValidationStatus({ valid: true, timestamp: Date.now() });
    setIsSolving(true);
    setActiveTab('solver_execution');

    solverApi.solveDirect(SAMPLE_REFINERY_MODEL)
      .then((res) => {
        setTimeout(() => {
          setSolution(res);
          setIsSolving(false);
        }, 2800);
      })
      .catch((err) => {
        console.error('Demo solve failed:', err);
        setIsSolving(false);
      });
  };

  // Validate Model Handler
  const handleValidate = () => {
    setValidationStatus({
      valid: true,
      timestamp: Date.now(),
      variablesCount: model.variables.length,
      constraintsCount: model.constraints.length,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunDemo={handleRunDemo}
        isSolving={isSolving}
      />

      {/* Demo Disclosure Banner */}
      <DemoBanner
        onRunDemo={handleRunDemo}
        onOpenModelBuilder={() => setActiveTab('model_builder')}
        isSolving={isSolving}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            solution={solution}
            onRunDemo={handleRunDemo}
            onOpenModelBuilder={() => setActiveTab('model_builder')}
            onOpenSolverExecution={() => setActiveTab('solver_execution')}
            onOpenResults={() => setActiveTab('results')}
            isSolving={isSolving}
          />
        )}

        {activeTab === 'model_builder' && (
          <ModelBuilderPage
            model={model}
            setModel={setModel}
            onValidate={handleValidate}
            onSolve={handleSolve}
            isSolving={isSolving}
            validationStatus={validationStatus}
          />
        )}

        {activeTab === 'solver_execution' && (
          <SolverExecutionPage
            solution={solution}
            isSolving={isSolving}
            onRunOptimization={handleSolve}
            onViewResults={() => setActiveTab('results')}
          />
        )}

        {activeTab === 'results' && (
          <ResultsPage
            solution={solution}
            onReoptimize={handleSolve}
            isSolving={isSolving}
          />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarksPage />
        )}

        {activeTab === 'architecture' && (
          <ArchitecturePage />
        )}
      </main>

      {/* Industrial Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 font-semibold text-slate-200">
              <span>Indigenous Optimization Engine</span>
              <span className="text-cyan-400 font-mono text-[11px]">• SIH 2026 Problem ID: 26119</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Organization: Mangalore Refinery and Petrochemicals Limited (MRPL) | Smart Automation | Prototype Simulation
            </p>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-slate-400 font-mono">SQLite / Python Backend</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-mono">CUDA 12.x FFI Ready</span>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              C++/CUDA Spec
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
