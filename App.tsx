
import React, { useState } from 'react';
import { PROJECT_FILES } from './constants';
import { FileContent } from './types';
import ProjectStructure from './components/ProjectStructure';
import CodeEditor from './components/CodeEditor';
import Simulator from './components/Simulator';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileContent>(PROJECT_FILES[1]); // Default to train.py
  const [activeTab, setActiveTab] = useState<'learn' | 'build' | 'simulate'>('learn');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <i className="fa-solid fa-newspaper text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Fake News AI Project Builder</h1>
              <p className="text-xs text-gray-500 font-medium">Build, Explain, and Detect with Python & ML</p>
            </div>
          </div>
          
          <nav className="flex bg-gray-100 p-1 rounded-xl">
            {(['learn', 'build', 'simulate'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* Sidebar / Context Panel */}
        <div className="lg:col-span-4 space-y-8">
          {activeTab === 'learn' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-blue-500"></i>
                  Learning Pathway
                </h3>
                <div className="space-y-4">
                  {[
                    { title: "1. Data Collection", desc: "Start with a balanced dataset of real and satirical news.", icon: "fa-database" },
                    { title: "2. NLP Preprocessing", desc: "Clean text and convert it to numbers using TF-IDF.", icon: "fa-code" },
                    { title: "3. Training", desc: "Use Logistic Regression to find patterns in word frequencies.", icon: "fa-gears" },
                    { title: "4. Explainable AI", desc: "Use SHAP values to see which words 'pushed' the prediction.", icon: "fa-eye" }
                  ].map((step, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all shadow-sm">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <i className={`fa-solid ${step.icon}`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed mt-1">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Project Architecture</h3>
                <ProjectStructure />
              </section>
            </div>
          )}

          {activeTab === 'build' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
               <section>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Project Files</h3>
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                  {PROJECT_FILES.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full px-4 py-3 flex items-center justify-between group transition-all ${
                        selectedFile.path === file.path ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${
                          file.name.endsWith('.py') ? 'fa-brands fa-python text-blue-500' :
                          file.name.endsWith('.csv') ? 'fa-file-csv text-green-500' :
                          file.name.endsWith('.txt') ? 'fa-list-check text-purple-500' :
                          'fa-info-circle text-gray-400'
                        }`}></i>
                        <span className={`text-sm font-medium ${selectedFile.path === file.path ? 'text-blue-700' : 'text-gray-600'}`}>
                          {file.name}
                        </span>
                      </div>
                      <i className={`fa-solid fa-chevron-right text-xs transition-transform ${
                        selectedFile.path === file.path ? 'translate-x-1 text-blue-400' : 'text-gray-300'
                      }`}></i>
                    </button>
                  ))}
                </div>
              </section>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-yellow-800 flex items-center gap-2 mb-2">
                  <i className="fa-solid fa-terminal"></i> Installation Guide
                </h4>
                <div className="font-mono text-[10px] bg-white p-3 rounded-lg border border-yellow-100 text-gray-700 leading-relaxed">
                  # 1. Create Folder<br/>
                  mkdir fake-news-ai && cd fake-news-ai<br/>
                  # 2. Install Deps<br/>
                  pip install -r requirements.txt<br/>
                  # 3. Download news.csv from Kaggle to /data<br/>
                  # 4. Train model<br/>
                  python train.py
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulate' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl">
                <h3 className="text-xl font-bold mb-2">Real-time Simulation</h3>
                <p className="text-sm text-blue-100 leading-relaxed mb-4">
                  See how the classifier works without setting up Python locally. 
                  Our simulated engine uses advanced AI to mimic exactly how a Logistic Regression + SHAP pipeline would behave.
                </p>
                <div className="bg-white/10 p-4 rounded-xl text-xs backdrop-blur-sm border border-white/20 italic">
                  "Try writing something sensational versus something factual to see the SHAP bars change!"
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Viewer Panel */}
        <div className="lg:col-span-8 h-full">
          {activeTab === 'build' ? (
            <div className="h-[calc(100vh-200px)] animate-in zoom-in-95 duration-300">
              <CodeEditor file={selectedFile} />
            </div>
          ) : activeTab === 'simulate' ? (
            <div className="h-[calc(100vh-200px)] animate-in zoom-in-95 duration-300">
              <Simulator />
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
                <img 
                  src="https://picsum.photos/seed/ml/1200/675" 
                  alt="AI Visualization" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end p-8">
                  <div>
                    <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block">Introduction</span>
                    <h2 className="text-4xl font-black text-white mb-2 leading-tight">Mastering Fake News Detection</h2>
                    <p className="text-gray-200 max-w-lg text-sm leading-relaxed">
                      Combatting misinformation requires more than just a label. We build systems that can explain their reasoning, highlighting exactly which words triggered a red flag.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2">Why Logistic Regression?</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    While deep learning is powerful, Logistic Regression is perfect for text classification. It's fast, interpretable, and works exceptionally well with TF-IDF vectors for detecting vocabulary-based patterns in news.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2">The Power of SHAP</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    SHAP values allow us to "see inside the black box". By calculating the contribution of each word to the final probability score, we can provide users with a visual reason for every prediction.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 text-white p-8 rounded-3xl overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Ready to build?</h3>
                  <p className="text-gray-400 mb-6 max-w-md">
                    Switch to the 'Build' tab to explore the full source code and follow the installation instructions to launch your own system locally.
                  </p>
                  <button 
                    onClick={() => setActiveTab('build')}
                    className="bg-white text-gray-900 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
                  >
                    Get Started Now
                  </button>
                </div>
                <i className="fa-solid fa-code absolute -right-4 -bottom-4 text-white/5 text-[160px] transform -rotate-12 pointer-events-none"></i>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2024 Fake News AI Project. Built for educational excellence.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-600">Documentation</a>
            <a href="#" className="hover:text-blue-600">GitHub</a>
            <a href="#" className="hover:text-blue-600">Datasets</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
