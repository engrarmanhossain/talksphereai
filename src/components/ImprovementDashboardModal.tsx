import { useState } from 'react';
import {
  X,
  Target,
  Sparkles,
  Repeat,
  BookOpen,
  Volume2,
  TrendingUp,
} from 'lucide-react';
import type { ImprovementAnalytics, WeakSpotItem, UserProfile } from '../types';

interface ImprovementDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: ImprovementAnalytics;
  user: UserProfile | null;
  onDrillWeakness: (sentence: string, tip?: string) => void;
}

export const ImprovementDashboardModal: React.FC<ImprovementDashboardModalProps> = ({
  isOpen,
  onClose,
  analytics,
  user,
  onDrillWeakness,
}) => {
  const [filter, setFilter] = useState<'all' | 'grammar' | 'pronunciation' | 'vocabulary'>('all');

  if (!isOpen) return null;

  const filteredSpots =
    filter === 'all'
      ? analytics.weakSpots
      : analytics.weakSpots.filter((s) => s.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-800/80">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Where Need to Improve</h3>
              {user && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {user.name}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Personalized AI analysis of recurring grammar, pronunciation, and vocabulary flaws
            </p>
          </div>
        </div>

        {/* Top Mastery Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Overall Mastery
            </span>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-1">
              <span>{analytics.overallMastery}%</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${analytics.overallMastery}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Grammar
            </span>
            <div className="text-2xl font-black text-indigo-400">
              {analytics.grammarMastery}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${analytics.grammarMastery}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Pronunciation
            </span>
            <div className="text-2xl font-black text-pink-400">
              {analytics.pronunciationMastery}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-pink-500 h-full rounded-full transition-all"
                style={{ width: `${analytics.pronunciationMastery}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
              Vocabulary
            </span>
            <div className="text-2xl font-black text-amber-400">
              {analytics.vocabularyMastery}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${analytics.vocabularyMastery}%` }}
              />
            </div>
          </div>
        </div>

        {/* Priority AI Recommendation Banner */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-purple-950/30 border border-indigo-900/50 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-indigo-300 block mb-0.5">
              Personalized Priority Focus:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {analytics.priorityRecommendation}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-4 p-1 rounded-2xl bg-slate-950 border border-slate-800">
          {(['all', 'grammar', 'pronunciation', 'vocabulary'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Weak Spots Drill List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {filteredSpots.map((spot: WeakSpotItem) => {
            const isCritical = spot.masteryPercentage < 75;

            return (
              <div
                key={spot.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCritical
                    ? 'bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 border-rose-900/60'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                {/* Top Row: Title, Category, Mastery Score */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{spot.title}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          spot.category === 'grammar'
                            ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                            : spot.category === 'pronunciation'
                            ? 'bg-pink-950 text-pink-300 border-pink-800'
                            : 'bg-amber-950 text-amber-300 border-amber-800'
                        }`}
                      >
                        {spot.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {spot.explanation}
                    </p>
                  </div>

                  {/* Mastery Badge */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-black ${
                        isCritical ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {spot.masteryPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">Mastery</span>
                  </div>
                </div>

                {/* Example Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-900/30">
                    <span className="text-[10px] text-rose-400 font-bold block mb-0.5">
                      ❌ Common Pitfall:
                    </span>
                    <p className="text-xs text-slate-300 line-through">
                      "{spot.exampleMistake}"
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-900/30">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-0.5">
                      ✅ Correct Target:
                    </span>
                    <p className="text-xs text-emerald-200 font-medium">
                      "{spot.exampleCorrection}"
                    </p>
                  </div>
                </div>

                {/* Rule tip */}
                <div className="text-[11px] text-slate-400 mb-3 flex items-start gap-1.5">
                  {spot.category === 'pronunciation' ? (
                    <Volume2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  )}
                  <span>
                    <strong className="text-slate-300">Rule to Remember:</strong> {spot.ruleTip}
                  </span>
                </div>

                {/* Action: Practice Drill Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 italic">
                    Drill: "{spot.drillSentence}"
                  </span>

                  <button
                    onClick={() => {
                      onDrillWeakness(spot.drillSentence, spot.pronunciationTip);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all shrink-0"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Practice Drill</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
