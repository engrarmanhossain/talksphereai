import React from 'react';
import { X, Check, Compass } from 'lucide-react';
import type { ProficiencyLevel, Scenario } from '../types';
import { SCENARIOS } from '../services/scenarios';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScenario: Scenario;
  onSelectScenario: (scenario: Scenario) => void;
  currentLevel: ProficiencyLevel;
  onLevelChange: (level: ProficiencyLevel) => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({
  isOpen,
  onClose,
  currentScenario,
  onSelectScenario,
  currentLevel,
  onLevelChange,
}) => {
  if (!isOpen) return null;

  const filteredScenarios = SCENARIOS.filter((s) => s.level === currentLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Choose a Topic or Roleplay</h3>
            <p className="text-xs text-slate-400">Select a real-world scenario to practice speaking</p>
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex items-center gap-2 mb-5 p-1 rounded-2xl bg-slate-950 border border-slate-800">
          {(['beginner', 'intermediate', 'advanced'] as ProficiencyLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                currentLevel === lvl
                  ? lvl === 'beginner'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : lvl === 'intermediate'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'beginner' ? 'Basic / Beginner' : lvl}
            </button>
          ))}
        </div>

        {/* Scenario List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredScenarios.map((scenario) => {
            const isSelected = scenario.id === currentScenario.id;

            return (
              <div
                key={scenario.id}
                onClick={() => {
                  onSelectScenario(scenario);
                  onClose();
                }}
                className={`group p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                      {scenario.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {scenario.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
