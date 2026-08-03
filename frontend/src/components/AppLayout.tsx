import { Outlet, Link, useLocation } from 'react-router-dom';
import { BrainCircuit, LayoutDashboard, Database, Activity, BarChart3, Settings } from 'lucide-react';

export default function AppLayout() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">

            {/* Sidebar - Light Corporate Style */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <BrainCircuit className="w-8 h-8 text-indigo-600 mr-3" />
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">PredictML</h1>
                </div>
                <div className="p-4 flex-1 space-y-1">
                    <Link to="/app" className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive('/app') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
                    </Link>
                    <Link to="/app/datasets" className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive('/app/datasets') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Database className="w-4 h-4 mr-3" /> Datasets
                    </Link>
                    <Link to="/app/evaluation" className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive('/app/evaluation') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Activity className="w-4 h-4 mr-3" /> Model Registry
                    </Link>
                    <Link to="/app/explainability" className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive('/app/explainability') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <BarChart3 className="w-4 h-4 mr-3" /> Explainability
                    </Link>
                </div>
                <div className="p-4 border-t border-slate-200">
                    <Link to="/app/settings" className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive('/app/settings') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Settings className="w-4 h-4 mr-3" /> Settings
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Topbar */}
                <header className="h-16 flex items-center px-8 border-b border-slate-200 bg-white sticky top-0 z-10 shrink-0">
                    <div className="flex items-center text-sm font-medium text-slate-500">
                        <span>Workspace</span>
                        <span className="mx-2">/</span>
                        <span className="text-slate-900 capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                            AM
                        </div>
                    </div>
                </header>

                {/* Scrollable Container */}
                <div className="p-8 overflow-y-auto w-full max-h-full">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
