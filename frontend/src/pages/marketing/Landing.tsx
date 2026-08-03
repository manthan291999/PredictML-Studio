import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, BrainCircuit, Zap } from 'lucide-react';

export default function Landing() {
    return (
        <div className="flex flex-col items-center justify-center pt-24 pb-16 px-8 text-center max-w-5xl mx-auto space-y-12">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                <span>Introducing PredictML Studio 2.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Enterprise AutoML, <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                    Automated and Explained.
                </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed">
                Upload your tabular data and instantly generate production-ready Machine Learning ensembles. Get SHAP-powered explainability and GPT-4 insights with zero code.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/app" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-lg font-semibold text-lg flex items-center transition shadow-lg shadow-slate-900/20">
                    Start Building for Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/pricing" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-3.5 rounded-lg font-semibold text-lg transition">
                    View Pricing
                </Link>
            </div>

            <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Zero-Config AutoML</h3>
                    <p className="text-slate-600 leading-relaxed">We automatically infer schema and train XGBoost, LightGBM, and Random Forest pipelines.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center mb-4">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Global Explainability</h3>
                    <p className="text-slate-600 leading-relaxed">Every model includes exact SHAP values generated automatically, removing the black-box.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI Analyst Narratives</h3>
                    <p className="text-slate-600 leading-relaxed">Instantly generated GPT-4 summaries describing the business impact of your model's findings.</p>
                </div>
            </div>
        </div>
    );
}
