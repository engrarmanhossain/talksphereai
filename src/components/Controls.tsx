import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Trash2,
} from 'lucide-react';
import type { VoiceGender } from '../types';

interface ControlsProps {
  isListening: boolean;
  onToggleListening: () => void;
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  speechRate: number;
  onSpeedChange: (rate: number) => void;
  voiceGender: VoiceGender;
  onVoiceGenderToggle: () => void;
  onClearChat: () => void;
  speechError: string | null;
}

export const Controls: React.FC<ControlsProps> = ({
  isListening,
  onToggleListening,
  onSendMessage,
  isProcessing,
  isSpeaking,
  onStopSpeaking,
  speechRate,
  onSpeedChange,
  voiceGender,
  onVoiceGenderToggle,
  onClearChat,
  speechError,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isProcessing) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  return (
    <div className="w-full border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl p-4 sm:p-5">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        {/* Error notification banner if any */}
        {speechError && (
          <div className="px-3 py-2 rounded-xl bg-amber-950/60 border border-amber-800 text-xs text-amber-200 flex items-center justify-between">
            <span>{speechError}</span>
          </div>
        )}

        {/* Input Bar & Mic Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Voice Gender Toggle */}
          <button
            onClick={onVoiceGenderToggle}
            className={`px-3 py-3 rounded-2xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shrink-0 ${
              voiceGender === 'female'
                ? 'bg-pink-950/60 border-pink-700/70 text-pink-300 hover:bg-pink-900/60'
                : 'bg-blue-950/60 border-blue-700/70 text-blue-300 hover:bg-blue-900/60'
            }`}
            title="Toggle between Male & Female Voice"
          >
            <span>{voiceGender === 'female' ? '👩 Emma' : '👨 Alex'}</span>
          </button>

          {/* Text Input for Typing / Fallback */}
          <form onSubmit={handleSend} className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to your speech...'
                  : 'Speak using the mic or type your sentence here...'
              }
              disabled={isProcessing}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {inputText.trim() && (
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-md shadow-indigo-600/30"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Prominent Voice Microphone Button */}
          <button
            onClick={onToggleListening}
            disabled={isProcessing}
            className={`relative p-4 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
            }`}
            title={isListening ? 'Click to stop listening' : 'Click to start speaking with AI'}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 animate-spin-slow" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Bottom Utility Bar: Speed, Stop Speaking, Clear Chat */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" /> Speed:
            </span>
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange(spd)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  speechRate === spd
                    ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd === 0.8 ? '0.8x (Learner)' : spd === 1.0 ? '1.0x (Normal)' : '1.2x (Fast)'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="text-pink-400 hover:text-pink-300 font-semibold transition-colors flex items-center gap-1"
              >
                <span>⏹️ Stop Voice</span>
              </button>
            )}

            <button
              onClick={onClearChat}
              className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
              title="Reset conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
