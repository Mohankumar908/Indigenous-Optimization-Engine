import React, { useState } from 'react';
import { 
  Layers, Plus, Trash2, CheckCircle2, Play, RefreshCw, 
  RotateCcw, Sliders, DollarSign, Fuel, Warehouse, Truck, Factory, FileCode 
} from 'lucide-react';
import { OptimizationModel, Variable, Constraint, RefineryParameters } from '../types/solver';
import { SAMPLE_REFINERY_MODEL } from '../services/refineryData';
import { MathematicalModelCard } from '../components/MathematicalModelCard';
import { JsonLpEditor } from '../components/JsonLpEditor';

interface ModelBuilderPageProps {
  model: OptimizationModel;
  setModel: React.Dispatch<React.SetStateAction<OptimizationModel>>;
  onValidate: () => void;
  onSolve: () => void;
  isSolving?: boolean;
  validationStatus?: any;
}

export const ModelBuilderPage: React.FC<ModelBuilderPageProps> = ({
  model,
  setModel,
  onValidate,
  onSolve,
  isSolving = false,
  validationStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'refinery_params' | 'variables_constraints' | 'formula_view' | 'file_input'>('refinery_params');

  // New variable inputs state
  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState<'continuous' | 'integer' | 'binary'>('continuous');
  const [newVarCoeff, setNewVarCoeff] = useState('');
  const [newVarUpper, setNewVarUpper] = useState('');

  // New constraint inputs state
  const [newConName, setNewConName] = useState('');
  const [newConExpr, setNewConExpr] = useState('');
  const [newConSense, setNewConSense] = useState<'<=' | '>=' | '=='>('<=');
  const [newConRhs, setNewConRhs] = useState('');

  // Handle Refinery Parameters Change
  const handleParamChange = (field: keyof RefineryParameters, val: number) => {
    setModel((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [field]: val,
      },
    }));
  };

  // Load sample model
  const handleLoadSample = () => {
    setModel(JSON.parse(JSON.stringify(SAMPLE_REFINERY_MODEL)));
  };

  // Clear model
  const handleClearModel = () => {
    setModel({
      id: `model_${Math.random().toString(36).substring(2, 8)}`,
      name: 'Custom Refinery Model',
      description: 'Blank industrial LP/MILP formulation',
      model_type: 'MILP',
      objective_sense: 'minimize',
      status: 'draft',
      variables: [],
      constraints: [],
      parameters: {
        crude_a_avail: 0,
        crude_b_avail: 0,
        crude_c_avail: 0,
        crude_a_cost: 0,
        crude_b_cost: 0,
        crude_c_cost: 0,
        unit_1_capacity: 0,
        unit_2_capacity: 0,
        demand_petrol: 0,
        demand_diesel: 0,
        demand_lpg: 0,
        storage_petrol: 0,
        storage_diesel: 0,
        storage_lpg: 0,
        transport_cost_rate: 0,
        operating_cost_fixed: 0,
      },
    });
  };

  // Add Variable
  const handleAddVariable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarName) return;

    const newVar: Variable = {
      name: newVarName.trim().replace(/\s+/g, '_'),
      type: newVarType,
      lower_bound: 0,
      upper_bound: newVarUpper ? parseFloat(newVarUpper) : undefined,
      objective_coeff: newVarCoeff ? parseFloat(newVarCoeff) : 0,
      unit: newVarType === 'binary' ? 'status' : 'tonnes',
    };

    setModel((prev) => ({
      ...prev,
      variables: [...prev.variables, newVar],
    }));

    setNewVarName('');
    setNewVarCoeff('');
    setNewVarUpper('');
  };

  const handleRemoveVariable = (idx: number) => {
    setModel((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== idx),
    }));
  };

  // Add Constraint
  const handleAddConstraint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConName || !newConExpr || !newConRhs) return;

    const newCon: Constraint = {
      name: newConName.trim().replace(/\s+/g, '_'),
      expression: newConExpr.trim(),
      sense: newConSense,
      rhs: parseFloat(newConRhs),
      unit: 'tonnes',
    };

    setModel((prev) => ({
      ...prev,
      constraints: [...prev.constraints, newCon],
    }));

    setNewConName('');
    setNewConExpr('');
    setNewConRhs('');
  };

  const handleRemoveConstraint = (idx: number) => {
    setModel((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== idx),
    }));
  };

  const p = model.parameters;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Model Builder & Refinery Scheduler
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
              MILP Formulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure feed availability, conversion units, demand targets, and objective formulation for MRPL complex
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadSample}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition flex items-center cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Load Sample Refinery Model
          </button>

          <button
            onClick={handleClearModel}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition flex items-center cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Model
          </button>

          <button
            onClick={onValidate}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 transition flex items-center cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Validate Model
          </button>

          <button
            onClick={onSolve}
            disabled={isSolving}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition disabled:opacity-50 flex items-center cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 mr-1.5 fill-current ${isSolving ? 'animate-spin' : ''}`} />
            {isSolving ? 'Solving...' : 'Run Optimization'}
          </button>
        </div>
      </div>

      {/* Validation banner feedback if available */}
      {validationStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Model Validation Passed:</strong> Verified {model.variables.length} decision variables and {model.constraints.length} constraints. Presolver matrix reduction ready.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            VALID_MILP
          </span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 space-x-2 overflow-x-auto">
        {[
          { id: 'refinery_params', label: '1. Refinery Inputs & Parameters', icon: Sliders },
          { id: 'variables_constraints', label: '2. Variable & Constraint Tables', icon: Layers },
          { id: 'formula_view', label: '3. Mathematical Formulation (LaTeX)', icon: Fuel },
          { id: 'file_input', label: '4. File Input (JSON / LP / MPS)', icon: FileCode },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-cyan-600 text-cyan-700 bg-cyan-50/50 rounded-t-md'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Refinery Parameters Form */}
      {activeSubTab === 'refinery_params' && (
        <div className="space-y-6">
          {/* Objective Switcher */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Optimization Objective</h3>
              <p className="text-xs text-slate-500">Select whether the mathematical solver minimizes costs or maximizes net margin</p>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setModel((prev) => ({ ...prev, objective_sense: 'minimize' }))}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                  model.objective_sense === 'minimize'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                [ Minimize Total Cost ]
              </button>
              <button
                type="button"
                onClick={() => setModel((prev) => ({ ...prev, objective_sense: 'maximize' }))}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                  model.objective_sense === 'maximize'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                [ Maximize Profit ]
              </button>
            </div>
          </div>

          {/* Grid of 6 Input Parameter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Crude Availability */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Fuel className="w-4 h-4 text-cyan-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Crude Availability (tonnes)
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Source A (Arabian Light):</label>
                  <input
                    type="number"
                    value={p.crude_a_avail}
                    onChange={(e) => handleParamChange('crude_a_avail', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Source B (Bonny Light):</label>
                  <input
                    type="number"
                    value={p.crude_b_avail}
                    onChange={(e) => handleParamChange('crude_b_avail', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Source C (Basrah Heavy):</label>
                  <input
                    type="number"
                    value={p.crude_c_avail}
                    onChange={(e) => handleParamChange('crude_c_avail', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Crude Cost */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Crude Cost (₹ per tonne)
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Source A Cost:</label>
                  <input
                    type="number"
                    value={p.crude_a_cost}
                    onChange={(e) => handleParamChange('crude_a_cost', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Source B Cost:</label>
                  <input
                    type="number"
                    value={p.crude_b_cost}
                    onChange={(e) => handleParamChange('crude_b_cost', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Source C Cost:</label>
                  <input
                    type="number"
                    value={p.crude_c_cost}
                    onChange={(e) => handleParamChange('crude_c_cost', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Processing Capacity */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Factory className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Processing Capacity (t/day)
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Refinery Unit 1 (CDU):</label>
                  <input
                    type="number"
                    value={p.unit_1_capacity}
                    onChange={(e) => handleParamChange('unit_1_capacity', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Refinery Unit 2 (FCCU):</label>
                  <input
                    type="number"
                    value={p.unit_2_capacity}
                    onChange={(e) => handleParamChange('unit_2_capacity', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div className="pt-2 text-[11px] text-slate-500 leading-normal">
                  Units are integer dispatchable entities &#123;0, 1&#125; with startup overhead costs.
                </div>
              </div>
            </div>

            {/* Card 4: Product Demand */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Truck className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Product Demand (tonnes)
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Petrol (Motor Spirit):</label>
                  <input
                    type="number"
                    value={p.demand_petrol}
                    onChange={(e) => handleParamChange('demand_petrol', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">High Speed Diesel (HSD):</label>
                  <input
                    type="number"
                    value={p.demand_diesel}
                    onChange={(e) => handleParamChange('demand_diesel', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">LPG:</label>
                  <input
                    type="number"
                    value={p.demand_lpg}
                    onChange={(e) => handleParamChange('demand_lpg', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Storage Capacity */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Warehouse className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Storage Capacity (tonnes)
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Petrol Storage Upper Limit:</label>
                  <input
                    type="number"
                    value={p.storage_petrol}
                    onChange={(e) => handleParamChange('storage_petrol', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Diesel Storage Upper Limit:</label>
                  <input
                    type="number"
                    value={p.storage_diesel}
                    onChange={(e) => handleParamChange('storage_diesel', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">LPG Storage Upper Limit:</label>
                  <input
                    type="number"
                    value={p.storage_lpg}
                    onChange={(e) => handleParamChange('storage_lpg', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Card 6: Operating & Transportation */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4 h-4 text-slate-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Logistics & Operating Costs
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-600 block mb-1">Transportation Cost (₹/tonne):</label>
                  <input
                    type="number"
                    value={p.transport_cost_rate}
                    onChange={(e) => handleParamChange('transport_cost_rate', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Fixed Operating Overhead (₹):</label>
                  <input
                    type="number"
                    value={p.operating_cost_fixed}
                    onChange={(e) => handleParamChange('operating_cost_fixed', parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div className="pt-2 text-[11px] text-slate-500 leading-normal">
                  Applies pipeline pumping tariffs and base refinery utility consumption.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Variables & Constraints Editor */}
      {activeSubTab === 'variables_constraints' && (
        <div className="space-y-6">
          {/* Decision Variables Table & Add Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Decision Variables ({model.variables.length})</h3>
                <p className="text-xs text-slate-500">Continuous feed rates, production outputs, and binary unit dispatch flags</p>
              </div>
            </div>

            {/* Variable Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Variable Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Lower Bound</th>
                    <th className="py-2.5 px-3">Upper Bound</th>
                    <th className="py-2.5 px-3">Objective Coeff</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {model.variables.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-800">{v.name}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                          v.type === 'binary' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">{v.lower_bound ?? 0}</td>
                      <td className="py-2 px-3 text-slate-600">{v.upper_bound ?? '∞'}</td>
                      <td className="py-2 px-3 text-slate-900">{v.objective_coeff ?? 0}</td>
                      <td className="py-2 px-3 text-slate-500 font-sans">{v.unit || 'tonnes'}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => handleRemoveVariable(idx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Variable inline form */}
            <form onSubmit={handleAddVariable} className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Name (e.g. x4_crude_D)"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
              <select
                value={newVarType}
                onChange={(e) => setNewVarType(e.target.value as any)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200"
              >
                <option value="continuous">Continuous</option>
                <option value="integer">Integer</option>
                <option value="binary">Binary</option>
              </select>
              <input
                type="number"
                placeholder="Obj Coeff (₹)"
                value={newVarCoeff}
                onChange={(e) => setNewVarCoeff(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono w-28"
              />
              <input
                type="number"
                placeholder="Upper Bound"
                value={newVarUpper}
                onChange={(e) => setNewVarUpper(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono w-28"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Variable
              </button>
            </form>
          </div>

          {/* Constraints Table & Add Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Operational Constraints ({model.constraints.length})</h3>
                <p className="text-xs text-slate-500">Mass balance, capacity inequalities, and contractual supply bounds</p>
              </div>
            </div>

            {/* Constraint Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Constraint Label</th>
                    <th className="py-2.5 px-3">Mathematical Expression</th>
                    <th className="py-2.5 px-3">Sense</th>
                    <th className="py-2.5 px-3">Right Hand Side (RHS)</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {model.constraints.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-bold text-slate-800">{c.name}</td>
                      <td className="py-2 px-3 text-slate-700">{c.expression}</td>
                      <td className="py-2 px-3 font-bold text-blue-600">{c.sense}</td>
                      <td className="py-2 px-3 text-slate-900 font-bold">{c.rhs.toLocaleString()}</td>
                      <td className="py-2 px-3 text-slate-500 font-sans">{c.unit || 'tonnes'}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => handleRemoveConstraint(idx)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Constraint inline form */}
            <form onSubmit={handleAddConstraint} className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Label (e.g. sulfur_limit)"
                value={newConName}
                onChange={(e) => setNewConName(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
              <input
                type="text"
                placeholder="Expression (e.g. 0.02*x1 + 0.01*x2)"
                value={newConExpr}
                onChange={(e) => setNewConExpr(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono flex-1 min-w-[200px]"
              />
              <select
                value={newConSense}
                onChange={(e) => setNewConSense(e.target.value as any)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              >
                <option value="<=">&le; (Less than or equal)</option>
                <option value=">=">&ge; (Greater than or equal)</option>
                <option value="==">= (Exact equality)</option>
              </select>
              <input
                type="number"
                placeholder="RHS"
                value={newConRhs}
                onChange={(e) => setNewConRhs(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-mono w-28"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Constraint
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Mathematical Formula Display */}
      {activeSubTab === 'formula_view' && (
        <MathematicalModelCard />
      )}

      {/* TAB 4: JSON / LP / MPS File Input & Parser */}
      {activeSubTab === 'file_input' && (
        <JsonLpEditor
          onLoadParsedModel={(parsed) => {
            setModel((prev) => ({
              ...prev,
              name: parsed.name || prev.name,
              objective_sense: parsed.objective || prev.objective_sense,
              variables: parsed.variables || prev.variables,
              constraints: parsed.constraints || prev.constraints,
            }));
          }}
        />
      )}
    </div>
  );
};
