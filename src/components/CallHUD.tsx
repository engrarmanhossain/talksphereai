import { useState } from 'react';
import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  FileText,
  Compass,
  PhoneOff,
  Send,
  Keyboard,
  Volume2,
  VolumeX,
  Pause,
  Play,
} from 'lucide-react';
import type { VoiceGender } from '../types';

interface CallHUDProps {
  isListening: boolean;
  onToggleListening: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  voiceGender: VoiceGender;
  onVoiceGenderToggle: () => void;
  onOpenWhiteboard: () => void;
  whiteboardNotesCount: number;
  onOpenScenarioModal: () => void;
  onResetCall: () => void;
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  speechRate: number;
  onCycleSpeechRate: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const CallHUD: React.FC<CallHUDProps> = ({
  isListening,
  onToggleListening,
  isCameraOn,
  onToggleCamera,
  voiceGender,
  onVoiceGenderToggle,
  onOpenWhiteboard,
  whiteboardNotesCount,
  onOpenScenarioModal,
  onResetCall,
  onSendMessage,
  isProcessing,
  soundEffectsEnabled,
  onToggleSoundEffects,
  speechRate,
  onCycleSpeechRate,
  isPaused,
  onTogglePause,
}) => {
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');

  const handleSendTyped = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim() || isProcessing || isPaused) return;
    onSendMessage(typedMessage.trim());
    setTypedMessage('');
    setShowTextFallback(false);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl">
      {/* Optional Pop-up Text Input Fallback Bar */}
      {showTextFallback && (
        <form
          onSubmit={handleSendTyped}
          className="mb-3 flex items-center gap-2 p-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-2xl animate-fade-in"
        >
          <input
            type="text"
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={
              isPaused
                ? 'Session is paused. Resume to send messages...'
                : 'Type your message if you cannot speak right now...'
            }
            disabled={isPaused}
            autoFocus
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!typedMessage.trim() || isProcessing || isPaused}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Floating Glassmorphic Action Dock */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-3xl bg-slate-950/80 border border-slate-700/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Tutor / Partner Switcher Button */}
        <button
          onClick={onVoiceGenderToggle}
          disabled={isPaused}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-sm ${
            isPaused
              ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
              : voiceGender === 'girl'
              ? 'bg-pink-950/70 border-pink-500/80 text-pink-200 hover:bg-pink-900/70'
              : voiceGender === 'boy'
              ? 'bg-sky-950/70 border-sky-500/80 text-sky-200 hover:bg-sky-900/70'
              : voiceGender === 'female'
              ? 'bg-purple-950/60 border-purple-700/80 text-purple-300 hover:bg-purple-900/60'
              : 'bg-blue-950/60 border-blue-700/80 text-blue-300 hover:bg-blue-900/60'
          }`}
          title="Switch Speaking Partner: Lily (Baby Girl) 👧, Leo (Baby Boy) 👦, Emma 👩, Alex 👨"
        >
          <span>
            {voiceGender === 'girl'
              ? '👧 Lily (Girl)'
              : voiceGender === 'boy'
              ? '👦 Leo (Boy)'
              : voiceGender === 'female'
              ? '👩 Emma'
              : '👨 Alex'}
          </span>
        </button>

        {/* User Camera Toggle */}
        <button
          onClick={onToggleCamera}
          className={`p-3 rounded-2xl border transition-all ${
            isCameraOn
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-slate-900/90 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={isCameraOn ? 'Turn camera off' : 'Turn camera on'}
        >
          {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
        </button>

        {/* Pause / Resume Button */}
        <button
          onClick={onTogglePause}
          className={`p-3 rounded-2xl border transition-all shadow-lg ${
            isPaused
              ? 'bg-amber-600 border-amber-500 text-white ring-4 ring-amber-500/40 animate-pulse'
              : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-amber-300 hover:text-amber-200'
          }`}
          title={isPaused ? 'Resume speaking session' : 'Pause speaking session'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Big Central Microphone Button */}
        <button
          onClick={isPaused ? onTogglePause : onToggleListening}
          disabled={isProcessing}
          className={`relative p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isPaused
              ? 'bg-slate-800 text-amber-300 border border-amber-500/30 opacity-90'
              : isListening
              ? 'bg-rose-600 text-white ring-4 ring-rose-500/50 scale-105 animate-pulse shadow-rose-600/50'
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white hover:scale-105 active:scale-95 shadow-indigo-600/40 ring-2 ring-indigo-400/30'
          }`}
          title={
            isPaused
              ? 'Session is paused. Tap to resume.'
              : isListening
              ? 'Tap to finish speaking'
              : 'Tap to start speaking'
          }
        >
          {isPaused ? (
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-amber-300" />
          ) : isListening ? (
            <MicOff className="w-6 h-6 sm:w-7 sm:h-7" />
          ) : (
            <Mic className="w-6 h-6 sm:w-7 sm:h-7" />
          )}

          {/* Glowing pulse ring around button when listening */}
          {!isPaused && isListening && (
            <span className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-rose-500/30 animate-ping pointer-events-none" />
          )}
        </button>

        {/* Whiteboard / Notes Drawer Button */}
        <button
          onClick={onOpenWhiteboard}
          className="relative p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow"
          title="Open Lesson Notes & Corrections Whiteboard"
        >
          <FileText className="w-4 h-4" />
          {whiteboardNotesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow">
              {whiteboardNotesCount}
            </span>
          )}
        </button>

        {/* Scenario / Topic Switcher */}
        <button
          onClick={onOpenScenarioModal}
          className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all shadow hidden sm:flex"
          title="Change conversation scenario or roleplay"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Speech Speed Cycle Button */}
        <button
          onClick={onCycleSpeechRate}
          className="px-2.5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all shadow"
          title="Speech playback speed"
        >
          <span>{speechRate}x</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={onToggleSoundEffects}
          className={`p-3 rounded-2xl border transition-all hidden sm:flex ${
            soundEffectsEnabled
              ? 'bg-slate-900/90 border-slate-800 text-indigo-400'
              : 'bg-slate-900/90 border-slate-800 text-slate-600'
          }`}
          title={soundEffectsEnabled ? 'Sound effects enabled' : 'Sound effects muted'}
        >
          {soundEffectsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Keyboard Typing Toggle */}
        <button
          onClick={() => setShowTextFallback((prev) => !prev)}
          className={`p-3 rounded-2xl border transition-all ${
            showTextFallback
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Type message with keyboard"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* End / Reset Call Button */}
        <button
          onClick={onResetCall}
          className="p-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-all shadow"
          title="Reset lesson"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
