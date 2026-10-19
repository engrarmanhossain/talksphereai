import { useState, useEffect, useRef } from 'react';
import type {
  ChatMessage,
  ProficiencyLevel,
  VoiceGender,
  Scenario,
  UserStats,
  UserProfile,
} from './types';
import { SCENARIOS } from './services/scenarios';
import { speechService } from './services/speechService';
import { AIService } from './services/aiService';
import { soundEffects } from './services/soundEffects';
import { AudioAnalyser } from './services/audioAnalyser';
import { authService } from './services/authService';
import { ImprovementService } from './services/improvementService';
import { CallHeader } from './components/CallHeader';
import { TutorVideoStage } from './components/TutorVideoStage';
import { LessonWhiteboard } from './components/LessonWhiteboard';
import { CallHUD } from './components/CallHUD';
import { PracticeModal } from './components/PracticeModal';
import { ScenarioModal } from './components/ScenarioModal';
import { StatsDrawer } from './components/StatsDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AuthModal } from './components/AuthModal';
import { ImprovementDashboardModal } from './components/ImprovementDashboardModal';

const STATS_STORAGE_KEY = 'talksphere_user_stats';

export function App() {
  // Google User Authentication
  const [user, setUser] = useState<UserProfile | null>(() => authService.getActiveUser());

  // Config & Persona (Default to Baby Girl Lily)
  const [currentLevel, setCurrentLevel] = useState<ProficiencyLevel>('beginner');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('girl');
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Pause / Resume Conversation State
  const [isPaused, setIsPaused] = useState(false);

  // Student video & audio
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const audioAnalyserRef = useRef<AudioAnalyser | null>(null);

  // Audio / Speech State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  // Conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const activeRecognizerRef = useRef<any>(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isImprovementModalOpen, setIsImprovementModalOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [practiceData, setPracticeData] = useState<{
    isOpen: boolean;
    targetSentence: string;
    pronunciationTip?: string;
  }>({
    isOpen: false,
    targetSentence: '',
  });

  // User Stats
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      totalSentences: 0,
      mistakesCorrected: 0,
      averageFluency: 92,
      streakCount: 0,
      sessionMinutes: 0,
    };
  });

  // Listen to auth changes and restore user data
  useEffect(() => {
    const unsub = authService.subscribe((activeUser) => {
      setUser(activeUser);
      if (activeUser) {
        const persisted = authService.getUserData(activeUser.id);
        if (persisted) {
          if (persisted.stats) setStats(persisted.stats);
          if (persisted.messages && persisted.messages.length > 0) {
            setMessages(persisted.messages);
            const lastMsg = persisted.messages[persisted.messages.length - 1];
            setCurrentSubtitle(lastMsg.text);
          }
        }
      }
    });
    return unsub;
  }, []);

  // Save stats & user data on change
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
      if (user) {
        authService.saveUserData(user.id, { stats, messages });
      }
    } catch {}
  }, [stats, messages, user]);

  // Check if API key is stored
  useEffect(() => {
    setHasApiKey(Boolean(AIService.getApiKey()));
  }, []);

  // Update sound effects enabled
  useEffect(() => {
    soundEffects.isEnabled = soundEffectsEnabled;
  }, [soundEffectsEnabled]);

  // Start initial greeting when scenario or tutor changes
  useEffect(() => {
    soundEffects.playCallConnect();

    // If messages are empty or reset, load initial greeting
    if (messages.length === 0 || messages[0]?.id?.startsWith('ai-init-')) {
      const greetingMsg: ChatMessage = {
        id: `ai-init-${Date.now()}`,
        sender: 'ai',
        text: currentScenario.initialMessage,
        timestamp: Date.now(),
      };
      setMessages([greetingMsg]);
      setCurrentSubtitle(greetingMsg.text);

      const timer = setTimeout(() => {
        handleSpeakAiMessage(greetingMsg.text);
      }, 450);

      return () => {
        clearTimeout(timer);
        speechService.stopSpeaking();
      };
    }
  }, [currentScenario, voiceGender]);

  // Speak AI Message
  const handleSpeakAiMessage = (text: string) => {
    if (isPaused) return;
    setCurrentSubtitle(text);
    speechService.speak(
      text,
      voiceGender,
      speechRate,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
      },
      (err) => {
        console.warn('Speech playback issue:', err);
        setIsSpeaking(false);
      }
    );
  };

  const handleStopSpeaking = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  };

  // Toggle Pause / Resume
  const handleTogglePause = () => {
    if (!isPaused) {
      // Pausing
      handleStopSpeaking();
      if (isListening) {
        if (activeRecognizerRef.current) {
          try {
            activeRecognizerRef.current.stop();
          } catch {}
        }
        setIsListening(false);
      }
      if (audioAnalyserRef.current) {
        audioAnalyserRef.current.stop();
      }
      soundEffects.playPauseChime(true);
      setIsPaused(true);
    } else {
      // Resuming
      soundEffects.playPauseChime(false);
      setIsPaused(false);
    }
  };

  // Toggle Microphone Listening
  const handleToggleListening = async () => {
    // If paused, unpause first
    if (isPaused) {
      handleTogglePause();
      return;
    }

    if (isListening) {
      if (activeRecognizerRef.current) {
        try {
          activeRecognizerRef.current.stop();
        } catch {}
      }
      if (audioAnalyserRef.current) {
        audioAnalyserRef.current.stop();
      }
      setIsListening(false);
      soundEffects.playMicClick(false);
      return;
    }

    if (isSpeaking) {
      handleStopSpeaking();
    }

    soundEffects.playMicClick(true);
    setCurrentSubtitle('Listening to your voice...');

    // Start real-time audio volume analyzer
    if (!audioAnalyserRef.current) {
      audioAnalyserRef.current = new AudioAnalyser();
    }
    await audioAnalyserRef.current.start((vol) => {
      setMicVolume(vol);
    });

    const recognizer = speechService.createRecognizer({
      onStart: () => {
        setIsListening(true);
      },
      onResult: (transcript, isFinal) => {
        setCurrentSubtitle(transcript);
        if (isFinal) {
          setIsListening(false);
          if (audioAnalyserRef.current) {
            audioAnalyserRef.current.stop();
          }
          handleUserSubmit(transcript);
        }
      },
      onError: (err) => {
        console.warn('Speech recognition notice:', err);
        setIsListening(false);
        if (audioAnalyserRef.current) {
          audioAnalyserRef.current.stop();
        }
      },
      onEnd: () => {
        setIsListening(false);
        if (audioAnalyserRef.current) {
          audioAnalyserRef.current.stop();
        }
      },
    });

    if (recognizer) {
      activeRecognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e: any) {
        setIsListening(false);
        if (audioAnalyserRef.current) {
          audioAnalyserRef.current.stop();
        }
      }
    }
  };

  // Process user sentence (speech or text)
  const handleUserSubmit = async (userText: string) => {
    if (!userText.trim() || isProcessing || isPaused) return;

    setIsProcessing(true);
    const userMsgId = `user-${Date.now()}`;
    const initialUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, initialUserMsg]);
    setCurrentSubtitle(`"${userText}"`);

    try {
      const aiResult = await AIService.analyzeAndRespond(
        userText,
        messages.map((m) => ({ sender: m.sender, text: m.text })),
        currentScenario,
        currentLevel
      );

      // Update user message with the correction breakdown
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId ? { ...msg, correction: aiResult.correction } : msg
        )
      );

      // Sound notification if mistake was detected
      if (aiResult.correction.hasMistake) {
        soundEffects.playCorrectionNotification();
      } else {
        soundEffects.playSuccessChime();
      }

      // Update user statistics
      setStats((prev) => {
        const newTotal = prev.totalSentences + 1;
        const newMistakes = prev.mistakesCorrected + (aiResult.correction.hasMistake ? 1 : 0);
        const newAverage = Math.round(
          (prev.averageFluency * prev.totalSentences + aiResult.correction.fluencyScore) / newTotal
        );
        const newStreak = aiResult.correction.hasMistake ? 1 : prev.streakCount + 1;

        return {
          totalSentences: newTotal,
          mistakesCorrected: newMistakes,
          averageFluency: newAverage,
          streakCount: newStreak,
          sessionMinutes: prev.sessionMinutes,
        };
      });

      // Append AI response message
      const aiMsgId = `ai-${Date.now()}`;
      const newAiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: aiResult.replyText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newAiMsg]);

      // Speak response aloud automatically if not paused
      if (!isPaused) {
        handleSpeakAiMessage(aiResult.replyText);
      }
    } catch (err: any) {
      console.error('Error in conversation turnaround:', err);
      setCurrentSubtitle('Sorry, I had trouble processing that. Could you say it again?');
    } finally {
      setIsProcessing(false);
    }
  };

  // Find latest user message
  const userMessages = messages.filter((m) => m.sender === 'user');
  const latestUserMessage = userMessages[userMessages.length - 1] || null;

  // Real-time "Where Need to Improve" analytics data
  const improvementAnalytics = ImprovementService.analyzeHistory(messages);

  // Cycle speech rate (0.8x -> 1.0x -> 1.2x)
  const handleCycleSpeechRate = () => {
    setSpeechRate((prev) => (prev === 0.8 ? 1.0 : prev === 1.0 ? 1.2 : 0.8));
  };

  // Reset conversation
  const handleResetCall = () => {
    handleStopSpeaking();
    soundEffects.playCallConnect();
    const greetingMsg: ChatMessage = {
      id: `ai-init-${Date.now()}`,
      sender: 'ai',
      text: currentScenario.initialMessage,
      timestamp: Date.now(),
    };
    setMessages([greetingMsg]);
    setCurrentSubtitle(greetingMsg.text);
    setIsPaused(false);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Video Call Header */}
      <CallHeader
        currentLevel={currentLevel}
        onLevelChange={(lvl) => {
          handleStopSpeaking();
          setCurrentLevel(lvl);
          const match = SCENARIOS.find((s) => s.level === lvl) || SCENARIOS[0];
          setCurrentScenario(match);
        }}
        currentScenario={currentScenario}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        hasApiKey={hasApiKey}
        totalSentences={stats.totalSentences}
        averageFluency={stats.averageFluency}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenImprovementDashboard={() => setIsImprovementModalOpen(true)}
        onLogout={() => {
          authService.logout();
          setUser(null);
        }}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Main Video Call Stage */}
      <main className="w-full h-full pt-16 pb-24 flex items-center justify-center">
        <TutorVideoStage
          voiceGender={voiceGender}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isProcessing={isProcessing}
          currentSubtitle={currentSubtitle}
          latestUserMessage={latestUserMessage}
          isCameraOn={isCameraOn}
          onToggleCamera={() => setIsCameraOn((prev) => !prev)}
          micVolume={micVolume}
          onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
          onPracticeRepeat={(targetSentence, pronunciationTip) =>
            setPracticeData({ isOpen: true, targetSentence, pronunciationTip })
          }
          isPaused={isPaused}
          onResume={() => handleTogglePause()}
        />
      </main>

      {/* Bottom Floating Call HUD Controls */}
      <CallHUD
        isListening={isListening}
        onToggleListening={handleToggleListening}
        isCameraOn={isCameraOn}
        onToggleCamera={() => setIsCameraOn((prev) => !prev)}
        voiceGender={voiceGender}
        onVoiceGenderToggle={() => {
          handleStopSpeaking();
          const order: VoiceGender[] = ['girl', 'boy', 'female', 'male'];
          setVoiceGender((prev) => {
            const nextIdx = (order.indexOf(prev) + 1) % order.length;
            return order[nextIdx];
          });
        }}
        onOpenWhiteboard={() => setIsWhiteboardOpen((prev) => !prev)}
        whiteboardNotesCount={
          messages.filter((m) => m.sender === 'user' && m.correction?.hasMistake).length
        }
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        onResetCall={handleResetCall}
        onSendMessage={handleUserSubmit}
        isProcessing={isProcessing}
        soundEffectsEnabled={soundEffectsEnabled}
        onToggleSoundEffects={() => setSoundEffectsEnabled((prev) => !prev)}
        speechRate={speechRate}
        onCycleSpeechRate={handleCycleSpeechRate}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Slide-out Lesson Whiteboard */}
      <LessonWhiteboard
        isOpen={isWhiteboardOpen}
        onClose={() => setIsWhiteboardOpen(false)}
        messages={messages}
        voiceGender={voiceGender}
        onPracticeRepeat={(targetSentence, pronunciationTip) =>
          setPracticeData({ isOpen: true, targetSentence, pronunciationTip })
        }
      />

      {/* "Where Need to Improve" Diagnostic Dashboard Modal */}
      <ImprovementDashboardModal
        isOpen={isImprovementModalOpen}
        onClose={() => setIsImprovementModalOpen(false)}
        analytics={improvementAnalytics}
        user={user}
        onDrillWeakness={(sentence, pronunciationTip) =>
          setPracticeData({
            isOpen: true,
            targetSentence: sentence,
            pronunciationTip,
          })
        }
      />

      {/* Google Sign In & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Pronunciation & Repetition Drill Modal */}
      <PracticeModal
        isOpen={practiceData.isOpen}
        onClose={() => setPracticeData((prev) => ({ ...prev, isOpen: false }))}
        targetSentence={practiceData.targetSentence}
        pronunciationTip={practiceData.pronunciationTip}
        voiceGender={voiceGender}
      />

      {/* Scenarios & Roleplays Modal */}
      <ScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        currentScenario={currentScenario}
        onSelectScenario={(s) => {
          handleStopSpeaking();
          setCurrentScenario(s);
        }}
        currentLevel={currentLevel}
        onLevelChange={(lvl) => {
          handleStopSpeaking();
          setCurrentLevel(lvl);
        }}
      />

      {/* Fluency Performance Stats */}
      <StatsDrawer
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        messages={messages}
        onPracticeRepeat={(targetSentence, pronunciationTip) =>
          setPracticeData({ isOpen: true, targetSentence, pronunciationTip })
        }
      />

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onApiKeySaved={() => setHasApiKey(Boolean(AIService.getApiKey()))}
      />
    </div>
  );
}

export default App;
