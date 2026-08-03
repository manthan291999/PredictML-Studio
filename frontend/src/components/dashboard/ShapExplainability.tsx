import React from 'react';
import { BarChart3, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ShapExplainabilityProps {
  shapFeatures: string[];
  shapImportance: number[];
  narrative: {
    summary: string;
    drivers?: string[];
    caveats?: string;
  };
}

export const ShapExplainability: React.FC<ShapExplainabilityProps> = ({
  shapFeatures,
  shapImportance,
  narrative,
}) => {
  const chartData = shapFeatures.map((f, idx) => ({
    name: f,
    impact: shapImportance[idx] || 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SHAP Importance Chart */}
      <Card className="flex flex-col h-full">
        <CardHeader
          title="Global Feature Attribution (SHAP)"
          icon={<BarChart3 className="w-4 h-4 text-cyan-500" />}
          action={<Badge variant="info">TreeSHAP Tensor</Badge>}
        />
        <CardBody className="flex-1 min-h-[260px] flex flex-col justify-center">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#334155" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', opacity: 0.6 }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [Number(value).toFixed(3), 'SHAP Impact Ratio']}
                />
                <Bar dataKey="impact" fill="url(#colorGradient)" radius={[0, 6, 6, 0]} barSize={16}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-3 border-t border-slate-100 pt-2 font-mono">
            * Mean absolute Shapley values aggregated across validation fold
          </p>
        </CardBody>
      </Card>

      {/* AI Analyst Storytelling */}
      <Card className="flex flex-col h-full bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/15">
        <CardHeader
          title="AI Analyst Diagnostic Storytelling"
          icon={<TrendingUp className="w-4 h-4 text-purple-600" />}
          action={
            <Badge variant="purple" className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 mr-1 text-purple-600" /> GenAI Narrative
            </Badge>
          }
        />
        <CardBody className="flex-1 flex flex-col justify-between text-sm text-slate-700 space-y-4">
          <div className="space-y-4">
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/80 text-slate-800 leading-relaxed shadow-sm">
              <p className="text-xs uppercase tracking-wider font-bold text-purple-900 mb-1 flex items-center">
                Executive Synthesis
              </p>
              {narrative.summary}
            </div>

            <div>
              <p className="text-xs uppercase font-semibold text-slate-500 mb-2 tracking-wider">Key Determinant Drivers:</p>
              <ul className="space-y-2 pl-1">
                {(narrative.drivers || []).map((d, i) => (
                  <li key={i} className="flex items-start text-xs md:text-sm text-slate-600">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-2.5 flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {narrative.caveats && (
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/70 text-amber-900 text-xs flex items-start space-x-2 mt-4 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Model Boundary Caveats & Uncertainty</span>
                <span className="text-amber-800/90 leading-relaxed">{narrative.caveats}</span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
