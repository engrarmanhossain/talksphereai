import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Volume2,
  Sparkles,
  Repeat,
  BookOpen,
} from 'lucide-react';
import type { CorrectionDetail, VoiceGender } from '../types';
import { speechService } from '../services/speechService';

interface CorrectionCardProps {
  correction: CorrectionDetail;
  voiceGender: VoiceGender;
  onPracticeRepeat: (textToPractice: string, tip?: string) => void;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({
  correction,
  voiceGender,
  onPracticeRepeat,
}) => {
  const {
    hasMistake,
    originalText,
    correctedText,
    mistakeType,
    mistakeExplanation,
    betterAlternative,
    pronunciationTip,
    fluencyScore,
  } = correction;

  const handleSpeakCorrection = () => {
    speechService.speak(correctedText, voiceGender, 0.9);
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 shadow-xl ${
        hasMistake
          ? 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border-rose-900/60 shadow-rose-950/20'
          : 'bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border-emerald-900/50 shadow-emerald-950/20'
      }`}
    >
      {/* Top Bar: Status & Fluency Score */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {hasMistake ? (
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                {hasMistake ? 'Feedback & Corrections' : 'Flawless Expression!'}
              </h4>
              {hasMistake && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-800">
                  {mistakeType}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {hasMistake ? 'AI detected areas to refine' : 'Natural phrasing and accurate grammar'}
            </p>
          </div>
        </div>

        {/* Fluency Score Badge */}
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-extrabold ${
                fluencyScore >= 90
                  ? 'text-emerald-400'
                  : fluencyScore >= 75
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {fluencyScore}
            </span>
            <span className="text-xs text-slate-500">/100</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Fluency Rating</span>
        </div>
      </div>

      {/* Before / After Comparison */}
      {hasMistake && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* What you said */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-rose-900/30">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              <span>❌</span> What You Said:
            </span>
            <p className="text-sm text-slate-300 line-through decoration-rose-500/70">
              "{originalText}"
            </p>
          </div>

          {/* Corrected version */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-emerald-900/40 relative group">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide flex items-center justify-between mb-1">
              <span className="flex items-center gap-1">
                <span>✅</span> Correct Phrasing:
              </span>
              <button
                onClick={handleSpeakCorrection}
                className="text-slate-400 hover:text-emerald-300 transition-colors p-1"
                title="Listen to correct pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </span>
            <p className="text-sm font-medium text-emerald-200">
              "{correctedText}"
            </p>
          </div>
        </div>
      )}

      {/* Explanation of the error */}
      <div className="mb-3 bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
        <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Rule & Explanation:</span>
        </h5>
        <p className="text-xs text-slate-400 leading-relaxed">
          {mistakeExplanation}
        </p>
      </div>

      {/* Pronunciation & Phonetics Tip */}
      {pronunciationTip && (
        <div className="mb-3 bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
          <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
            <Volume2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Pronunciation & Mouth Shape:</span>
          </h5>
          <p className="text-xs text-pink-200/90 font-mono leading-relaxed">
            {pronunciationTip}
          </p>
        </div>
      )}

      {/* Native-Speaker Upgrade / Better Alternative */}
      {betterAlternative && betterAlternative !== correctedText && (
        <div className="mb-4 bg-gradient-to-r from-indigo-950/40 to-slate-900/60 rounded-xl p-3 border border-indigo-900/30">
          <h5 className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Native Speaker Alternative:</span>
          </h5>
          <p className="text-xs text-indigo-200 italic leading-relaxed">
            "{betterAlternative}"
          </p>
        </div>
      )}

      {/* Practice Button Action */}
      {hasMistake && (
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onPracticeRepeat(correctedText, pronunciationTip)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Practice Saying Correct Version</span>
          </button>

          <button
            onClick={handleSpeakCorrection}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Listen to Model Audio</span>
          </button>
        </div>
      )}
    </div>
  );
};
