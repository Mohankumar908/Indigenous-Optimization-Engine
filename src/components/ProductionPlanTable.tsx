import React from 'react';
import { Table, Download, ShieldCheck, Factory, CheckCircle2 } from 'lucide-react';
import { ProductionPlanItem } from '../types/solver';

interface ProductionPlanTableProps {
  planItems: ProductionPlanItem[];
}

export const ProductionPlanTable: React.FC<ProductionPlanTableProps> = ({ planItems }) => {
  const downloadCSV = () => {
    const headers = ["Decision", "Value", "Unit", "Type", "Status"];
    const rows = planItems.map(item => [
      `"${item.decision}"`,
      `"${item.value}"`,
      `"${item.unit}"`,
      `"${item.type}"`,
      `"${item.status}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "MRPL_Optimal_Refinery_Production_Plan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center space-x-2">
          <Factory className="w-5 h-5 text-cyan-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Optimal Refinery Production & Blending Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Computed optimal feed rates, product yields, and unit operations for MRPL Complex
            </p>
          </div>
        </div>

        <button
          onClick={downloadCSV}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Plan (CSV)</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/75 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <th className="py-3 px-4">Refinery Decision Entity</th>
              <th className="py-3 px-4">Optimal Value</th>
              <th className="py-3 px-4">Measurement Unit</th>
              <th className="py-3 px-4">Variable Classification</th>
              <th className="py-3 px-4">Economic / Load Contribution</th>
              <th className="py-3 px-4">Dispatch Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70">
            {planItems.map((item, idx) => {
              const isBinary = item.type.toLowerCase().includes('binary');
              return (
                <tr key={idx} className="hover:bg-cyan-50/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                    <span>{item.decision}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sm text-slate-900">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {item.unit || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isBinary
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.cost_contribution ? (
                      <span className="font-mono font-medium text-slate-800">
                        ₹ {item.cost_contribution.toFixed(2)} Cr
                      </span>
                    ) : item.yield_pct ? (
                      <span className="text-cyan-700 font-medium">Yield: {item.yield_pct}</span>
                    ) : item.load_pct ? (
                      <span className="text-emerald-700 font-medium">Load: {item.load_pct}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
