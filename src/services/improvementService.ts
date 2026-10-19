import type { ChatMessage, ImprovementAnalytics, WeakSpotItem } from '../types';

export class ImprovementService {
  // Analyze message history and extract actionable improvement diagnostics
  public static analyzeHistory(messages: ChatMessage[]): ImprovementAnalytics {
    const userMessages = messages.filter(
      (m) => m.sender === 'user' && m.correction
    );

    const mistakeMessages = userMessages.filter(
      (m) => m.correction && m.correction.hasMistake
    );

    // Default weakness catalog templates with pedagogical drills
    const catalog: Record<string, WeakSpotItem> = {
      irregular_past_tense: {
        id: 'irregular_past_tense',
        category: 'grammar',
        title: 'Irregular Past Tenses (went, saw, bought)',
        errorCount: 0,
        masteryPercentage: 85,
        explanation: 'Using present tense forms instead of simple past irregulars when referring to past time markers (yesterday, last week).',
        exampleMistake: 'Yesterday I go to the store and buy coffee.',
        exampleCorrection: 'Yesterday I went to the store and bought coffee.',
        ruleTip: 'Memorize the top 20 irregular past verbs: go ➔ went, see ➔ saw, buy ➔ bought, take ➔ took.',
        drillSentence: 'Yesterday I went to the office and took important notes.',
      },
      subject_verb_agreement: {
        id: 'subject_verb_agreement',
        category: 'grammar',
        title: 'Third-Person Singular (He/She/It)',
        errorCount: 0,
        masteryPercentage: 88,
        explanation: 'Forgetting "-s" or using "don\'t" instead of "doesn\'t" with third-person singular subjects.',
        exampleMistake: "She don't like spicy food.",
        exampleCorrection: "She doesn't like spicy food.",
        ruleTip: 'He, She, It always take "does" or "doesn\'t", never "don\'t".',
        drillSentence: "He doesn't usually drink coffee in the afternoon.",
      },
      dependent_prepositions: {
        id: 'dependent_prepositions',
        category: 'vocabulary',
        title: 'Dependent Prepositions (depend on, agree with)',
        errorCount: 0,
        masteryPercentage: 90,
        explanation: 'Using the wrong preposition after specific verbs, such as "depend of" or "explain me".',
        exampleMistake: 'It depends of the weather tomorrow.',
        exampleCorrection: 'It depends on the weather tomorrow.',
        ruleTip: 'Always pair "depend" with "on", and "explain" with "to me".',
        drillSentence: 'Our weekend plans depend entirely on the weather.',
      },
      th_pronunciation: {
        id: 'th_pronunciation',
        category: 'pronunciation',
        title: 'Dental Fricative Sounds (/θ/ and /ð/)',
        errorCount: 0,
        masteryPercentage: 80,
        explanation: 'Substituting "s/z" or "t/d" for the English "th" sound in words like "think", "three", and "this".',
        exampleMistake: 'I sink that this is good.',
        exampleCorrection: 'I think that this is good.',
        ruleTip: 'Gently place the tip of your tongue between your top and bottom teeth and push air outward.',
        drillSentence: 'I think these three things are thoroughly important.',
        pronunciationTip: '/θɪŋk/ (unvoiced) and /ðiːz/ (voiced). Tongue between teeth.',
      },
      silent_letters_syllables: {
        id: 'silent_letters_syllables',
        category: 'pronunciation',
        title: 'Syllable Reductions & Silent Letters',
        errorCount: 0,
        masteryPercentage: 82,
        explanation: 'Over-pronouncing silent syllables in words like "comfortable" (3 syllables, not 4) or "vegetable".',
        exampleMistake: 'Pronouncing com-for-ta-ble as four full beats.',
        exampleCorrection: 'Say /KUMF-ter-bul/ with a reduced middle syllable.',
        ruleTip: 'Native English rhythm uses vowel reduction (schwa /ə/) to keep speech flowing smoothly.',
        drillSentence: 'This comfortable chair was recommended at the restaurant.',
        pronunciationTip: 'Say "KUMF-ter-bul" and "VEDGE-tuh-bul".',
      },
      unnatural_collocations: {
        id: 'unnatural_collocations',
        category: 'vocabulary',
        title: 'Natural Collocations (take a photo, make a mistake)',
        errorCount: 0,
        masteryPercentage: 86,
        explanation: 'Direct translations from native language leading to awkward pairings like "make a photo" or "do a mistake".',
        exampleMistake: 'Can you make a photo of me?',
        exampleCorrection: 'Can you take a photo of me?',
        ruleTip: 'In English, we "take" photos and "make" mistakes.',
        drillSentence: 'Let us take a great photo so we do not make any mistakes.',
      },
    };

    // Scan through actual recorded mistakes in the current session
    mistakeMessages.forEach((msg) => {
      const orig = (msg.correction?.originalText || '').toLowerCase();
      const expl = (msg.correction?.mistakeExplanation || '').toLowerCase();

      if (orig.includes('yesterday') || orig.includes('last') || expl.includes('past')) {
        catalog.irregular_past_tense.errorCount += 1;
        catalog.irregular_past_tense.masteryPercentage = Math.max(
          35,
          catalog.irregular_past_tense.masteryPercentage - 15
        );
      }

      if (orig.includes("don't") || orig.includes("dont") || expl.includes('third-person')) {
        catalog.subject_verb_agreement.errorCount += 1;
        catalog.subject_verb_agreement.masteryPercentage = Math.max(
          40,
          catalog.subject_verb_agreement.masteryPercentage - 15
        );
      }

      if (orig.includes('depend') || orig.includes('explain') || expl.includes('preposition')) {
        catalog.dependent_prepositions.errorCount += 1;
        catalog.dependent_prepositions.masteryPercentage = Math.max(
          45,
          catalog.dependent_prepositions.masteryPercentage - 15
        );
      }

      if (orig.includes('th') || expl.includes('pronunciation') || expl.includes('th')) {
        catalog.th_pronunciation.errorCount += 1;
        catalog.th_pronunciation.masteryPercentage = Math.max(
          35,
          catalog.th_pronunciation.masteryPercentage - 15
        );
      }

      if (
        orig.includes('comfortable') ||
        orig.includes('vegetable') ||
        orig.includes('restaurant') ||
        expl.includes('silent')
      ) {
        catalog.silent_letters_syllables.errorCount += 1;
        catalog.silent_letters_syllables.masteryPercentage = Math.max(
          45,
          catalog.silent_letters_syllables.masteryPercentage - 12
        );
      }

      if (orig.includes('make a photo') || orig.includes('do a mistake') || expl.includes('collocation')) {
        catalog.unnatural_collocations.errorCount += 1;
        catalog.unnatural_collocations.masteryPercentage = Math.max(
          40,
          catalog.unnatural_collocations.masteryPercentage - 15
        );
      }
    });

    const weakSpots = Object.values(catalog).sort(
      (a, b) => a.masteryPercentage - b.masteryPercentage
    );

    // Calculate category masteries
    const grammarItems = weakSpots.filter((w) => w.category === 'grammar');
    const pronunciationItems = weakSpots.filter((w) => w.category === 'pronunciation');
    const vocabularyItems = weakSpots.filter((w) => w.category === 'vocabulary');

    const avgMastery = (items: WeakSpotItem[]) =>
      items.length
        ? Math.round(items.reduce((acc, curr) => acc + curr.masteryPercentage, 0) / items.length)
        : 85;

    const grammarMastery = avgMastery(grammarItems);
    const pronunciationMastery = avgMastery(pronunciationItems);
    const vocabularyMastery = avgMastery(vocabularyItems);
    const overallMastery = Math.round(
      (grammarMastery * 0.4 + pronunciationMastery * 0.35 + vocabularyMastery * 0.25)
    );

    const lowestSkill = weakSpots[0];
    const priorityRecommendation = lowestSkill
      ? `Focus on ${lowestSkill.title}: practice saying "${lowestSkill.drillSentence}" to reinforce automatic fluency.`
      : 'Maintain your current speaking rhythm and advance to B2/C1 complex dialogues.';

    return {
      overallMastery,
      grammarMastery,
      pronunciationMastery,
      vocabularyMastery,
      totalMistakesRecorded: mistakeMessages.length,
      weakSpots,
      priorityRecommendation,
    };
  }
}
