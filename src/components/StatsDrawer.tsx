import React from 'react';
import { X, BarChart3, Flame, CheckCircle, Repeat } from 'lucide-react';
import type { UserStats, ChatMessage } from '../types';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  messages: ChatMessage[];
  onPracticeRepeat: (text: string, tip?: string) => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  messages,
  onPracticeRepeat,
}) => {
  if (!isOpen) return null;

  // Extract all messages where mistakes were found
  const mistakeMessages = messages.filter(
    (m) => m.sender === 'user' && m.correction && m.correction.hasMistake
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your Speaking Performance</h3>
            <p className="text-xs text-slate-400">Session metrics, fluency analysis, and review log</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Fluency
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {stats.averageFluency}%
            </div>
            <span className="text-[10px] text-slate-500">Average rating</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Sentences
            </span>
            <div className="text-2xl font-black text-indigo-400">
              {stats.totalSentences}
            </div>
            <span className="text-[10px] text-slate-500">Spoken turns</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Corrections
            </span>
            <div className="text-2xl font-black text-amber-400">
              {stats.mistakesCorrected}
            </div>
            <span className="text-[10px] text-slate-500">Rules learned</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Streak
            </span>
            <div className="text-2xl font-black text-rose-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-rose-400" />
              <span>{stats.streakCount}</span>
            </div>
            <span className="text-[10px] text-slate-500">Active turns</span>
          </div>
        </div>

        {/* Mistakes Review Section */}
        <div className="flex-1 overflow-y-auto space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span>Mistakes Review Log ({mistakeMessages.length})</span>
          </h4>

          {mistakeMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-xs">No mistakes made yet! Excellent work.</p>
            </div>
          ) : (
            mistakeMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                    {msg.correction?.mistakeType}
                  </span>
                  <button
                    onClick={() => {
                      if (msg.correction) {
                        onPracticeRepeat(
                          msg.correction.correctedText,
                          msg.correction.pronunciationTip
                        );
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Practice Again</span>
                  </button>
                </div>

                <div>
                  <span className="text-slate-500 line-through block">
                    "{msg.correction?.originalText}"
                  </span>
                  <span className="text-emerald-300 font-medium block">
                    "{msg.correction?.correctedText}"
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {msg.correction?.mistakeExplanation}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
