import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { VoiceGender } from '../types';
import { speechService } from '../services/speechService';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSentence: string;
  pronunciationTip?: string;
  voiceGender: VoiceGender;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  onClose,
  targetSentence,
  pronunciationTip,
  voiceGender,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [recognizer, setRecognizer] = useState<any>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setSpokenTranscript('');
      setScore(null);
      setFeedback('');
      if (recognizer) {
        try {
          recognizer.abort();
        } catch {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleListenTarget = () => {
    speechService.speak(targetSentence, voiceGender, 0.85);
  };

  const calculateSimilarity = (target: string, spoken: string) => {
    const cleanT = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
    const cleanS = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);

    if (cleanT.length === 0 || cleanS.length === 0) return 0;

    let matchCount = 0;
    cleanS.forEach((word) => {
      if (cleanT.includes(word)) {
        matchCount++;
      }
    });

    const accuracy = Math.round((matchCount / Math.max(cleanT.length, cleanS.length)) * 100);
    return Math.min(100, accuracy);
  };

  const handleStartPracticing = () => {
    if (isRecording) {
      if (recognizer) recognizer.stop();
      setIsRecording(false);
      return;
    }

    setSpokenTranscript('');
    setScore(null);
    setFeedback('Listening... Please pronounce the sentence now!');

    const rec = speechService.createRecognizer({
      onStart: () => {
        setIsRecording(true);
      },
      onResult: (transcript, isFinal) => {
        setSpokenTranscript(transcript);
        if (isFinal) {
          const calculatedScore = calculateSimilarity(targetSentence, transcript);
          setScore(calculatedScore);
          setIsRecording(false);

          if (calculatedScore >= 85) {
            setFeedback('Outstanding pronunciation! You nailed it! 🌟');
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          } else if (calculatedScore >= 60) {
            setFeedback('Good effort! Listen to the model audio again and try to match the rhythm.');
          } else {
            setFeedback('Keep trying! Break it down slowly and repeat once more.');
          }
        }
      },
      onError: (err) => {
        setFeedback(`Microphone notice: ${err}`);
        setIsRecording(false);
      },
      onEnd: () => {
        setIsRecording(false);
      },
    });

    if (rec) {
      setRecognizer(rec);
      rec.start();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pronunciation & Repeat Practice</h3>
            <p className="text-xs text-slate-400">Master the corrected sentence with voice feedback</p>
          </div>
        </div>

        {/* Target Sentence Box */}
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 mb-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 block">
            Sentence to Pronounce:
          </span>
          <p className="text-base sm:text-lg font-medium text-white mb-3">
            "{targetSentence}"
          </p>

          <button
            onClick={handleListenTarget}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-indigo-300 transition-all shadow"
          >
            <Volume2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Listen to Model Pronunciation</span>
          </button>
        </div>

        {/* Phonetic Tip if provided */}
        {pronunciationTip && (
          <div className="mb-5 px-4 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/40 text-xs text-indigo-200">
            <span className="font-semibold block mb-0.5 text-indigo-300">🗣️ Pronunciation Guidance:</span>
            <span>{pronunciationTip}</span>
          </div>
        )}

        {/* Spoken Output Display */}
        {spokenTranscript && (
          <div className="mb-4 bg-slate-950/70 rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1">What was detected:</span>
            <p className="text-sm text-slate-200 italic">"{spokenTranscript}"</p>
          </div>
        )}

        {/* Feedback & Score */}
        {score !== null && (
          <div
            className={`mb-5 p-4 rounded-2xl border text-center transition-all ${
              score >= 85
                ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
                : 'bg-amber-950/50 border-amber-700 text-amber-200'
            }`}
          >
            <div className="text-2xl font-black mb-1 flex items-center justify-center gap-1.5">
              <span>{score}% Match</span>
              {score >= 85 && <Sparkles className="w-5 h-5 text-amber-400" />}
            </div>
            <p className="text-xs font-medium">{feedback}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleStartPracticing}
            className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-xl transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Recording... Tap when finished</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Tap & Speak Now</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Done Practicing
          </button>
        </div>
      </div>
    </div>
  );
};
