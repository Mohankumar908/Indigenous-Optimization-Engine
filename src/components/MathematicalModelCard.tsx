import React from 'react';
import { Sigma, CheckCircle2, ChevronRight, FileCode2, Copy, Check } from 'lucide-react';

export const MathematicalModelCard: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const formulaText = `Minimize:
  Total Cost = ∑ (c_i · x_i) + ∑ (p_u · z_u) + ∑ (t_j · y_j) + ∑ (h_j · s_j)
  Where:
    c_i = [₹42,000, ₹39,500, ₹44,000] per tonne (Arabian Light, Bonny Light, Basrah Heavy)
    x1, x2, x3 = Crude input quantities (tonnes)
    y1, y2, y3 = Petrol, High-Speed Diesel, and LPG output quantities (tonnes)
    z1, z2 ∈ {0, 1} = Crude Distillation Unit (CDU) & Fluid Catalytic Cracker (FCCU) status

Subject To:
  1. Crude Capacity:         x1 + x2 + x3 ≤ 140,000 tonnes
  2. Petrol Demand Target:   0.362 · (x1 + x2 + x3) ≥ 42,000 tonnes
  3. Diesel Demand Target:   0.495 · (x1 + x2 + x3) ≥ 58,000 tonnes
  4. LPG Demand Target:      0.128 · (x1 + x2 + x3) ≥ 15,000 tonnes
  5. CDU Unit 1 Capacity:    0.52 · (x1 + x2 + x3) ≤ 75,000 · z1
  6. FCCU Unit 2 Capacity:   0.48 · (x1 + x2 + x3) ≤ 65,000 · z2
  7. Storage Upper Bounds:   y1 ≤ 55,000;  y2 ≤ 70,000;  y3 ≤ 22,000
  8. Non-negativity:         x1, x2, x3, y1, y2, y3 ≥ 0
  9. Discrete Unit Limits:   z1, z2 ∈ {0, 1}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formulaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sigma className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-sm tracking-wide">
            Refinery MILP Mathematical Formulation
          </h3>
          <span className="text-[11px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">
            MRPL Industrial Standard
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy LaTeX/Text'}</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Decision variables */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
            <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2"></span>
            Decision Variables
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
              <span className="text-blue-700 font-bold">x1, x2, x3</span>
              <span className="text-slate-600 font-sans text-[11px]">Crude tonnes (A, B, C)</span>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-sans">Continuous</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
              <span className="text-blue-700 font-bold">y1, y2, y3</span>
              <span className="text-slate-600 font-sans text-[11px]">Petrol, Diesel, LPG</span>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-sans">Continuous</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200 flex justify-between items-center">
              <span className="text-emerald-700 font-bold">z1, z2</span>
              <span className="text-slate-600 font-sans text-[11px]">Unit 1 & 2 Dispatch</span>
              <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded font-sans">Binary &#123;0, 1&#125;</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 leading-normal pt-2">
            Unit 1: Crude Distillation Unit (CDU) | Unit 2: Fluid Catalytic Cracking Unit (FCCU)
          </div>
        </div>

        {/* Center & Right: Mathematical Equation Display */}
        <div className="lg:col-span-2 space-y-4 font-mono text-xs">
          {/* Objective function */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
              Objective Function:
            </div>
            <div className="text-sm font-semibold text-white">
              <span className="text-amber-400">Minimize</span> C = ∑ (Raw Material) + ∑ (Processing) + ∑ (Logistics) + ∑ (Inventory)
            </div>
            <div className="text-slate-400 text-[11px] pl-3 border-l-2 border-cyan-500">
              C = 42000·x1 + 39500·x2 + 44000·x3 + 1250·(x1+x2+x3) + 2500000·z1 + 2000000·z2 + 850·(x1+x2+x3)
            </div>
          </div>

          {/* Constraints grid */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80 space-y-2">
            <div className="text-xs uppercase font-bold text-slate-700 tracking-wider font-sans">
              Operational Constraints:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 font-sans block text-[10px]">Crude Throughput Limit:</span>
                <span className="font-semibold text-slate-800">x1 + x2 + x3 ≤ 140,000 t</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 font-sans block text-[10px]">Petrol Minimum Obligation:</span>
                <span className="font-semibold text-slate-800">0.362 · (x1 + x2 + x3) ≥ 42,000 t</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 font-sans block text-[10px]">Diesel Minimum Obligation:</span>
                <span className="font-semibold text-slate-800">0.495 · (x1 + x2 + x3) ≥ 58,000 t</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 font-sans block text-[10px]">LPG Minimum Obligation:</span>
                <span className="font-semibold text-slate-800">0.128 · (x1 + x2 + x3) ≥ 15,000 t</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 font-sans block text-[10px]">CDU Unit 1 Binary Capacity:</span>
                <span className="font-semibold text-slate-800">0.52 · (x1 + x2 + x3) ≤ 75,000 · z1</span>
              </div>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 font-sans block text-[10px]">FCCU Unit 2 Binary Capacity:</span>
                <span className="font-semibold text-slate-800">0.48 · (x1 + x2 + x3) ≤ 65,000 · z2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
