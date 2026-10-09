import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'accent';
  isDemo?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral',
  isDemo = true,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-cyan-500 to-blue-600 opacity-60 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {title}
            </span>
            {isDemo && (
              <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold rounded">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-baseline space-x-1.5 pt-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
          </div>
        </div>

        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-50 group-hover:text-cyan-700 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500 truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`font-medium ml-auto ${
                trendType === 'positive'
                  ? 'text-emerald-600'
                  : trendType === 'accent'
                  ? 'text-cyan-600'
                  : 'text-slate-600'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
