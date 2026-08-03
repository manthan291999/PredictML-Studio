import { useState, useEffect } from 'react';
import { Play, Database, Activity, BarChart3, AlertCircle, TrendingUp } from 'lucide-react';
import { MOCK_DATASETS, MOCK_MODELS, MOCK_SHAP, MOCK_NARRATIVE } from '../../mocks/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [selectedDataset, setSelectedDataset] = useState('demo-house');
    const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    const handleTrain = async () => {
        setStatus('running');
        setProgress(0);
        setLeaderboard([]);

        // Target resolving based on dataset
        const targetMap: any = { "demo-house": "SalePrice", "demo-churn": "Target", "demo-attrition": "Target" };
        const targetCol = targetMap[selectedDataset] || 'Target';

        try {
            const res = await fetch('http://localhost:8001/api/train', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dataset_id: selectedDataset,
                    target_column: targetCol,
                    algorithms: ["linear", "random_forest", "xgboost", "lightgbm", "catboost"]
                })
            });

            if (!res.ok) {
                throw new Error("Failed to initialize pipeline");
            }

            const data = await res.json();
            if (data.job_id) {
                pollStatus(data.job_id);
            }
        } catch (e) {
            console.error(e);
            setStatus('idle');
            alert("Error connecting to prediction engine. Is the backend running?");
        }
    };

    const pollStatus = (id: string) => {
        let p = 0;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:8001/api/train/${id}/status`);
                const data = await res.json();

                if (data.status === 'completed') {
                    setStatus('completed');
                    setLeaderboard(data.leaderboard || []);
                    setProgress(100);
                    clearInterval(interval);
                } else if (data.status === 'failed') {
                    setStatus('idle');
                    clearInterval(interval);
                } else {
                    p = Math.min(p + 15, 95);
                    setProgress(p);
                }
            } catch (e) { }
        }, 2000);
    };

    const shapData = MOCK_SHAP.features.map((f, i) => ({
        name: f,
        impact: MOCK_SHAP.importance[i]
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">AutoML Pipeline</h2>
                    <p className="text-slate-500 mt-1">Configure sources, train models, and analyze performance.</p>
                </div>
                <button
                    onClick={handleTrain}
                    disabled={status === 'running'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-medium transition flex items-center disabled:opacity-50"
                >
                    {status === 'running' ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    ) : (
                        <Play className="w-4 h-4 mr-2" fill="currentColor" />
                    )}
                    {status === 'running' ? 'Training...' : 'Initialize Pipeline'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Dataset Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800 flex items-center">
                                <Database className="w-4 h-4 mr-2 text-indigo-500" /> Source Data
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {MOCK_DATASETS.map(d => (
                                <div
                                    key={d.id}
                                    onClick={() => { setSelectedDataset(d.id); setStatus('idle'); setProgress(0); }}
                                    className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedDataset === d.id
                                        ? 'bg-indigo-50 border-indigo-200'
                                        : 'bg-white border-slate-200 hover:border-indigo-100 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex justify-between font-medium mb-1">
                                        <span className={selectedDataset === d.id ? 'text-indigo-700' : 'text-slate-700'}>{d.name}</span>
                                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{d.type}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{d.rows.toLocaleString()} rows • {d.cols} attributes</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Indication */}
                    {status !== 'idle' && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Job Status</h3>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500 text-right">{progress}% Complete</p>
                        </div>
                    )}
                </div>

                {/* Evaluation Output */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Leaderboard */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800 flex items-center">
                                <Activity className="w-4 h-4 mr-2 text-emerald-500" /> Leaderboard
                            </h3>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-5 py-3 font-medium">Algorithm</th>
                                    <th className="px-5 py-3 font-medium">RMSE (Primary)</th>
                                    <th className="px-5 py-3 font-medium">R² Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-8 text-center text-slate-400">
                                            Pipeline not executed yet. Select a dataset and initialize training.
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((m, idx) => (
                                        <tr key={m.model_id} className="hover:bg-slate-50">
                                            <td className="px-5 py-3 font-medium text-slate-700 flex items-center">
                                                {idx === 0 && <span className="text-yellow-500 mr-2">★</span>}
                                                {m.algorithm}
                                            </td>
                                            <td className="px-5 py-3 font-mono text-slate-600">{m.metrics.rmse ? m.metrics.rmse.toLocaleString() : m.metrics.accuracy?.toLocaleString()}</td>
                                            <td className="px-5 py-3 font-mono text-slate-600">{m.metrics.r2 || '--'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Explainability Row */}
                    {status === 'completed' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="font-semibold text-slate-800 mb-4 flex items-center text-sm">
                                    <BarChart3 className="w-4 h-4 mr-2 text-cyan-500" /> Global Feature Impact
                                </h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={shapData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                            <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                            <Bar dataKey="impact" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
                                <h3 className="font-semibold text-slate-800 mb-4 flex items-center text-sm">
                                    <TrendingUp className="w-4 h-4 mr-2 text-purple-500" /> AI Analyst Insights
                                </h3>
                                <div className="flex-1 text-sm text-slate-600 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 overflow-y-auto">
                                    <p><strong className="text-slate-800">Summary:</strong> {MOCK_NARRATIVE.summary}</p>
                                    <div>
                                        <strong className="text-slate-800">Drivers:</strong>
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            {MOCK_NARRATIVE.drivers.map((d, i) => <li key={i}>{d}</li>)}
                                        </ul>
                                    </div>
                                    <p><strong className="text-amber-800">Caveat:</strong> {MOCK_NARRATIVE.caveats}</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
