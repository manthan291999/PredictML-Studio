import { Outlet, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function MarketingLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-50">
                <Link to="/" className="flex items-center space-x-2">
                    <BrainCircuit className="w-6 h-6 text-indigo-600" />
                    <span className="text-xl font-bold tracking-tight">PredictML</span>
                </Link>
                <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-600">
                    <Link to="/" className="hover:text-indigo-600 transition">Product</Link>
                    <Link to="/features" className="hover:text-indigo-600 transition">Features</Link>
                    <Link to="/pricing" className="hover:text-indigo-600 transition">Pricing</Link>
                    <Link to="/use-cases" className="hover:text-indigo-600 transition">Use Cases</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-sm font-medium hover:text-indigo-600">Log in</Link>
                    <Link to="/app" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                        Go to App
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-6xl mx-auto px-8 text-center text-slate-500 text-sm">
                    &copy; 2026 PredictML Studio. Corporate SaaS UI Blueprint.
                </div>
            </footer>
        </div>
    );
}
