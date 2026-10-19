export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export type VoiceGender = 'girl' | 'boy' | 'female' | 'male';

export type MistakeType = 'grammar' | 'pronunciation' | 'vocabulary' | 'sentence_structure' | 'none';

export interface CorrectionDetail {
  hasMistake: boolean;
  originalText: string;
  correctedText: string;
  mistakeType: MistakeType;
  mistakeExplanation: string;
  betterAlternative: string;
  pronunciationTip?: string;
  fluencyScore: number; // 0 to 100
  highlightedMistakes?: {
    word: string;
    correction: string;
    reason: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: number;
  correction?: CorrectionDetail;
  audioPlayed?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: ProficiencyLevel;
  systemPrompt: string;
  initialMessage: string;
}

export interface VoicePersona {
  gender: VoiceGender;
  name: string;
  title: string;
  avatar: string;
  avatarImage: string;
  description: string;
  preferredVoiceNames: string[];
  pitch: number;
  rate: number;
  badge: string;
  country: string;
}

export interface UserStats {
  totalSentences: number;
  mistakesCorrected: number;
  averageFluency: number;
  streakCount: number;
  sessionMinutes: number;
}

// User Profile for Google Registration & Login
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  provider: 'google';
  createdAt: number;
  lastLogin: number;
  totalPracticeMinutes: number;
  totalSessions: number;
  proficiencyLevel: ProficiencyLevel;
}

// Diagnostic Weakness Item for "Where Need to Improve"
export interface WeakSpotItem {
  id: string;
  category: 'grammar' | 'pronunciation' | 'vocabulary' | 'fluency';
  title: string;
  errorCount: number;
  masteryPercentage: number; // 0 to 100 (lower means needs more practice)
  explanation: string;
  exampleMistake: string;
  exampleCorrection: string;
  ruleTip: string;
  drillSentence: string;
  pronunciationTip?: string;
}

export interface ImprovementAnalytics {
  overallMastery: number; // 0 to 100
  grammarMastery: number;
  pronunciationMastery: number;
  vocabularyMastery: number;
  totalMistakesRecorded: number;
  weakSpots: WeakSpotItem[];
  priorityRecommendation: string;
}
