
import React, { useState } from 'react';
import { simulateAnalysis } from '../services/geminiService';
import { PredictionResult } from '../types';

const Simulator: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await simulateAnalysis(input);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <i className="fa-solid fa-vial-virus text-blue-500"></i>
        Interactive System Simulator
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Paste news article text to test:</label>
        <textarea 
          className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
          placeholder="e.g., Doctors found a secret herbal remedy that cures everything instantly but the big pharma hides it..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={handleAnalyze}
          disabled={loading || !input.trim()}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><i className="fa-solid fa-spinner fa-spin"></i> Processing...</>
          ) : (
            <><i className="fa-solid fa-magnifying-glass-chart"></i> Run Analysis</>
          )}
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 rounded-xl mb-6 border ${result.label === 'REAL' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider">Prediction</span>
                <h3 className="text-3xl font-black">{result.label}</h3>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold uppercase tracking-wider">Confidence</span>
                <h3 className="text-3xl font-black">{(result.confidence * 100).toFixed(1)}%</h3>
              </div>
            </div>
          </div>

          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-bar text-purple-500"></i>
            Explainable AI (SHAP Impact)
          </h4>
          <div className="space-y-4">
            {result.explanation.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold uppercase text-gray-500 px-1">
                  <span>{item.word}</span>
                  <span className={item.impact > 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.impact > 0 ? 'Pushes Real' : 'Pushes Fake'}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                  {/* Visual representation of SHAP bar chart */}
                  <div className="w-1/2 h-full border-r border-gray-300">
                    {item.impact < 0 && (
                      <div 
                        className="h-full bg-red-400 ml-auto" 
                        style={{ width: `${Math.min(100, Math.abs(item.impact) * 200)}%` }}
                      ></div>
                    )}
                  </div>
                  <div className="w-1/2 h-full">
                    {item.impact > 0 && (
                      <div 
                        className="h-full bg-green-400" 
                        style={{ width: `${Math.min(100, Math.abs(item.impact) * 200)}%` }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            Note: This simulation uses a high-level LLM to mimic a Logistic Regression + SHAP pipeline for demonstration purposes.
          </p>
        </div>
      )}
    </div>
  );
};

export default Simulator;
