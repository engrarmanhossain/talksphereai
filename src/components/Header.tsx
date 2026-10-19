import React from 'react';
import {
  Mic,
  GraduationCap,
  Key,
  BarChart2,
  Compass,
} from 'lucide-react';
import type { ProficiencyLevel, VoiceGender, Scenario } from '../types';

interface HeaderProps {
  currentLevel: ProficiencyLevel;
  onLevelChange: (level: ProficiencyLevel) => void;
  voiceGender: VoiceGender;
  onVoiceGenderChange: (gender: VoiceGender) => void;
  currentScenario: Scenario;
  onOpenScenarioModal: () => void;
  onOpenApiModal: () => void;
  onOpenStats: () => void;
  hasApiKey: boolean;
  totalSentences: number;
  averageFluency: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  onLevelChange,
  voiceGender,
  onVoiceGenderChange,
  currentScenario,
  onOpenScenarioModal,
  onOpenApiModal,
  onOpenStats,
  hasApiKey,
  totalSentences,
  averageFluency,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white m-0">
                TalkSphere <span className="text-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">AI Speaking & Correction Partner</p>
          </div>
        </div>

        {/* Center Controls: Voice Option & Level Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Option: Male vs Female */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => onVoiceGenderChange('female')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                voiceGender === 'female'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Female Voice: Emma (Warm & Clear)"
            >
              <span>👩</span>
              <span>Emma (Female)</span>
            </button>
            <button
              onClick={() => onVoiceGenderChange('male')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                voiceGender === 'male'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Male Voice: Alex (Friendly & Natural)"
            >
              <span>👨</span>
              <span>Alex (Male)</span>
            </button>
          </div>

          {/* Level Option: Beginner -> Intermediate -> Advanced */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 px-2 font-medium flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Level:
            </span>
            {(['beginner', 'intermediate', 'advanced'] as ProficiencyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onLevelChange(lvl)}
                className={`capitalize px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentLevel === lvl
                    ? lvl === 'beginner'
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20 shadow'
                      : lvl === 'intermediate'
                      ? 'bg-amber-600 text-white shadow-amber-600/20 shadow'
                      : 'bg-purple-600 text-white shadow-purple-600/20 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'beginner' ? 'Basic' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Right Tools: Scenario Switcher, Stats, API Key */}
        <div className="flex items-center gap-2">
          {/* Scenario Trigger */}
          <button
            onClick={onOpenScenarioModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-medium transition-all"
            title="Change Conversation Topic or Roleplay"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[120px] truncate">{currentScenario.icon} {currentScenario.title}</span>
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-medium transition-all"
            title="View Fluency Score & Speaking Progress"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-semibold">{totalSentences} spoken</span>
            <span className="text-emerald-400 font-bold">({averageFluency}%)</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiModal}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 ${
              hasApiKey
                ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={hasApiKey ? 'Gemini AI Connected' : 'Connect Gemini AI Key (Optional)'}
          >
            <Key className="w-3.5 h-3.5" />
            {hasApiKey ? (
              <span className="hidden sm:inline text-[11px] text-indigo-300 font-medium">Gemini 2.5</span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};
