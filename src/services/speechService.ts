import type { VoiceGender, VoicePersona } from '../types';

export const VOICE_PERSONAS: Record<VoiceGender, VoicePersona> = {
  girl: {
    gender: 'girl',
    name: 'Lily',
    title: 'Playful & Friendly Speaking Pal',
    avatar: '👧',
    avatarImage: '/avatars/lily.jpg',
    description: 'Sweet, natural, and cheerful little girl voice • Patient and easy to understand',
    badge: 'Junior Speaking Buddy',
    country: '👧 London, UK',
    preferredVoiceNames: [
      'Microsoft Ana Online (Natural) - English (United States)',
      'Ana',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Google US English',
      'Samantha',
      'Victoria',
    ],
    pitch: 1.55,
    rate: 0.98,
  },
  boy: {
    gender: 'boy',
    name: 'Leo',
    title: 'Energetic & Curious Speaking Buddy',
    avatar: '👦',
    avatarImage: '/avatars/leo.jpg',
    description: 'Bright, cheerful, and lively little boy voice • Fun and encouraging partner',
    badge: 'Junior Speaking Buddy',
    country: '👦 New York, USA',
    preferredVoiceNames: [
      'Microsoft Christopher Online (Natural) - English (United States)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Google US English',
      'Alex',
      'Daniel',
    ],
    pitch: 1.38,
    rate: 1.02,
  },
  female: {
    gender: 'female',
    name: 'Emma Watson-Smith',
    title: 'Senior English Language Coach',
    avatar: '👩‍🏫',
    avatarImage: '/avatars/emma.jpg',
    description: 'Oxford Certified • Patient, gentle, and crystal-clear pronunciation',
    badge: 'Senior Linguist & Tutor',
    country: '🇬🇧 Oxford, UK',
    preferredVoiceNames: [
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Aria Online (Natural) - English (United States)',
      'Google US English',
      'Samantha',
      'Victoria',
      'Karen',
      'Microsoft Zira - English (United States)',
      'Microsoft Susan',
    ],
    pitch: 1.05,
    rate: 1.0,
  },
  male: {
    gender: 'male',
    name: 'Alex Harrison',
    title: 'Executive Communication Coach',
    avatar: '👨‍🏫',
    avatarImage: '/avatars/alex.jpg',
    description: 'Cambridge Accredited • Calm, conversational, and natural cadence',
    badge: 'Fluency & Accent Specialist',
    country: '🇺🇸 Boston, USA',
    preferredVoiceNames: [
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft David - English (United States)',
      'Microsoft Mark - English (United States)',
      'Alex',
      'Daniel',
      'Google UK English Male',
      'Microsoft George - English (United Kingdom)',
    ],
    pitch: 0.92,
    rate: 1.0,
  },
};

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  public isRecognitionSupported: boolean = false;
  public isSynthesisSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.isSynthesisSupported = true;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      // Check Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.isRecognitionSupported = true;
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices().filter((v) => v.lang.startsWith('en'));
    // If no english voices, load all
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  public findBestVoice(gender: VoiceGender): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    const persona = VOICE_PERSONAS[gender];

    // 1. Try preferred voice names
    for (const name of persona.preferredVoiceNames) {
      const match = voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
      if (match) return match;
    }

    // 2. Try heuristic name matching
    if (gender === 'girl' || gender === 'female') {
      const femaleKeywords = gender === 'girl' 
        ? ['ana', 'child', 'kid', 'girl', 'junior', 'jenny', 'samantha', 'aria', 'zira', 'victoria']
        : ['female', 'woman', 'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'susan', 'linda'];
      const match = voices.find((v) =>
        femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
      );
      if (match) return match;
    } else {
      const maleKeywords = gender === 'boy'
        ? ['christopher', 'junior', 'boy', 'kid', 'guy', 'alex', 'daniel', 'david', 'mark']
        : ['male', 'man', 'david', 'guy', 'mark', 'alex', 'daniel', 'george', 'richard'];
      const match = voices.find((v) =>
        maleKeywords.some((k) => v.name.toLowerCase().includes(k))
      );
      if (match) return match;
    }

    // 3. Fallback to any English voice
    const englishVoice = voices.find((v) => v.lang.startsWith('en'));
    return englishVoice || voices[0] || null;
  }

  public speak(
    text: string,
    gender: VoiceGender,
    speedMultiplier: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): void {
    if (!this.synth) {
      onError?.(new Error('Speech Synthesis not supported in this browser.'));
      return;
    }

    // Stop ongoing speech
    this.synth.cancel();

    // Clean text of markdown asterisks/brackets for clean speech
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\(.*?\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const persona = VOICE_PERSONAS[gender];
    const voice = this.findBestVoice(gender);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate * speedMultiplier;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      onError?.(e);
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public createRecognizer(callbacks: {
    onResult: (transcript: string, isFinal: boolean) => void;
    onError: (error: string) => void;
    onStart?: () => void;
    onEnd?: () => void;
  }) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      callbacks.onError('Web Speech Recognition API is not supported in this browser. Please use Chrome, Edge, or Brave.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Turn-based conversation
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      callbacks.onStart?.();
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        callbacks.onResult(finalTranscript.trim(), true);
      } else if (interimTranscript.trim()) {
        callbacks.onResult(interimTranscript.trim(), false);
      }
    };

    recognition.onerror = (event: any) => {
      let msg = event.error;
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech detected. Please speak clearly into your microphone.';
      }
      callbacks.onError(msg);
    };

    recognition.onend = () => {
      callbacks.onEnd?.();
    };

    return recognition;
  }
}

export const speechService = new SpeechService();
