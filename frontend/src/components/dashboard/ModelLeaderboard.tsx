import React from 'react';
import { Activity, Trophy, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { Badge } from '../common/Badge';
import type { LeaderboardItem } from '../../types/pipeline';

interface ModelLeaderboardProps {
  leaderboard: LeaderboardItem[];
  selectedModelId: string | null;
  onSelectModel?: (id: string) => void;
  isTraining: boolean;
}

export const ModelLeaderboard: React.FC<ModelLeaderboardProps> = ({
  leaderboard,
  selectedModelId,
  onSelectModel,
  isTraining,
}) => {
  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader
        title="AutoML Candidate Leaderboard"
        icon={<Activity className="w-4 h-4 text-emerald-600" />}
        action={
          leaderboard.length > 0 ? (
            <Badge variant="success">{leaderboard.length} Models Trained</Badge>
          ) : (
            <Badge variant="default">Idle</Badge>
          )
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Rank & Algorithm</th>
              <th className="px-6 py-3.5">Primary Error / Acc (RMSE / Acc)</th>
              <th className="px-6 py-3.5">Variance (R² Score)</th>
              <th className="px-6 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isTraining ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-slate-600">Training candidate models in parallel...</p>
                    <p className="text-xs text-slate-400">Evaluating LightGBM, XGBoost, Random Forest, & Linear baselines</p>
                  </div>
                </td>
              </tr>
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Trophy className="w-8 h-8 text-slate-300 stroke-1" />
                    <p className="text-sm font-medium text-slate-500">Pipeline has not executed yet</p>
                    <p className="text-xs text-slate-400">Select a source dataset on the left and initialize training.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leaderboard.map((m, idx) => {
                const isSelected = selectedModelId === m.model_id;
                const isWinner = idx === 0;
                return (
                  <tr
                    key={m.model_id}
                    onClick={() => onSelectModel && onSelectModel(m.model_id)}
                    className={`transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 hover:bg-indigo-50 font-medium'
                        : isWinner
                        ? 'bg-amber-50/30 hover:bg-slate-50/80'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="px-6 py-4 flex items-center space-x-2.5">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                        {isWinner ? (
                          <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                            ★
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                        )}
                      </span>
                      <span className="font-semibold text-slate-800 flex items-center">
                        {m.algorithm}
                        {isWinner && (
                          <span className="ml-2 text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase tracking-wider border border-amber-200">
                            Best Model
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700 text-sm">
                      {m.metrics.rmse
                        ? typeof m.metrics.rmse === 'number'
                          ? m.metrics.rmse.toLocaleString(undefined, { maximumFractionDigits: 2 })
                          : m.metrics.rmse
                        : m.metrics.accuracy
                        ? typeof m.metrics.accuracy === 'number'
                          ? `${(m.metrics.accuracy * 100).toFixed(2)}%`
                          : m.metrics.accuracy
                        : '--'}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700 text-sm">
                      {m.metrics.r2
                        ? typeof m.metrics.r2 === 'number'
                          ? m.metrics.r2.toFixed(4)
                          : m.metrics.r2
                        : m.metrics.auc
                        ? typeof m.metrics.auc === 'number'
                          ? `AUC: ${m.metrics.auc.toFixed(4)}`
                          : m.metrics.auc
                        : '--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                        Inspect <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
