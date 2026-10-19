import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Key,
  BarChart2,
  Compass,
  Clock,
  Sparkles,
  Target,
  Pause,
  Play,
} from 'lucide-react';
import type { ProficiencyLevel, Scenario, UserProfile } from '../types';
import { UserProfileMenu } from './UserProfileMenu';

interface CallHeaderProps {
  currentLevel: ProficiencyLevel;
  onLevelChange: (level: ProficiencyLevel) => void;
  currentScenario: Scenario;
  onOpenScenarioModal: () => void;
  onOpenApiModal: () => void;
  onOpenStats: () => void;
  hasApiKey: boolean;
  totalSentences: number;
  averageFluency: number;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenImprovementDashboard: () => void;
  onLogout: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const CallHeader: React.FC<CallHeaderProps> = ({
  currentLevel,
  onLevelChange,
  currentScenario,
  onOpenScenarioModal,
  onOpenApiModal,
  onOpenStats,
  hasApiKey,
  totalSentences,
  averageFluency,
  user,
  onOpenAuthModal,
  onOpenImprovementDashboard,
  onLogout,
  isPaused,
  onTogglePause,
}) => {
  // Live lesson timer
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto">
        {/* Brand, Call Timer & Pause indicator */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white shrink-0">
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                TalkSphere <span className="text-indigo-400">Live</span>
              </span>

              {isPaused ? (
                <button
                  onClick={onTogglePause}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold animate-pulse hover:bg-amber-500/30 transition-all"
                  title="Click to resume conversation"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>PAUSED</span>
                </button>
              ) : (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono text-slate-300">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>{formatTime(seconds)}</span>
              </span>

              {/* Pause/Resume quick button next to timer */}
              <button
                onClick={onTogglePause}
                className="text-slate-400 hover:text-amber-300 transition-colors p-0.5"
                title={isPaused ? 'Resume conversation' : 'Pause conversation'}
              >
                {isPaused ? (
                  <Play className="w-3 h-3 fill-current text-amber-400" />
                ) : (
                  <Pause className="w-3 h-3 text-slate-400 hover:text-amber-300" />
                )}
              </button>

              <span className="text-slate-600">•</span>
              <button
                onClick={onOpenScenarioModal}
                className="hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium truncate max-w-[110px] sm:max-w-[160px]"
              >
                <span>{currentScenario.icon} {currentScenario.title}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Level Pill Selector (Basic to Advanced) */}
        <div className="hidden md:flex items-center p-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl">
          <span className="text-xs text-slate-400 px-2.5 font-semibold flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Level:
          </span>
          {(['beginner', 'intermediate', 'advanced'] as ProficiencyLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl)}
              className={`capitalize px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                currentLevel === lvl
                  ? lvl === 'beginner'
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30 shadow'
                    : lvl === 'intermediate'
                    ? 'bg-amber-600 text-white shadow-amber-600/30 shadow'
                    : 'bg-purple-600 text-white shadow-purple-600/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl === 'beginner' ? 'Basic' : lvl}
            </button>
          ))}
        </div>

        {/* Right Tools: Where to Improve, Performance Score, Gemini Key, Google Auth Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Topic Trigger */}
          <button
            onClick={onOpenScenarioModal}
            className="flex sm:hidden p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300"
            title="Change topic"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          {/* Dedicated "Where Need to Improve" Button */}
          <button
            onClick={onOpenImprovementDashboard}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-950/90 to-purple-950/80 hover:from-indigo-900/90 hover:to-purple-900/80 border border-indigo-700/60 text-indigo-300 text-xs font-bold transition-all shadow-md shadow-indigo-950/50 hover:scale-105 active:scale-95"
            title="View personal weak spots and grammar diagnostics"
          >
            <Target className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="hidden sm:inline">Where to Improve</span>
            <span className="sm:hidden">Improve</span>
          </button>

          {/* Performance Stats Button */}
          <button
            onClick={onOpenStats}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-semibold backdrop-blur-md transition-all"
            title="View Fluency Performance"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-slate-400">{totalSentences} spoken</span>
            <span className="text-emerald-400 font-bold">({averageFluency}%)</span>
          </button>

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenApiModal}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all text-xs flex items-center gap-1.5 ${
              hasApiKey
                ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={hasApiKey ? 'Gemini AI Connected' : 'Connect Gemini AI Key (Optional)'}
          >
            <Key className="w-3.5 h-3.5" />
          </button>

          {/* Google Registration & Login User Profile Menu */}
          <UserProfileMenu
            user={user}
            onOpenAuthModal={onOpenAuthModal}
            onOpenImprovementDashboard={onOpenImprovementDashboard}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};
