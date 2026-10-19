import { useState } from 'react';
import {
  Volume2,
  Mic,
  Sparkles,
  ShieldCheck,
  Globe,
  Radio,
  FileText,
  AlertCircle,
  Repeat,
  Pause,
  Play,
} from 'lucide-react';
import type { VoiceGender, ChatMessage } from '../types';
import { VOICE_PERSONAS } from '../services/speechService';
import { UserWebcam } from './UserWebcam';

interface TutorVideoStageProps {
  voiceGender: VoiceGender;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  currentSubtitle: string;
  latestUserMessage: ChatMessage | null;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  micVolume: number;
  onOpenWhiteboard: () => void;
  onPracticeRepeat: (text: string, tip?: string) => void;
  isPaused: boolean;
  onResume: () => void;
}

export const TutorVideoStage: React.FC<TutorVideoStageProps> = ({
  voiceGender,
  isListening,
  isSpeaking,
  isProcessing,
  currentSubtitle,
  latestUserMessage,
  isCameraOn,
  onToggleCamera,
  micVolume,
  onOpenWhiteboard,
  onPracticeRepeat,
  isPaused,
  onResume,
}) => {
  const persona = VOICE_PERSONAS[voiceGender];
  const [imageLoaded, setImageLoaded] = useState(true);

  const hasMistakeInLatest =
    latestUserMessage?.correction && latestUserMessage.correction.hasMistake;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 select-none">
      {/* Background Studio Lighting & Dynamic Aura */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          isPaused
            ? 'bg-slate-950 opacity-90'
            : isSpeaking
            ? voiceGender === 'female'
              ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-900/25 via-slate-950/80 to-slate-950 opacity-100'
              : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/25 via-slate-950/80 to-slate-950 opacity-100'
            : isListening
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/30 via-slate-950/80 to-slate-950 opacity-100'
            : isProcessing
            ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/80 to-slate-950 opacity-100'
            : 'bg-slate-950 opacity-40'
        }`}
      />

      {/* Main Tutor Frame */}
      <div className="relative w-full max-w-5xl h-full flex flex-col justify-between p-4 sm:p-6 z-10">
        {/* Top Status HUD in Video Call */}
        <div className="flex items-center justify-between gap-3 w-full backdrop-blur-md bg-slate-950/40 p-3 sm:p-4 rounded-2xl border border-white/5 shadow-xl">
          {/* Left: Tutor info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPaused
                    ? 'bg-amber-400'
                    : isSpeaking
                    ? 'bg-emerald-400 animate-ping'
                    : isListening
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-emerald-500'
                }`}
              />
              <div className={`absolute inset-0 w-3 h-3 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight m-0">
                  {persona.name}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-semibold text-indigo-300">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  {persona.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{persona.country}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{persona.title}</span>
              </p>
            </div>
          </div>

          {/* Right: Call Quality & Status */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-medium">
              <Radio className={`w-3 h-3 ${isPaused ? 'text-amber-400' : 'text-emerald-400 animate-pulse'}`} />
              <span>Studio HD Audio</span>
            </div>

            {/* Active speaking state chip */}
            <div
              className={`px-3 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                isPaused
                  ? 'bg-amber-950/70 border-amber-600/80 text-amber-200 shadow-amber-900/30'
                  : isSpeaking
                  ? 'bg-pink-950/70 border-pink-700/80 text-pink-200 shadow-pink-900/30'
                  : isListening
                  ? 'bg-emerald-950/70 border-emerald-700/80 text-emerald-200 shadow-emerald-900/30 animate-pulse'
                  : isProcessing
                  ? 'bg-amber-950/70 border-amber-700/80 text-amber-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400'
              }`}
            >
              {isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Session Paused</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                  <span>Speaking</span>
                </>
              ) : isListening ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>Listening</span>
                </>
              ) : isProcessing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Reviewing</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Connected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Realistic Tutor Portrait with Audio Wave Aura */}
        <div className="relative flex-1 flex items-center justify-center py-4 my-auto">
          {/* Animated acoustic soundwave aura around portrait */}
          <div
            className={`absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] rounded-full pointer-events-none transition-all duration-500 blur-2xl ${
              isPaused
                ? 'opacity-0 scale-90'
                : isSpeaking
                ? voiceGender === 'female'
                  ? 'bg-pink-500/25 scale-110 animate-pulse'
                  : 'bg-blue-500/25 scale-110 animate-pulse'
                : isListening
                ? 'bg-emerald-500/20 scale-105'
                : 'bg-indigo-500/10 scale-95'
            }`}
          />

          {/* Portrait Container */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 border-2 ${
              isPaused
                ? 'border-amber-500/50 shadow-amber-950/40'
                : isSpeaking
                ? voiceGender === 'female'
                  ? 'border-pink-500/80 ring-4 ring-pink-500/20 shadow-pink-900/40'
                  : 'border-blue-500/80 ring-4 ring-blue-500/20 shadow-blue-900/40'
                : isListening
                ? 'border-emerald-500/80 ring-4 ring-emerald-500/20 shadow-emerald-900/40'
                : 'border-slate-800 shadow-black/80'
            }`}
            style={{
              maxHeight: 'min(56vh, 480px)',
              aspectRatio: '1 / 1',
            }}
          >
            {imageLoaded ? (
              <img
                src={persona.avatarImage}
                alt={persona.name}
                onError={() => setImageLoaded(false)}
                className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                  isPaused ? 'brightness-75 saturate-75' : isSpeaking ? 'scale-[1.02]' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-6xl">
                {persona.avatar}
              </div>
            )}

            {/* Subtle Gradient Vignette over portrait */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

            {/* Paused Overlay Screen on Tutor Feed */}
            {isPaused && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in z-10">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20 animate-pulse">
                  <Pause className="w-7 h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-white mb-1">
                  Speaking Session Paused
                </h3>
                <p className="text-xs text-slate-300 max-w-xs mb-4 leading-relaxed">
                  Take your time to catch your breath, review whiteboard notes, or think about your next sentence.
                </p>
                <button
                  onClick={onResume}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-amber-600/30 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Conversation</span>
                </button>
              </div>
            )}

            {/* Bottom info tag over portrait */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span>{persona.name}</span>
              </span>

              {/* Animated Equalizer Wave Bars on the tutor's feed */}
              <div className="flex items-center gap-1 h-3.5">
                <span
                  className={`w-1 rounded-full ${
                    isPaused ? 'bg-slate-600 h-1.5' : voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
                  } ${!isPaused && isSpeaking ? 'animate-soundwave-1' : 'h-1.5 opacity-40'}`}
                />
                <span
                  className={`w-1 rounded-full ${
                    isPaused ? 'bg-slate-600 h-2' : voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
                  } ${!isPaused && isSpeaking ? 'animate-soundwave-2' : 'h-2.5 opacity-40'}`}
                />
                <span
                  className={`w-1 rounded-full ${
                    isPaused ? 'bg-slate-600 h-2' : voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
                  } ${!isPaused && isSpeaking ? 'animate-soundwave-3' : 'h-3 opacity-40'}`}
                />
                <span
                  className={`w-1 rounded-full ${
                    isPaused ? 'bg-slate-600 h-1.5' : voiceGender === 'female' ? 'bg-pink-400' : 'bg-blue-400'
                  } ${!isPaused && isSpeaking ? 'animate-soundwave-4' : 'h-2 opacity-40'}`}
                />
              </div>
            </div>
          </div>

          {/* Student's PiP Webcam in Top-Right Corner */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
            <UserWebcam
              isCameraOn={isCameraOn}
              onToggleCamera={onToggleCamera}
              isMicActive={!isPaused && isListening}
              micVolume={isPaused ? 0 : micVolume}
            />
          </div>
        </div>

        {/* Bottom Floating Subtitles / Live Closed Captions */}
        <div className="w-full flex flex-col items-center gap-2 mb-2">
          {/* Real-time Subtitle Card */}
          <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-center relative group transition-all animate-fade-in">
            {/* Live speaker label */}
            <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400 border-b border-slate-800/80 pb-1.5 px-1">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Radio className={`w-3 h-3 ${isPaused ? 'text-amber-400' : 'text-indigo-400 animate-pulse'}`} />
                <span>
                  {isPaused
                    ? 'Lesson Paused'
                    : isSpeaking
                    ? `${persona.name} (Tutor)`
                    : isListening
                    ? 'You (Speaking now...)'
                    : 'Live Subtitles'}
                </span>
              </span>

              {hasMistakeInLatest && (
                <button
                  onClick={onOpenWhiteboard}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Grammar Note Available</span>
                </button>
              )}
            </div>

            {/* Current Spoken Subtitle Text */}
            <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed min-h-[1.5rem]">
              {isPaused ? (
                <span className="text-amber-300/90 font-medium text-xs sm:text-sm">
                  ⏸️ Session is paused. Tap "Resume Conversation" or the play button when you're ready to speak!
                </span>
              ) : currentSubtitle ? (
                currentSubtitle
              ) : (
                <span className="text-slate-500 italic text-xs">
                  {isListening
                    ? 'Listening... say anything in English!'
                    : 'Tap the microphone below to speak with your partner.'}
                </span>
              )}
            </p>

            {/* If user made a mistake, show quick feedback pill right inside the subtitle frame */}
            {!isPaused && hasMistakeInLatest && latestUserMessage?.correction && (
              <div className="mt-2.5 pt-2 border-t border-rose-900/40 flex flex-wrap items-center justify-between gap-2 text-xs bg-rose-950/30 rounded-xl p-2 px-3">
                <div className="flex items-center gap-2 text-left">
                  <span className="text-rose-400 font-semibold line-through">
                    "{latestUserMessage.correction.originalText}"
                  </span>
                  <span className="text-slate-500">➔</span>
                  <span className="text-emerald-300 font-bold">
                    "{latestUserMessage.correction.correctedText}"
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onPracticeRepeat(
                        latestUserMessage.correction!.correctedText,
                        latestUserMessage.correction!.pronunciationTip
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition-all"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Practice</span>
                  </button>

                  <button
                    onClick={onOpenWhiteboard}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-all"
                  >
                    <FileText className="w-3 h-3 text-indigo-400" />
                    <span>Notes</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
