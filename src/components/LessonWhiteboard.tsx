import { useState } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  Sparkles,
  Repeat,
  AlertCircle,
  CheckCircle2,
  ListOrdered,
  GraduationCap,
} from 'lucide-react';
import type { ChatMessage, VoiceGender } from '../types';
import { speechService } from '../services/speechService';

interface LessonWhiteboardProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  voiceGender: VoiceGender;
  onPracticeRepeat: (text: string, tip?: string) => void;
}

export const LessonWhiteboard: React.FC<LessonWhiteboardProps> = ({
  isOpen,
  onClose,
  messages,
  voiceGender,
  onPracticeRepeat,
}) => {
  const [activeTab, setActiveTab] = useState<'latest' | 'history'>('latest');

  if (!isOpen) return null;

  // Filter messages that have corrections
  const correctedMessages = messages.filter(
    (m) => m.sender === 'user' && m.correction
  );
  const latestCorrectionMsg = correctedMessages[correctedMessages.length - 1];

  const handleSpeakText = (text: string) => {
    speechService.speak(text, voiceGender, 0.9);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-slate-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl flex flex-col transition-all duration-300 animate-slide-left">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Tutor's Lesson Notes</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live
              </span>
            </h3>
            <p className="text-xs text-slate-400">Grammar rules, phonetics, and native phrasing</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close whiteboard"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-800/80 bg-slate-950/40">
        <button
          onClick={() => setActiveTab('latest')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'latest'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Latest Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>All Notes ({correctedMessages.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {activeTab === 'latest' ? (
          latestCorrectionMsg && latestCorrectionMsg.correction ? (
            <div className="space-y-4">
              {/* Card Header & Fluency Gauge */}
              <div
                className={`p-4 rounded-2xl border ${
                  latestCorrectionMsg.correction.hasMistake
                    ? 'bg-rose-950/30 border-rose-900/60'
                    : 'bg-emerald-950/30 border-emerald-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {latestCorrectionMsg.correction.hasMistake ? (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      {latestCorrectionMsg.correction.hasMistake
                        ? `${latestCorrectionMsg.correction.mistakeType} Correction`
                        : 'Accurate Sentence'}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400">
                    {latestCorrectionMsg.correction.fluencyScore}% Fluency
                  </span>
                </div>

                {/* What was said vs Correct */}
                <div className="space-y-2 mt-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-0.5">
                      Your Words:
                    </span>
                    <p
                      className={`text-xs ${
                        latestCorrectionMsg.correction.hasMistake
                          ? 'text-rose-300 line-through'
                          : 'text-slate-200'
                      }`}
                    >
                      "{latestCorrectionMsg.correction.originalText}"
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 relative">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">
                        Correct Phrasing:
                      </span>
                      <button
                        onClick={() =>
                          handleSpeakText(latestCorrectionMsg.correction!.correctedText)
                        }
                        className="text-slate-400 hover:text-emerald-300 transition-colors"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-emerald-300">
                      "{latestCorrectionMsg.correction.correctedText}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Grammar Rule & Pedagogical Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Grammar Rule Explained</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {latestCorrectionMsg.correction.mistakeExplanation}
                </p>
              </div>

              {/* Phonetics & Mouth Position Guidance */}
              {latestCorrectionMsg.correction.pronunciationTip && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Pronunciation & Mouth Position</span>
                  </h4>
                  <p className="text-xs text-pink-200/90 font-mono leading-relaxed">
                    {latestCorrectionMsg.correction.pronunciationTip}
                  </p>
                </div>
              )}

              {/* Native Speaker Upgrade */}
              {latestCorrectionMsg.correction.betterAlternative && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900/60 border border-indigo-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>How a Native Speaker Would Say It</span>
                  </h4>
                  <p className="text-xs text-indigo-200 italic leading-relaxed">
                    "{latestCorrectionMsg.correction.betterAlternative}"
                  </p>
                </div>
              )}

              {/* Practice Button */}
              {latestCorrectionMsg.correction.hasMistake && (
                <button
                  onClick={() => {
                    onPracticeRepeat(
                      latestCorrectionMsg.correction!.correctedText,
                      latestCorrectionMsg.correction!.pronunciationTip
                    );
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Practice Saying Correct Version</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No feedback yet. Start speaking with your tutor!</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {correctedMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-xs">No notes recorded yet in this session.</p>
              </div>
            ) : (
              correctedMessages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      Turn #{i + 1}
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px]">
                      {msg.correction?.fluencyScore}%
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 line-through block">
                      "{msg.correction?.originalText}"
                    </span>
                    <span className="text-emerald-300 font-semibold block">
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
        )}
      </div>
    </div>
  );
};
