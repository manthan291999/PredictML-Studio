import React, { useState } from 'react';
import { Sliders, Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

interface WhatIfSimulatorProps {
  selectedModelId: string | null;
  datasetType: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ selectedModelId, datasetType }) => {
  const [val1, setVal1] = useState<number>(50);
  const [val2, setVal2] = useState<number>(3);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Mock calculation for UI/UX reactivity demonstration based on inputs
      const base = datasetType === 'Regression' ? 245000 : 0.65;
      const variation = (val1 - 50) * 1200 + (val2 - 3) * 4500;
      const res = datasetType === 'Regression' ? base + variation : Math.min(Math.max(0.1, 0.65 + (val1 - 50) * 0.005), 0.99);
      setSimulatedScore(res);
      setIsSimulating(false);
    }, 400);
  };

  return (
    <Card className="border-purple-200/60 shadow-md">
      <CardHeader
        title="Interactive What-If Sensitivity Simulator"
        icon={<Sliders className="w-4 h-4 text-pink-500" />}
        action={<Badge variant="purple">Real-time Inference</Badge>}
      />
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Adjust primary determinant factors below to observe counterfactual SHAP sensitivity variations and real-time model inference responses.
            </p>
            
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Primary Index / Quality Factor</span>
                  <span className="font-mono text-indigo-600">{val1} %</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={val1}
                  onChange={(e) => setVal1(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Secondary Capacity / Interaction Level</span>
                  <span className="font-mono text-pink-600">{val2} units</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={val2}
                  onChange={(e) => setVal2(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-2xl flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden min-h-[160px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
            
            <p className="text-[11px] uppercase tracking-wider font-semibold text-indigo-300 mb-2">
              Counterfactual Prediction
            </p>

            {isSimulating ? (
              <div className="py-4">
                <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin mx-auto" />
              </div>
            ) : simulatedScore !== null ? (
              <div className="space-y-1 my-1">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-mono drop-shadow-md">
                  {datasetType === 'Regression'
                    ? `$${simulatedScore.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    : `${(simulatedScore * 100).toFixed(1)}%`}
                </span>
                <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  ✦ High Confidence Tensor
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">Click calculate to project inference outcome</p>
            )}

            <button
              onClick={handleSimulate}
              disabled={isSimulating || !selectedModelId}
              className="mt-3 w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold text-xs py-2 px-4 rounded-xl transition duration-200 flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 fill-current" />
              {simulatedScore !== null ? 'Recalculate Tensor' : 'Execute Simulator'}
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
