import React from 'react';
import { Mic, Volume2, Sparkles, Loader2 } from 'lucide-react';
import type { VoiceGender } from '../types';
import { VOICE_PERSONAS } from '../services/speechService';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  voiceGender: VoiceGender;
  interimTranscript?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  voiceGender,
  interimTranscript,
}) => {
  const persona = VOICE_PERSONAS[voiceGender];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Background glow effect */}
      <div
        className={`absolute -inset-1 blur-2xl opacity-20 pointer-events-none transition-all duration-700 ${
          isSpeaking
            ? voiceGender === 'female'
              ? 'bg-pink-500'
              : 'bg-blue-500'
            : isListening
            ? 'bg-emerald-500'
            : isProcessing
            ? 'bg-amber-500'
            : 'bg-slate-700'
        }`}
      />

      <div className="relative flex flex-col items-center justify-center text-center">
        {/* Avatar & Status Ring */}
        <div className="relative mb-3 flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 transition-all duration-300 ${
              isSpeaking
                ? voiceGender === 'female'
                  ? 'border-pink-500 ring-4 ring-pink-500/20 shadow-pink-500/30'
                  : 'border-blue-500 ring-4 ring-blue-500/20 shadow-blue-500/30'
                : isListening
                ? 'border-emerald-500 ring-4 ring-emerald-500/25 shadow-emerald-500/30 animate-pulse'
                : isProcessing
                ? 'border-amber-500 ring-4 ring-amber-500/20 shadow-amber-500/30'
                : 'border-slate-700 bg-slate-800/80 text-slate-300'
            }`}
          >
            {persona.avatar}
          </div>

          {/* Active status badge indicator */}
          <div
            className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md border ${
              isSpeaking
                ? 'bg-pink-900/90 border-pink-700 text-pink-200'
                : isListening
                ? 'bg-emerald-900/90 border-emerald-700 text-emerald-200'
                : isProcessing
                ? 'bg-amber-900/90 border-amber-700 text-amber-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isSpeaking ? (
              <>
                <Volume2 className="w-3 h-3 animate-pulse" /> Speaking
              </>
            ) : isListening ? (
              <>
                <Mic className="w-3 h-3 animate-bounce" /> Listening
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Thinking
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" /> Ready
              </>
            )}
          </div>
        </div>

        {/* Persona Info */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
            {persona.name}{' '}
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {voiceGender === 'female' ? 'Female Voice' : 'Male Voice'}
            </span>
          </h3>
          <p className="text-xs text-slate-400">{persona.title}</p>
        </div>

        {/* Audio Waveform Animation */}
        <div className="h-10 flex items-center justify-center gap-1.5 px-4 my-1">
          {isSpeaking ? (
            <>
              <span className={`w-1.5 rounded-full ${voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'} animate-soundwave-1`} />
              <span className={`w-1.5 rounded-full ${voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'} animate-soundwave-2`} />
              <span className={`w-1.5 rounded-full ${voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'} animate-soundwave-3`} />
              <span className={`w-1.5 rounded-full ${voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'} animate-soundwave-4`} />
              <span className={`w-1.5 rounded-full ${voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'} animate-soundwave-5`} />
            </>
          ) : isListening ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-400 font-medium">Listening to your voice... Speak now!</span>
            </div>
          ) : isProcessing ? (
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Analyzing grammar & pronunciation...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 opacity-40">
              <span className="w-1.5 h-2 rounded-full bg-slate-600" />
              <span className="w-1.5 h-3 rounded-full bg-slate-600" />
              <span className="w-1.5 h-4 rounded-full bg-slate-600" />
              <span className="w-1.5 h-3 rounded-full bg-slate-600" />
              <span className="w-1.5 h-2 rounded-full bg-slate-600" />
            </div>
          )}
        </div>

        {/* Live Interim Transcript Bubble */}
        {isListening && interimTranscript && (
          <div className="mt-2 max-w-md px-3 py-1.5 bg-slate-800/90 rounded-lg border border-emerald-500/40 text-xs text-emerald-200 shadow-sm animate-fade-in">
            <span className="italic">"{interimTranscript}"</span>
          </div>
        )}
      </div>
    </div>
  );
};
