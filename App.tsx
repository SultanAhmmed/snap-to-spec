import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { RepairGuide } from './components/RepairGuide';
import { analyzeImageForRepair } from './services/geminiService';
import { AnalysisState, RepairGuideData } from './types';
import { Wrench, RefreshCw, AlertTriangle } from './components/Icons';

function App() {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    data: null
  });

  const handleImageSelected = async (base64: string) => {
    setState({ isLoading: true, error: null, data: null });
    
    try {
      const result: RepairGuideData = await analyzeImageForRepair(base64);
      setState({ isLoading: false, error: null, data: result });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: err.message || "Something went wrong. Please try again.", 
        data: null 
      });
    }
  };

  const handleReset = () => {
    setState({ isLoading: false, error: null, data: null });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={handleReset} role="button">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              Snap-to-Spec
            </span>
          </div>
          {state.data && !state.isLoading && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">New Scan</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        
        {/* Error State */}
        {state.error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-pulse-fast">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p>{state.error}</p>
            <button onClick={handleReset} className="ml-auto text-sm underline hover:text-white">Retry</button>
          </div>
        )}

        {/* Initial/Upload State */}
        {!state.data && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Fix it yourself,<br />
                <span className="text-indigo-500">powered by AI.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl">
                Upload a photo of any broken household item. We'll identify it, diagnose the problem, and give you a step-by-step repair guide.
              </p>
            </div>
            
            <UploadZone 
              onImageSelected={handleImageSelected} 
              isProcessing={state.isLoading} 
            />
            
            {/* Features Grid */}
            {!state.isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl text-center">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Instant Diagnosis</h3>
                  <p className="text-slate-500 text-sm">Visual analysis to identify the exact part and issue.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Smart Safety</h3>
                  <p className="text-slate-500 text-sm">AI-generated safety warnings specific to your repair.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Step-by-Step</h3>
                  <p className="text-slate-500 text-sm">Clear, structured instructions tailored to your skill level.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results State */}
        {state.data && !state.isLoading && (
          <RepairGuide data={state.data} onReset={handleReset} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-auto no-print">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Snap-to-Spec. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;