import React from 'react';
import { Activity, Cpu, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

interface PipelineTelemetryProps {
  status: 'idle' | 'initiating' | 'running' | 'completed' | 'failed';
  error?: string | null;
}

export const PipelineTelemetry: React.FC<PipelineTelemetryProps> = ({ status, error }) => {
  if (status === 'idle') return null;

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30">
      <CardBody className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Cpu className={`w-4 h-4 ${status === 'running' ? 'text-indigo-600 animate-spin' : 'text-emerald-600'}`} />
            <h3 className="font-semibold text-slate-800 text-sm">Engine Telemetry</h3>
          </div>
          <Badge
            variant={
              status === 'completed'
                ? 'success'
                : status === 'failed'
                ? 'error'
                : status === 'running'
                ? 'info'
                : 'default'
            }
            animate={status === 'running' || status === 'initiating'}
          >
            {status.toUpperCase()}
          </Badge>
        </div>

        {status === 'failed' ? (
          <div className="flex items-start p-3 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-800 text-xs space-x-2 mt-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Execution Aborted</p>
              <p className="text-rose-700">{error || 'Server error experienced during algorithm training.'}</p>
            </div>
          </div>
        ) : status === 'completed' ? (
          <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 p-3 rounded-xl text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>All algorithms converged successfully. Explanations & SHAP tensors ready.</span>
          </div>
        ) : (
          <div className="space-y-2.5 mt-2">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50 p-0.5">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 h-1.5 rounded-full animate-pulse w-3/4 transition-all duration-500" />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>Optimizing hyperparameters...</span>
              <span className="flex items-center text-indigo-600 font-semibold">
                <Activity className="w-3 h-3 mr-1 animate-ping" /> Live
              </span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
