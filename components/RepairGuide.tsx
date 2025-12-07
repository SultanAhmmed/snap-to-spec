import React, { useState } from 'react';
import { RepairGuideData, DifficultyLevel } from '../types';
import { Wrench, Clock, ShieldAlert, CheckCircle2, ChevronRight, Hammer, Square, CheckSquare, FileDown } from './Icons';

interface RepairGuideProps {
  data: RepairGuideData;
  onReset: () => void;
}

const DifficultyBadge: React.FC<{ level: DifficultyLevel }> = ({ level }) => {
  const colors = {
    [DifficultyLevel.Beginner]: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    [DifficultyLevel.Intermediate]: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    [DifficultyLevel.Advanced]: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    [DifficultyLevel.Expert]: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[level]} uppercase tracking-wider`}>
      {level}
    </span>
  );
};

export const RepairGuide: React.FC<RepairGuideProps> = ({ data, onReset }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const allStepsCompleted = data.repairSteps.length > 0 && completedSteps.size === data.repairSteps.length;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up pb-20 print:pb-0">
      
      {/* Safety Warnings - Top Priority */}
      {data.safetyWarnings.length > 0 && (
        <div className="bg-red-950/30 border border-red-500/40 rounded-3xl p-6 mb-6 flex gap-4 items-start shadow-[0_0_20px_rgba(220,38,38,0.1)] print:border-red-500">
          <div className="p-2 bg-red-500/20 rounded-xl shrink-0">
            <ShieldAlert className="w-6 h-6 text-red-400 print:text-red-600" />
          </div>
          <div>
            <h3 className="text-red-400 font-bold text-lg mb-2 print:text-red-600">Safety First</h3>
            <ul className="list-disc list-inside space-y-1.5 text-red-100/90 text-sm print:text-black">
              {data.safetyWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-slate-800 rounded-3xl p-6 md:p-8 mb-6 border border-slate-700 shadow-xl print:shadow-none print:border-slate-300 print:bg-slate-100">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 print:text-black">{data.itemName}</h1>
            {data.modelNumber && (
              <p className="text-slate-400 font-mono text-sm bg-slate-900/50 inline-block px-2 py-1 rounded print:text-slate-600 print:bg-slate-200">
                Model: {data.modelNumber}
              </p>
            )}
          </div>
          <DifficultyBadge level={data.difficultyLevel} />
        </div>
        
        <p className="text-slate-300 text-lg leading-relaxed border-l-4 border-indigo-500 pl-4 py-1 mb-6 print:text-slate-800">
          {data.damageAnalysis}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 print:bg-slate-200 print:border-slate-300">
            <div className="flex items-center gap-2 text-indigo-400 mb-1 print:text-indigo-700">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-wider">Est. Time</span>
            </div>
            <p className="font-semibold text-slate-200 print:text-black">{data.estimatedTime}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 col-span-2 md:col-span-3 print:bg-slate-200 print:border-slate-300">
             <div className="flex items-center gap-2 text-indigo-400 mb-1 print:text-indigo-700">
              <Wrench className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-wider">Tools Needed</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.toolsRequired.map((tool, idx) => (
                <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-sm border border-slate-700 print:bg-white print:text-black print:border-slate-400">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Steps Checklist */}
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 print:text-black">
        <Hammer className="w-6 h-6 text-indigo-400 print:text-indigo-600" />
        Repair Checklist
      </h2>

      <div className="space-y-4">
        {data.repairSteps.map((step) => {
          const isCompleted = completedSteps.has(step.stepNumber);
          return (
            <div 
              key={step.stepNumber} 
              onClick={() => toggleStep(step.stepNumber)}
              className={`
                relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer group break-inside-avoid
                ${isCompleted 
                  ? 'bg-slate-900/40 border-slate-800 opacity-60 print:opacity-100 print:bg-slate-50' 
                  : 'bg-slate-800 border-slate-700 hover:border-indigo-500/50 shadow-sm print:bg-white print:border-slate-300'
                }
              `}
            >
              {/* Checkbox UI */}
              <div className={`mt-1 transition-colors duration-300 ${isCompleted ? 'text-emerald-500' : 'text-slate-600 group-hover:text-indigo-400'}`}>
                {isCompleted ? (
                  <CheckSquare className="w-6 h-6" />
                ) : (
                  <Square className="w-6 h-6" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`
                    text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide
                    ${isCompleted 
                      ? 'bg-emerald-500/10 text-emerald-500 print:bg-emerald-100 print:text-emerald-700' 
                      : 'bg-slate-700 text-slate-400 print:bg-slate-200 print:text-slate-600'
                    }
                  `}>
                    Step {step.stepNumber}
                  </span>
                  <h3 className={`font-bold text-lg transition-colors ${isCompleted ? 'text-slate-400 line-through decoration-slate-600 print:text-slate-500' : 'text-slate-100 print:text-black'}`}>
                    {step.action}
                  </h3>
                </div>
                <p className={`leading-relaxed transition-colors ${isCompleted ? 'text-slate-600 print:text-slate-400' : 'text-slate-400 print:text-slate-700'}`}>
                  {step.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col items-center gap-6 no-print">
        {/* Export Button */}
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-indigo-500/10"
        >
          <FileDown className="w-5 h-5" />
          Export to PDF
        </button>

        {/* Completion Card */}
        <div className={`bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 w-full max-w-md transition-all duration-500 ${allStepsCompleted ? 'scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}>
          <div className="flex flex-col items-center gap-4 text-center">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${allStepsCompleted ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
               <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-white font-bold text-lg">
                 {allStepsCompleted ? "Great Work! Repair Complete." : "Job Done?"}
               </h3>
               <p className="text-slate-400 text-sm">
                 {allStepsCompleted ? "You've checked off all the steps." : "Snap another item to fix something else."}
               </p>
             </div>
             <button 
              onClick={onReset}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Start New Repair
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};