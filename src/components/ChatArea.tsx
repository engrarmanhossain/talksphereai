import React, { useRef, useEffect } from 'react';
import {
  Volume2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ChatMessage, VoiceGender } from '../types';
import { CorrectionCard } from './CorrectionCard';
import { VOICE_PERSONAS, speechService } from '../services/speechService';

interface ChatAreaProps {
  messages: ChatMessage[];
  voiceGender: VoiceGender;
  onPracticeRepeat: (text: string, tip?: string) => void;
  expandedCorrectionId: string | null;
  onToggleCorrection: (id: string) => void;
  isAiSpeaking: boolean;
  activeSpeakingId: string | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  voiceGender,
  onPracticeRepeat,
  expandedCorrectionId,
  onToggleCorrection,
  isAiSpeaking,
  activeSpeakingId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const persona = VOICE_PERSONAS[voiceGender];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, expandedCorrectionId]);

  const handlePlayAiAudio = (msg: ChatMessage) => {
    speechService.speak(msg.text, voiceGender);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mb-4">
            🎙️
          </div>
          <h3 className="text-base font-semibold text-slate-300 mb-1">
            Ready to Speak!
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Press the microphone button below and start speaking in English. Your AI partner will listen, correct any grammar or pronunciation flaws, and converse naturally with you.
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const isSpeakingThis = isAi && isAiSpeaking && activeSpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isAi ? 'items-start' : 'items-end'
              } transition-all duration-300 animate-fade-in`}
            >
              {/* Message Bubble Row */}
              <div
                className={`flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] ${
                  isAi ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base shadow-md border ${
                    isAi
                      ? voiceGender === 'female'
                        ? 'bg-pink-950/60 border-pink-700/60 text-white'
                        : 'bg-blue-950/60 border-blue-700/60 text-white'
                      : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                  }`}
                >
                  {isAi ? persona.avatar : '🗣️'}
                </div>

                {/* Content Bubble */}
                <div
                  className={`rounded-2xl p-4 shadow-md text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-sm'
                      : 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-indigo-900/30'
                  }`}
                >
                  {/* Sender label & Time */}
                  <div className="flex items-center justify-between gap-3 mb-1.5 opacity-80 text-xs">
                    <span className="font-semibold">
                      {isAi ? `${persona.name} (Tutor)` : 'You'}
                    </span>
                    <span className="text-[10px] opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Message Text */}
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* AI Audio Replay Button */}
                  {isAi && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => handlePlayAiAudio(msg)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isSpeakingThis
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                        title="Replay speech audio"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeakingThis ? 'animate-pulse text-pink-400' : ''}`} />
                        <span>{isSpeakingThis ? 'Speaking...' : 'Listen'}</span>
                      </button>
                      <span className="text-[10px] text-slate-500">
                        {persona.name} • {voiceGender}
                      </span>
                    </div>
                  )}

                  {/* User Inline Correction Status Badge */}
                  {!isAi && msg.correction && (
                    <div className="mt-2 pt-2 border-t border-indigo-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        {msg.correction.hasMistake ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 font-medium text-[11px]">
                            <AlertCircle className="w-3 h-3 text-rose-300" />
                            <span>Mistake detected</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-medium text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                            <span>Accurate</span>
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-indigo-200">
                          {msg.correction.fluencyScore}% Fluency
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleCorrection(msg.id)}
                        className="flex items-center gap-1 text-[11px] text-indigo-200 hover:text-white font-medium underline-offset-2 hover:underline"
                      >
                        <span>{expandedCorrectionId === msg.id ? 'Hide Feedback' : 'View Feedback'}</span>
                        {expandedCorrectionId === msg.id ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Correction Details Card */}
              {!isAi && msg.correction && expandedCorrectionId === msg.id && (
                <div className="w-full max-w-2xl mt-3 animate-fade-in pl-11">
                  <CorrectionCard
                    correction={msg.correction}
                    voiceGender={voiceGender}
                    onPracticeRepeat={onPracticeRepeat}
                  />
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
