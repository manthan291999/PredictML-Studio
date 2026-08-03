import { BrainCircuit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate auth directly routing to App
        navigate('/app');
    };

    return (
        <div className="flex-1 flex items-center justify-center py-20 px-4">
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your PredictML account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="you@company.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">Forgot password?</a>
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-colors">
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <Link to="/pricing" className="text-indigo-600 font-medium hover:text-indigo-500">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
