export default function Pricing() {
    return (
        <div className="pt-20 pb-16 px-8 max-w-6xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-center mb-6">Simple, predictable pricing</h1>
            <p className="text-slate-600 text-lg text-center max-w-2xl mb-16">Whether you're exploring tabular ML or running predictions at enterprise scale, we have a plan for you.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {/* Free Tier */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Hobby</h3>
                    <p className="text-slate-500 mb-6">For exploring AutoML and learning data science.</p>
                    <div className="text-4xl font-extrabold text-slate-900 mb-6">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> Up to 10MB Datasets</li>
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> 3 Models (Linear, RF)</li>
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> Basic SHAP Explanations</li>
                    </ul>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg transition">Get Started</button>
                </div>

                {/* Pro Tier (Popular) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Most Popular</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                    <p className="text-slate-400 mb-6">For professional analysts and production modeling.</p>
                    <div className="text-4xl font-extrabold text-white mb-6">$49<span className="text-lg font-normal text-slate-400">/mo</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center text-slate-300"><span className="text-indigo-400 mr-2">✓</span> Up to 5GB Datasets</li>
                        <li className="flex items-center text-slate-300"><span className="text-indigo-400 mr-2">✓</span> Advanced Ensembles (XGB, LGBM)</li>
                        <li className="flex items-center text-slate-300"><span className="text-indigo-400 mr-2">✓</span> Full SHAP/LIME Suite</li>
                        <li className="flex items-center text-slate-300"><span className="text-indigo-400 mr-2">✓</span> GPT-4 AI Analyst Narratives</li>
                    </ul>
                    <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-lg transition">Start 14-Day Trial</button>
                </div>

                {/* Enterprise Tier */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                    <p className="text-slate-500 mb-6">Custom limits, stringent security, and SLA guarantees.</p>
                    <div className="text-4xl font-extrabold text-slate-900 mb-6">Custom</div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> Unlimited Dataset Size</li>
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> Private Cloud Deployment</li>
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> Custom Algorithm Integration</li>
                        <li className="flex items-center text-slate-600"><span className="text-indigo-500 mr-2">✓</span> 24/7 Priority Support & SLAs</li>
                    </ul>
                    <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 rounded-lg transition">Contact Sales</button>
                </div>
            </div>
        </div>
    );
}
