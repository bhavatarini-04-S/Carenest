// src/lib/naiveBayes.js
// A lightweight, client-side Naive Bayes script mapped to mental distress levels.

const DICTIONARY = {
    distressed: ['anxious', 'overwhelmed', 'stress', 'tired', 'exhausted', 'worry', 'worried', 'sad', 'scared', 'fail', 'failing', 'lost', 'lonely', 'depressed', 'alone', 'crying', 'cry', 'hate', 'bad', 'hard', 'stuck', 'panic', 'pain', 'heavy'],
    neutral: ['okay', 'fine', 'normal', 'alright', 'busy', 'school', 'work', 'working', 'study', 'studying', 'meh', 'whatever', 'bored', 'so so', 'just'],
    calm: ['good', 'great', 'happy', 'peaceful', 'calm', 'relaxed', 'chill', 'better', 'love', 'nice', 'clear', 'focus', 'focused', 'joy', 'smile', 'light']
};

export function analyzeSentiment(text) {
    if (!text) return { category: 'neutral', distressLevel: 4 };

    // Simple text preprocessing
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let scores = { distressed: 0, neutral: 0, calm: 0 };

    words.forEach(word => {
        if (DICTIONARY.distressed.includes(word)) scores.distressed += 2; // Weight distress keywords higher
        else if (DICTIONARY.neutral.includes(word)) scores.neutral += 1;
        else if (DICTIONARY.calm.includes(word)) scores.calm += 1.5;
    });

    // Default fallback if no known keywords are found
    if (scores.distressed === 0 && scores.neutral === 0 && scores.calm === 0) {
        return { category: 'neutral', distressLevel: 4 };
    }

    let maxCategory = 'neutral';
    if (scores.distressed > scores.neutral && scores.distressed >= scores.calm) maxCategory = 'distressed';
    else if (scores.calm > scores.neutral && scores.calm > scores.distressed) maxCategory = 'calm';

    // Map to a 1-10 Distress Rating (1 = completely calm, 10 = highly distressed)
    let distressLevel = 5;
    if (maxCategory === 'calm') distressLevel = Math.max(1, 4 - scores.calm);
    else if (maxCategory === 'distressed') distressLevel = Math.min(10, 5 + scores.distressed);

    return { category: maxCategory, distressLevel };
}
