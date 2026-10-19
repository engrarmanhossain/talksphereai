import type { CorrectionDetail, ProficiencyLevel, Scenario, MistakeType } from '../types';

interface AIResponse {
  replyText: string;
  correction: CorrectionDetail;
}

// Built-in offline linguistic rules and corrections for instantaneous, offline feedback
const COMMON_GRAMMAR_PATTERNS: {
  regex: RegExp;
  fix: (match: RegExpMatchArray, text: string) => string;
  type: MistakeType;
  explanation: string;
  alternative: string;
  pronunciationTip?: string;
  scorePenalty: number;
}[] = [
  {
    regex: /\b(i|he|she|it|they|we)\s+am\s+agree\b/i,
    fix: (_m, text) => text.replace(/\bam\s+agree\b/gi, 'agree'),
    type: 'grammar',
    explanation: '"Agree" is a verb in English, not an adjective. Say "I agree" instead of "I am agree".',
    alternative: 'I completely agree with you.',
    pronunciationTip: 'Say "uh-GREE" /əˈɡriː/ with the stress on the second syllable.',
    scorePenalty: 25,
  },
  {
    regex: /\b(he|she|it)\s+(don't|dont)\b/i,
    fix: (m, text) => text.replace(new RegExp(m[0], 'gi'), `${m[1]} doesn't`),
    type: 'grammar',
    explanation: 'Third-person singular subjects (he, she, it) take "does not" or "doesn\'t", not "don\'t".',
    alternative: "He/she doesn't think so.",
    pronunciationTip: '"Doesn\'t" is pronounced "DUH-znt" /ˈdʌz.ənt/.',
    scorePenalty: 20,
  },
  {
    regex: /\b(i|you|we|they)\s+(doesn't|doesnt)\b/i,
    fix: (m, text) => text.replace(new RegExp(m[0], 'gi'), `${m[1]} don't`),
    type: 'grammar',
    explanation: 'Plural and first/second person subjects take "don\'t", not "doesn\'t".',
    alternative: "I really don't know.",
    scorePenalty: 20,
  },
  {
    regex: /\bi\s+have\s+(\d+)\s+years?\s+old\b/i,
    fix: (m, text) => text.replace(new RegExp(m[0], 'gi'), `I am ${m[1]} years old`),
    type: 'grammar',
    explanation: 'In English, we use the verb "to be" to express age, not "have". Say "I am [age] years old".',
    alternative: 'I am in my twenties / I am 24 years old.',
    scorePenalty: 30,
  },
  {
    regex: /\b(yesterday|last\s+(?:week|month|year|night|sunday))\b.*\b(go|see|come|buy|take|make|eat)\b/i,
    fix: (_m, text) => {
      return text
        .replace(/\bgo\b/gi, 'went')
        .replace(/\bsee\b/gi, 'saw')
        .replace(/\bcome\b/gi, 'came')
        .replace(/\bbuy\b/gi, 'bought')
        .replace(/\btake\b/gi, 'took')
        .replace(/\bmake\b/gi, 'made')
        .replace(/\beat\b/gi, 'ate');
    },
    type: 'grammar',
    explanation: 'When talking about past time markers (yesterday, last week), remember to use the simple past tense form of irregular verbs.',
    alternative: 'Yesterday I went there and had a wonderful time.',
    scorePenalty: 25,
  },
  {
    regex: /\bexplain\s+me\b/i,
    fix: (_m, text) => text.replace(/\bexplain\s+me\b/gi, 'explain to me'),
    type: 'grammar',
    explanation: '"Explain" requires the preposition "to" before the indirect object: "explain to me" or "explain it to me".',
    alternative: 'Could you explain that to me in more detail?',
    scorePenalty: 15,
  },
  {
    regex: /\bmore\s+(better|faster|easier|taller|cheaper|harder)\b/i,
    fix: (m, text) => text.replace(new RegExp(m[0], 'gi'), m[1]),
    type: 'grammar',
    explanation: 'Double comparatives are incorrect. Use either the "-er" suffix (better, faster) or "more", but not both.',
    alternative: 'This option is much better and far more convenient.',
    scorePenalty: 20,
  },
  {
    regex: /\bdepend\s+of\b/i,
    fix: (_m, text) => text.replace(/\bdepend\s+of\b/gi, 'depend on'),
    type: 'vocabulary',
    explanation: 'The correct dependent preposition for "depend" is "on" (or "upon"), not "of".',
    alternative: 'It depends on the circumstances.',
    scorePenalty: 15,
  },
  {
    regex: /\bmake\s+a\s+photo\b/i,
    fix: (_m, text) => text.replace(/\bmake\s+a\s+photo\b/gi, 'take a photo'),
    type: 'vocabulary',
    explanation: 'In English collocation, we "take a photo" or "take a picture", we don\'t "make a photo".',
    alternative: "Let's take a picture together!",
    scorePenalty: 15,
  },
  {
    regex: /\bdo\s+a\s+mistake\b/i,
    fix: (_m, text) => text.replace(/\bdo\s+a\s+mistake\b/gi, 'make a mistake'),
    type: 'vocabulary',
    explanation: 'The natural collocation is "make a mistake", not "do a mistake".',
    alternative: 'I made a slight mistake in my calculation.',
    scorePenalty: 15,
  },
  {
    regex: /\b(too\s+much|very)\s+peoples\b/i,
    fix: (_m, text) => text.replace(/\bpeoples\b/gi, 'people').replace(/\btoo\s+much\s+people\b/gi, 'too many people'),
    type: 'grammar',
    explanation: '"People" is already the plural of "person" (uncountable in this context). Use "too many people", not "too much people" or "peoples".',
    alternative: 'There are so many people here today.',
    scorePenalty: 20,
  },
  {
    regex: /\bi\s+am\s+living\s+here\s+since\b/i,
    fix: (_m, text) => text.replace(/\bi\s+am\s+living\s+here\s+since\b/gi, 'I have been living here since'),
    type: 'grammar',
    explanation: 'Actions that started in the past and continue into the present require Present Perfect Continuous: "I have been living here since...".',
    alternative: 'I have been living in this city for three years.',
    scorePenalty: 25,
  },
  {
    regex: /\b(comfortable|pronunciation|restaurant|vegetable|wednesday|climb|doubt|island)\b/i,
    fix: (_m, text) => text,
    type: 'pronunciation',
    explanation: 'Be mindful of silent letters or syllable reductions in these words.',
    alternative: 'Practice clear syllable stress and reduction.',
    pronunciationTip: 'Common pitfall: "Comfortable" has 3 syllables: /KUMF-ter-bul/. "Pronunciation" is /pro-NUN-see-AY-shun/ (not "pro-NOUN-ciation").',
    scorePenalty: 5,
  },
];

// Offline fallback conversational responses by level & scenario
function generateOfflineReply(
  userText: string,
  scenario: Scenario,
  level: ProficiencyLevel
): string {
  const lower = userText.toLowerCase();

  // Beginner responses
  if (level === 'beginner') {
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hello! I am very happy to talk with you. What did you do today?";
    }
    if (lower.includes('name') || lower.includes('i am') || lower.includes("i'm")) {
      return "Nice to meet you! You did a great job introducing yourself. What is your favorite hobby?";
    }
    if (lower.includes('coffee') || lower.includes('latte') || lower.includes('tea')) {
      return "Sounds delicious! Would you like that hot or iced? And would you like any milk with that?";
    }
    if (lower.includes('yes') || lower.includes('yeah') || lower.includes('sure')) {
      return "That sounds wonderful! Can you tell me a little bit more about that in one or two sentences?";
    }
    if (lower.includes('no') || lower.includes('not really')) {
      return "I understand! No problem at all. What would you prefer to talk about instead?";
    }
    return `That's very interesting! Keep speaking—you're expressing yourself clearly. Can you tell me what you like most about that?`;
  }

  // Intermediate responses
  if (level === 'intermediate') {
    if (scenario.id === 'job_interview_intro') {
      return "That is a solid summary of your experience. Could you share an example of a challenging situation you encountered at work or study, and how you managed to resolve it?";
    }
    if (scenario.id === 'travel_airport') {
      return "Thank you. Your documents look in order. Do you have any check-in bags or just carry-on luggage for today's flight?";
    }
    if (scenario.id === 'weekend_storytelling') {
      return "That sounds like quite a memorable experience! How did you feel while that was happening, and what did you learn from it?";
    }
    return `You're expressing your thoughts with good detail. To take it further: what do you think is the biggest advantage of that approach?`;
  }

  // Advanced responses
  if (scenario.id === 'ielts_toefl_prep') {
    return "That's a well-reasoned perspective. However, some sociological researchers argue that online interaction lacks non-verbal cues that are vital for deep empathy. To what extent do you concede to this counterargument?";
  }
  if (scenario.id === 'business_negotiation') {
    return "I appreciate your rationale; nevertheless, our stakeholders require quantifiable guarantees on ROI within the second quarter. Could you outline what trade-offs you are willing to negotiate?";
  }
  return `An insightful viewpoint. How would you synthesize those considerations when weighing the long-term societal implications against the immediate practical benefits?`;
}

export class AIService {
  private static API_KEY_STORAGE = 'gemini_api_key';

  public static getApiKey(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(this.API_KEY_STORAGE) || '';
  }

  public static setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.API_KEY_STORAGE, key.trim());
    }
  }

  public static clearApiKey(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.API_KEY_STORAGE);
    }
  }

  public static async analyzeAndRespond(
    userText: string,
    history: { sender: 'user' | 'ai'; text: string }[],
    scenario: Scenario,
    level: ProficiencyLevel
  ): Promise<AIResponse> {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        return await this.callGeminiAPI(apiKey, userText, history, scenario, level);
      } catch (err) {
        console.warn('Gemini API call failed, using built-in intelligent engine:', err);
      }
    }

    // Use built-in offline smart evaluator
    return this.evaluateOffline(userText, scenario, level);
  }

  // Fast & accurate offline evaluation
  private static evaluateOffline(
    userText: string,
    scenario: Scenario,
    level: ProficiencyLevel
  ): AIResponse {
    let corrected = userText;
    let detectedRule: (typeof COMMON_GRAMMAR_PATTERNS)[0] | null = null;
    let score = 96;

    for (const rule of COMMON_GRAMMAR_PATTERNS) {
      const match = userText.match(rule.regex);
      if (match && rule.scorePenalty > 0) {
        detectedRule = rule;
        corrected = rule.fix(match, corrected);
        score = Math.max(50, score - rule.scorePenalty);
        break;
      }
    }

    // Punctuation & Capitalization check
    if (corrected.length > 0 && /^[a-z]/.test(corrected)) {
      corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    }
    if (corrected.length > 0 && !/[.?!]$/.test(corrected)) {
      corrected += '.';
    }

    const hasMistake = detectedRule !== null || corrected.trim() !== userText.trim();

    let pronunciationTip = '';
    // Pronunciation heuristics for common difficult phonemes
    if (/th/i.test(userText)) {
      pronunciationTip = 'Tip for "th": Place the tip of your tongue gently between your upper and lower teeth and blow softly (e.g. think /θɪŋk/, this /ðɪs/).';
    } else if (/[rv]/.test(userText.toLowerCase())) {
      pronunciationTip = 'Tip for "v" vs "w": For "v", touch your top teeth to your bottom lip. For "w", round your lips like an "oo" sound.';
    }

    const correction: CorrectionDetail = {
      hasMistake,
      originalText: userText,
      correctedText: hasMistake ? corrected : userText,
      mistakeType: detectedRule ? detectedRule.type : hasMistake ? 'grammar' : 'none',
      mistakeExplanation: detectedRule
        ? detectedRule.explanation
        : hasMistake
        ? 'Small punctuation or capitalization adjustment to make your sentence polished.'
        : 'Spot on! Your sentence is grammatically sound and clearly phrased.',
      betterAlternative: detectedRule?.alternative || (
        level === 'advanced'
          ? `More sophisticated: "${corrected.replace(/\bgood\b/gi, 'exceptional').replace(/\bbad\b/gi, 'detrimental')}"`
          : `Natural native phrasing: "${corrected}"`
      ),
      pronunciationTip: detectedRule?.pronunciationTip || pronunciationTip || 'Clear stress on key content words (nouns and main verbs) keeps your rhythm natural.',
      fluencyScore: hasMistake ? score : 98,
      highlightedMistakes: hasMistake && detectedRule
        ? [
            {
              word: userText.match(detectedRule.regex)?.[0] || 'word',
              correction: detectedRule.alternative,
              reason: detectedRule.explanation,
            },
          ]
        : [],
    };

    const replyText = generateOfflineReply(userText, scenario, level);

    return {
      replyText,
      correction,
    };
  }

  // Google Gemini LLM Integration
  private static async callGeminiAPI(
    apiKey: string,
    userText: string,
    history: { sender: 'user' | 'ai'; text: string }[],
    scenario: Scenario,
    level: ProficiencyLevel
  ): Promise<AIResponse> {
    const systemPrompt = `You are an elite AI English Speaking Partner and pronunciation/grammar coach.
Current student proficiency level: ${level.toUpperCase()}.
Current scenario: ${scenario.title} (${scenario.description}).
Scenario role instruction: ${scenario.systemPrompt}.

Your job is dual:
1. Provide a friendly, conversational, spoken response in character to keep the conversation flowing naturally. (Keep your response conversational, concise, and suitable for Text-to-Speech audio—around 1 to 3 sentences).
2. Deeply analyze the user's latest spoken sentence for ANY mistakes: grammar, pronunciation pitfalls, unnatural phrasing, wrong prepositions, or incorrect tenses.

You MUST respond strictly with a valid JSON object in this exact schema (no markdown fences, just pure JSON):
{
  "replyText": "your spoken conversational response",
  "hasMistake": boolean,
  "correctedText": "the fully corrected sentence",
  "mistakeType": "grammar" | "pronunciation" | "vocabulary" | "sentence_structure" | "none",
  "mistakeExplanation": "friendly, concise explanation of the error and why the correction works",
  "betterAlternative": "a native-speaker natural idiom or phrase",
  "pronunciationTip": "phonetic IPA transcription and mouth position advice for any tricky words in their sentence",
  "fluencyScore": number (between 40 and 100),
  "highlightedMistakes": [
    {
      "word": "mistaken word or phrase",
      "correction": "correct form",
      "reason": "short explanation"
    }
  ]
}`;

    const recentHistory = history.slice(-6).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Add current user input
    recentHistory.push({
      role: 'user',
      parts: [{ text: userText }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: recentHistory,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('No content returned from Gemini API');
    }

    const parsed = JSON.parse(candidateText);

    return {
      replyText: parsed.replyText || "That's very interesting! Could you tell me more?",
      correction: {
        hasMistake: Boolean(parsed.hasMistake),
        originalText: userText,
        correctedText: parsed.correctedText || userText,
        mistakeType: parsed.mistakeType || (parsed.hasMistake ? 'grammar' : 'none'),
        mistakeExplanation: parsed.mistakeExplanation || 'Good effort! Keep practicing.',
        betterAlternative: parsed.betterAlternative || parsed.correctedText || userText,
        pronunciationTip: parsed.pronunciationTip || 'Focus on speaking smoothly with steady pacing.',
        fluencyScore: typeof parsed.fluencyScore === 'number' ? parsed.fluencyScore : 90,
        highlightedMistakes: parsed.highlightedMistakes || [],
      },
    };
  }
}
