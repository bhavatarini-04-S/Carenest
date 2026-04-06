// ─────────────────────────────────────────────────────────────────────────────
// CareNest — Bayesian Network Sentiment Analysis Engine
// ─────────────────────────────────────────────────────────────────────────────
//
// Architecture: Dynamic Bayesian Network (DBN)
//
// Nodes (Hidden):
//   H1 = Emotional State  { crisis, distressed, anxious, neutral, positive }
//   H2 = Cognitive Load   { overwhelmed, strained, moderate, clear }
//   H3 = Social Context   { isolated, withdrawn, connected, supported }
//
// Observable Evidence Nodes:
//   E1 = Lexical Distress Score  (0–1)
//   E2 = Negation Density        (0–1)
//   E3 = First-person Intensity  (0–1)
//   E4 = Urgency Markers         (0–1)
//   E5 = Temporal Despair        (0–1)  ("never", "always", "forever")
//   E6 = Social Isolation Cues   (0–1)
//   E7 = Cognitive Distortion    (0–1)  (black/white thinking)
//   E8 = Positive Affect         (0–1)
//
// Inference: Variable Elimination with prior + likelihood update
// Output: Posterior probability distribution over emotional states
// ─────────────────────────────────────────────────────────────────────────────

// ── Lexicons ──────────────────────────────────────────────────────────────────

const DISTRESS_LEXICON = {
    // Crisis (weight 1.0)
    suicidal: 1.0, suicide: 1.0, 'end it': 1.0, 'kill myself': 1.0,
    hopeless: 0.9, worthless: 0.9, 'give up': 0.85, 'no point': 0.85,
    // High distress (0.7–0.85)
    depressed: 0.8, depression: 0.8, breakdown: 0.8, panic: 0.75,
    overwhelmed: 0.75, devastated: 0.75, terrified: 0.75, desperate: 0.8,
    trapped: 0.75, numb: 0.7, empty: 0.7, shattered: 0.75,
    // Moderate distress (0.4–0.7)
    anxious: 0.6, anxiety: 0.6, stressed: 0.55, exhausted: 0.55,
    lonely: 0.6, scared: 0.55, worried: 0.5, upset: 0.45,
    crying: 0.6, hurt: 0.5, pain: 0.55, suffering: 0.65,
    failing: 0.5, failed: 0.5, miserable: 0.65, terrible: 0.6,
    awful: 0.6, horrible: 0.6, tired: 0.4, burnout: 0.65,
    // Mild distress (0.2–0.4)
    confused: 0.3, lost: 0.35, uncertain: 0.25, unsure: 0.2,
    frustrated: 0.4, annoyed: 0.3, sad: 0.45, unhappy: 0.4,
    disappointed: 0.35, guilty: 0.45, ashamed: 0.5, embarrassed: 0.3,
}

const POSITIVE_LEXICON = {
    happy: 0.8, joy: 0.8, excited: 0.75, hopeful: 0.7, grateful: 0.75,
    calm: 0.7, peaceful: 0.75, content: 0.65, better: 0.5, good: 0.5,
    great: 0.6, amazing: 0.7, wonderful: 0.7, relieved: 0.65, proud: 0.6,
    motivated: 0.65, confident: 0.65, supported: 0.7, loved: 0.75,
    improving: 0.55, progress: 0.5, thankful: 0.7, blessed: 0.65,
}

const NEGATION_WORDS = new Set([
    'not', 'no', 'never', 'cant', 'cannot', 'wont', 'dont', 'doesnt', 'didnt',
    'isnt', 'arent', 'wasnt', 'werent', 'havent', 'hadnt', 'shouldnt', 'wouldnt',
    'couldnt', 'nothing', 'nobody', 'nowhere', 'neither', 'nor',
])

const URGENCY_MARKERS = new Set([
    'now', 'immediately', 'today', 'tonight', 'right now', 'this moment',
    'cant wait', 'anymore', 'finally', 'enough', 'done', 'finished', 'over',
])

const TEMPORAL_DESPAIR = new Set([
    'never', 'always', 'forever', 'ever', 'anymore', 'still', 'yet',
    'been like this', 'this whole time', 'all my life', 'every time',
])

const ISOLATION_CUES = new Set([
    'alone', 'lonely', 'no one', 'nobody', 'isolated', 'by myself', 'no friends',
    'no family', 'left me', 'abandoned', 'rejected', 'ignored', 'invisible',
    'unwanted', 'unloved', 'disconnected',
])

const COGNITIVE_DISTORTION = new Set([
    'always', 'never', 'everyone', 'no one', 'everything', 'nothing', 'worst',
    'best', 'perfect', 'failure', 'disaster', 'catastrophe', 'impossible',
    'useless', 'pointless', 'stupid', 'idiot', 'hate myself', 'my fault',
])

// ── Prior Probabilities P(H1) ─────────────────────────────────────────────────
// Based on general young-adult mental health prevalence
const PRIOR = {
    emotional: {
        crisis: 0.05,
        distressed: 0.20,
        anxious: 0.30,
        neutral: 0.30,
        positive: 0.15,
    },
    cognitive: {
        overwhelmed: 0.15,
        strained: 0.30,
        moderate: 0.35,
        clear: 0.20,
    },
    social: {
        isolated: 0.15,
        withdrawn: 0.25,
        connected: 0.40,
        supported: 0.20,
    },
}

// ── Conditional Probability Tables P(Evidence | State) ───────────────────────
// P(high distress score | emotional state)
const CPT_DISTRESS_GIVEN_EMOTIONAL = {
    crisis: { high: 0.95, moderate: 0.04, low: 0.01 },
    distressed: { high: 0.75, moderate: 0.20, low: 0.05 },
    anxious: { high: 0.40, moderate: 0.45, low: 0.15 },
    neutral: { high: 0.05, moderate: 0.30, low: 0.65 },
    positive: { high: 0.02, moderate: 0.10, low: 0.88 },
}

// P(high negation | emotional state)
const CPT_NEGATION_GIVEN_EMOTIONAL = {
    crisis: { high: 0.80, low: 0.20 },
    distressed: { high: 0.60, low: 0.40 },
    anxious: { high: 0.40, low: 0.60 },
    neutral: { high: 0.15, low: 0.85 },
    positive: { high: 0.08, low: 0.92 },
}

// P(urgency | emotional state)
const CPT_URGENCY_GIVEN_EMOTIONAL = {
    crisis: { high: 0.70, low: 0.30 },
    distressed: { high: 0.35, low: 0.65 },
    anxious: { high: 0.25, low: 0.75 },
    neutral: { high: 0.05, low: 0.95 },
    positive: { high: 0.03, low: 0.97 },
}

// P(temporal despair | emotional state)
const CPT_TEMPORAL_GIVEN_EMOTIONAL = {
    crisis: { high: 0.75, low: 0.25 },
    distressed: { high: 0.50, low: 0.50 },
    anxious: { high: 0.30, low: 0.70 },
    neutral: { high: 0.10, low: 0.90 },
    positive: { high: 0.05, low: 0.95 },
}

// P(isolation | social state)
const CPT_ISOLATION_GIVEN_SOCIAL = {
    isolated: { high: 0.90, low: 0.10 },
    withdrawn: { high: 0.55, low: 0.45 },
    connected: { high: 0.10, low: 0.90 },
    supported: { high: 0.05, low: 0.95 },
}

// P(cognitive distortion | cognitive state)
const CPT_DISTORTION_GIVEN_COGNITIVE = {
    overwhelmed: { high: 0.75, low: 0.25 },
    strained: { high: 0.45, low: 0.55 },
    moderate: { high: 0.20, low: 0.80 },
    clear: { high: 0.08, low: 0.92 },
}

// ── Feature Extraction ────────────────────────────────────────────────────────
function extractFeatures(text) {
    const raw = text.toLowerCase()
    const words = raw.replace(/[^a-z\s']/g, '').split(/\s+/).filter(Boolean)
    const bigrams = []
    for (let i = 0; i < words.length - 1; i++) bigrams.push(`${words[i]} ${words[i + 1]}`)
    const allTokens = [...words, ...bigrams]
    const n = Math.max(words.length, 1)

    // E1: Lexical distress score (negation-aware)
    let distressSum = 0, distressCount = 0
    let positiveSum = 0, positiveCount = 0
    words.forEach((w, i) => {
        const negated = i > 0 && NEGATION_WORDS.has(words[i - 1])
        if (DISTRESS_LEXICON[w] !== undefined) {
            const score = negated ? DISTRESS_LEXICON[w] * 0.3 : DISTRESS_LEXICON[w]
            distressSum += score; distressCount++
        }
        if (POSITIVE_LEXICON[w] !== undefined) {
            const score = negated ? 0 : POSITIVE_LEXICON[w]
            positiveSum += score; positiveCount++
        }
    })
    // Also check bigrams for phrases like "end it", "give up"
    bigrams.forEach(b => {
        if (DISTRESS_LEXICON[b] !== undefined) { distressSum += DISTRESS_LEXICON[b]; distressCount++ }
    })

    const E1 = distressCount > 0 ? Math.min(1, distressSum / distressCount) : 0
    const E8 = positiveCount > 0 ? Math.min(1, positiveSum / positiveCount) : 0

    // E2: Negation density
    const negCount = words.filter(w => NEGATION_WORDS.has(w)).length
    const E2 = Math.min(1, negCount / (n * 0.3))

    // E3: First-person intensity (I, me, my, myself — signals rumination)
    const fp = words.filter(w => ['i', 'me', 'my', 'myself', 'i\'m', 'im', 'i\'ve'].includes(w)).length
    const E3 = Math.min(1, fp / (n * 0.4))

    // E4: Urgency markers
    const urgencyCount = allTokens.filter(t => URGENCY_MARKERS.has(t)).length
    const E4 = Math.min(1, urgencyCount / 3)

    // E5: Temporal despair
    const temporalCount = allTokens.filter(t => TEMPORAL_DESPAIR.has(t)).length
    const E5 = Math.min(1, temporalCount / 3)

    // E6: Social isolation cues
    const isolationCount = allTokens.filter(t => ISOLATION_CUES.has(t)).length
    const E6 = Math.min(1, isolationCount / 2)

    // E7: Cognitive distortion
    const distortionCount = allTokens.filter(t => COGNITIVE_DISTORTION.has(t)).length
    const E7 = Math.min(1, distortionCount / 3)

    return { E1, E2, E3, E4, E5, E6, E7, E8 }
}

// ── Bayesian Inference — Variable Elimination ─────────────────────────────────
function inferEmotionalState(features) {
    const { E1, E2, E3, E4, E5, E8 } = features

    // Discretise continuous evidence
    const distressLevel = E1 > 0.6 ? 'high' : E1 > 0.2 ? 'moderate' : 'low'
    const negationLevel = E2 > 0.4 ? 'high' : 'low'
    const urgencyLevel = E4 > 0.3 ? 'high' : 'low'
    const temporalLevel = E5 > 0.3 ? 'high' : 'low'

    const posterior = {}
    let Z = 0 // normalisation constant

    for (const state of Object.keys(PRIOR.emotional)) {
        // P(H) prior
        let p = PRIOR.emotional[state]

        // Multiply likelihoods P(E|H) — naive Bayes assumption per node
        p *= CPT_DISTRESS_GIVEN_EMOTIONAL[state][distressLevel]
        p *= CPT_NEGATION_GIVEN_EMOTIONAL[state][negationLevel]
        p *= CPT_URGENCY_GIVEN_EMOTIONAL[state][urgencyLevel]
        p *= CPT_TEMPORAL_GIVEN_EMOTIONAL[state][temporalLevel]

        // Positive affect strongly reduces crisis/distressed probability
        if (E8 > 0.4) {
            if (state === 'crisis') p *= 0.05
            if (state === 'distressed') p *= 0.20
            if (state === 'positive') p *= 2.50
        }

        // First-person rumination boosts anxiety/distress
        if (E3 > 0.4) {
            if (state === 'anxious') p *= 1.40
            if (state === 'distressed') p *= 1.25
        }

        posterior[state] = p
        Z += p
    }

    // Normalise
    for (const state of Object.keys(posterior)) posterior[state] /= Z

    return posterior
}

function inferCognitiveState(features) {
    const { E7, E3, E1 } = features
    const distortionLevel = E7 > 0.4 ? 'high' : 'low'
    const posterior = {}
    let Z = 0

    for (const state of Object.keys(PRIOR.cognitive)) {
        let p = PRIOR.cognitive[state]
        p *= CPT_DISTORTION_GIVEN_COGNITIVE[state][distortionLevel]
        if (E1 > 0.6 && state === 'overwhelmed') p *= 1.5
        if (E3 > 0.5 && state === 'strained') p *= 1.3
        posterior[state] = p; Z += p
    }
    for (const state of Object.keys(posterior)) posterior[state] /= Z
    return posterior
}

function inferSocialState(features) {
    const { E6, E8 } = features
    const isolationLevel = E6 > 0.3 ? 'high' : 'low'
    const posterior = {}
    let Z = 0

    for (const state of Object.keys(PRIOR.social)) {
        let p = PRIOR.social[state]
        p *= CPT_ISOLATION_GIVEN_SOCIAL[state][isolationLevel]
        if (E8 > 0.5 && state === 'supported') p *= 1.8
        if (E8 > 0.5 && state === 'isolated') p *= 0.2
        posterior[state] = p; Z += p
    }
    for (const state of Object.keys(posterior)) posterior[state] /= Z
    return posterior
}

// ── MAP Estimate (Most Probable State) ───────────────────────────────────────
function mapEstimate(posterior) {
    return Object.entries(posterior).reduce((a, b) => b[1] > a[1] ? b : a)[0]
}

// ── Composite Distress Score (0–10) ──────────────────────────────────────────
function computeDistressScore(emotional, cognitive, social) {
    const emotionalWeight = {
        crisis: 0.95, distressed: 0.72, anxious: 0.50, neutral: 0.25, positive: 0.05
    }
    const cognitiveWeight = {
        overwhelmed: 0.85, strained: 0.55, moderate: 0.30, clear: 0.10
    }
    const socialWeight = {
        isolated: 0.80, withdrawn: 0.50, connected: 0.25, supported: 0.10
    }

    const eScore = Object.entries(emotional).reduce((s, [k, v]) => s + v * emotionalWeight[k], 0)
    const cScore = Object.entries(cognitive).reduce((s, [k, v]) => s + v * cognitiveWeight[k], 0)
    const sScore = Object.entries(social).reduce((s, [k, v]) => s + v * socialWeight[k], 0)

    // Weighted composite: emotional is most predictive
    return Math.min(10, (eScore * 0.55 + cScore * 0.25 + sScore * 0.20) * 10)
}

// ── Full Bayesian Network Analysis ───────────────────────────────────────────
export function analyzeSentiment(text) {
    if (!text || text.trim().length < 3) {
        return {
            emotionalState: 'neutral', cognitiveState: 'moderate', socialState: 'connected',
            distressScore: 0, confidence: 0,
            label: 'Insufficient text', color: '#9CA3AF', emoji: '💭',
            advice: '', crisisAlert: false,
            posteriors: { emotional: {}, cognitive: {}, social: {} },
            features: {},
        }
    }

    const features = extractFeatures(text)
    const emotionalPost = inferEmotionalState(features)
    const cognitivePost = inferCognitiveState(features)
    const socialPost = inferSocialState(features)

    const emotionalState = mapEstimate(emotionalPost)
    const cognitiveState = mapEstimate(cognitivePost)
    const socialState = mapEstimate(socialPost)
    const distressScore = computeDistressScore(emotionalPost, cognitivePost, socialPost)
    const confidence = Math.max(...Object.values(emotionalPost))

    const crisisAlert = emotionalState === 'crisis' || distressScore >= 8.5

    // ── Human-readable output ──
    const stateConfig = {
        crisis: { label: 'Crisis signals detected', color: '#C0392B', emoji: '💛', advice: 'You are not alone. Please reach out — iCall: 9152987821 · Vandrevala: 1860-2662-345 · Available 24/7.' },
        distressed: { label: 'Significant distress', color: '#C4785A', emoji: '⛅', advice: 'You\'re carrying something heavy right now. Talking it through can help — I\'m right here.' },
        anxious: { label: 'Elevated anxiety detected', color: '#B8860B', emoji: '🌤', advice: 'Your nervous system seems activated. A slow breath in for 4 counts, hold 7, out for 8 can help right now.' },
        neutral: { label: 'Emotionally stable', color: '#5A7A3C', emoji: '🌱', advice: 'You seem fairly grounded right now. How can I support you today?' },
        positive: { label: 'Positive emotional tone', color: '#2D6A4F', emoji: '🌿', advice: 'There\'s warmth in your words. Let\'s build on that.' },
    }

    const cognitiveLabel = {
        overwhelmed: 'Cognitive load: High',
        strained: 'Cognitive load: Elevated',
        moderate: 'Cognitive load: Moderate',
        clear: 'Cognitive load: Clear',
    }

    const socialLabel = {
        isolated: 'Social context: Isolated',
        withdrawn: 'Social context: Withdrawn',
        connected: 'Social context: Connected',
        supported: 'Social context: Supported',
    }

    return {
        emotionalState, cognitiveState, socialState,
        distressScore: Math.round(distressScore * 10) / 10,
        confidence: Math.round(confidence * 100),
        crisisAlert,
        features,
        posteriors: { emotional: emotionalPost, cognitive: cognitivePost, social: socialPost },
        ...stateConfig[emotionalState],
        cognitiveLabel: cognitiveLabel[cognitiveState],
        socialLabel: socialLabel[socialState],
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Google Gemini API Client
// ─────────────────────────────────────────────────────────────────────────────
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// ── Chat Mode Instructions ─────────────────────────────────────────────────────
// Each mode fundamentally changes AI personality, verbosity and strategy.
// All modes still honour crisis detection — safety overrides mode.
const CHAT_MODE_INSTRUCTIONS = {
    rant: `
CHAT MODE: RANT MODE 🤬 — The user needs to vent without interruption. Be their silent, nodding best friend.
STRICT RULES:
- NEVER give advice, tips, or solutions — not even subtle ones.
- NEVER ask deep follow-up questions. At most ONE short warm acknowledgement.
- Just validate and reflect back their emotion. Mirror their energy.
- Use casual, real language: "ugh that's SO frustrating", "that's genuinely a lot", "I'd be furious too tbh", "that sounds exhausting".
- Keep responses SHORT (under 50 words). They're ranting — they don't want to read an essay.
- Sound like a friend who's nodding intensely while they talk.
- EXCEPTION: Crisis signals always override rant mode. If detected, gently break mode and provide warmth + helplines.`,

    venting: `
CHAT MODE: VENTING MODE 💭 — The user wants to share feelings and feel genuinely understood.
- ALWAYS lead with empathy. Validate before anything else.
- Reflect back what they said so they know you actually heard them.
- Ask one gentle, open follow-up question to help them process.
- Occasionally offer a normalising perspective — never lecture.
- Tone: warm, casual, late-night-friend-call energy.
- Under 100 words per response.`,

    advice: `
CHAT MODE: ADVICE MODE 🎯 — The user has asked for structured, practical solutions. They want a smart friend who's been there.
- Empathy first (ONE sentence only), then jump into solutions.
- Give 2–3 clear, specific, concrete steps they can start TODAY — no vague platitudes.
- Use numbered structure for multiple steps.
- Be direct and friendly. Skip the therapy-speak.
- Use the Bayesian cognitive state to tailor advice:
  * If cognitiveState = 'overwhelmed': step 1 should be a tiny easy win to break paralysis.
  * If socialState = 'isolated': at least one step involves human connection.
  * If emotionalState = 'anxious': include a grounding/regulation action.
- End with one short punchy line of belief in them. No question needed.`,

    motivation: `
CHAT MODE: MOTIVATION MODE ⚡ — The user needs energy, belief, and a push forward.
- Acknowledge the difficulty in ONE punchy sentence. Do NOT dwell on it.
- Then shift energy fully forward. Be real, not fake-hype.
- Short sentences. Active verbs. Momentum.
- Reference their specific situation — make it feel personal, not generic.
- Use Bayesian context: if distressScore > 6, acknowledge the weight before hype. If positive, amplify it.
- End with ONE specific, doable challenge for today — make it feel exciting, not scary.
- Think: best friend who genuinely believes in you and refuses to let you spiral.`,
}

export function buildSystemPrompt(ageCategory, professions, mood, sentimentContext, language = 'en', chatMode = 'venting') {
    const moodText = mood ? `Their current mood score is ${mood}/5.` : ''
    const profText = professions?.length ? professions.join(', ') : 'unknown'
    const sentimentText = sentimentContext
        ? `\nBAYESIAN ANALYSIS: Emotional state [${sentimentContext.emotionalState}] at ${sentimentContext.confidence}% confidence. Distress score: ${sentimentContext.distressScore}/10. Cognitive load: ${sentimentContext.cognitiveState}. Social context: ${sentimentContext.socialState}. Use this to calibrate your tone, depth, and the type of support offered.${sentimentContext.crisisAlert ? ' ⚠️ CRISIS ALERT ACTIVE — override all modes, provide immediate warmth and helplines.' : ''}`
        : ''

    // Language-specific instructions
    const languageInstructions = {
        'en': '',
        'hi': '\nLANGUAGE: Respond in Hindi (Devanagari script). Use culturally appropriate expressions and honorifics. Reference Indian context when relevant.',
        'ta': '\nLANGUAGE: Respond in Tamil. Use respectful Tamil expressions and cultural references appropriate for Tamil Nadu context.',
        'te': '\nLANGUAGE: Respond in Telugu. Use appropriate Telugu honorifics and cultural references for Andhra Pradesh/Telangana context.',
        'bn': '\nLANGUAGE: Respond in Bengali. Use respectful Bengali expressions and cultural references for West Bengal context.',
        'mr': '\nLANGUAGE: Respond in Marathi. Use appropriate Marathi expressions and cultural references for Maharashtra context.',
        'gu': '\nLANGUAGE: Respond in Gujarati. Use respectful Gujarati expressions and cultural references for Gujarat context.',
        'kn': '\nLANGUAGE: Respond in Kannada. Use appropriate Kannada expressions and cultural references for Karnataka context.',
        'ml': '\nLANGUAGE: Respond in Malayalam. Use respectful Malayalam expressions and cultural references for Kerala context.',
        'pa': '\nLANGUAGE: Respond in Punjabi. Use appropriate Punjabi expressions and cultural references for Punjab context.',
        'or': '\nLANGUAGE: Respond in Odia. Use respectful Odia expressions and cultural references for Odisha context.',
        'as': '\nLANGUAGE: Respond in Assamese. Use appropriate Assamese expressions and cultural references for Assam context.'
    }

    const langInstruction = languageInstructions[language] || ''
    const modeInstruction = CHAT_MODE_INSTRUCTIONS[chatMode] || CHAT_MODE_INSTRUCTIONS.venting

    const toneMap = {
        '18-25': 'You talk like a real friend — casual, warm, a little informal. No therapist-speak. Acknowledge academic stress, identity, FOMO, social anxiety. Never preachy.',
        '25-35': 'Empathetic and practical. Acknowledge stress without dismissing it. Reference work-life balance and relationships.',
        '35-45': 'Warm and grounded. Honour their experience and wisdom. Address family stress, mid-life transitions.',
        '45+': 'Respectful, calm, unhurried. Use clear simple language. Address loneliness, grief, health anxiety.',
    }

    return `You are CareNest — a Bayesian-powered AI support companion for the ${ageCategory || '18-25'} age group. You talk like a real friend, NOT a therapist.
User profession: ${profText}. ${moodText}${sentimentText}${langInstruction}

Base tone: ${toneMap[ageCategory] || toneMap['18-25']}
${modeInstruction}

Universal rules (never violate):
1. Never diagnose, prescribe medication, or act like a therapist.
2. CRISIS OVERRIDE: If crisis signals detected — respond with warmth, validate immediately, and ALWAYS include iCall (9152987821) and Vandrevala Foundation (1860-2662-345).
3. Match emotional register to Bayesian distress score — never be artificially cheerful if distress is high.
4. Sound human. Use contractions, casual phrasing. Avoid bullet-point therapy lists unless in Advice Mode.
5. You are a companion. The goal is for them to feel genuinely heard and less alone.`
}

export async function sendMessage(messages, ageCategory, professions, mood, latestUserText, language = 'en', chatMode = 'venting') {
    // Run Bayesian network analysis on the latest user message
    const sentimentContext = latestUserText ? analyzeSentiment(latestUserText) : null

    if (!API_KEY) throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format for Gemini SDK (filter out system instructions, map 'assistant' to 'model')
    const contents = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
    }));

    try {
        const result = await model.generateContent({
            contents: contents,
            systemInstruction: buildSystemPrompt(ageCategory, professions, mood, sentimentContext, language, chatMode)
        });
        const reply = result.response.text();
        return { reply, sentiment: sentimentContext };
    } catch (e) {
        console.error("Gemini API Error:", e);
        throw new Error("API error: " + e.message);
    }
}

// Keep backward-compatible export name
export const sendGroqMessage = (messages, ageCategory, professions, mood) => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    return sendMessage(messages, ageCategory, professions, mood, lastUser?.content, 'en', 'venting')
}

// ─────────────────────────────────────────────────────────────────────────────
// Journal Analysis
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeJournalWithAI(journalText, ageCategory, professions) {
    if (!API_KEY) throw new Error("Gemini API key is missing.");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const systemInstruction = `You are CareNest AI, an empathetic journaling companion.
The user relies on you for safe, non-judgmental analysis of their private journal entries. The user is in the ${ageCategory || '18-25'} age group.

Task:
1. Provide a warm, validating sentence of empathy.
2. Give 1 or 2 thoughtful, concise paragraphs on how to process or overcome this stress.
3. Make it balanced—neither too short nor too long (around 100-150 words). Focus heavily on actionable, supportive steps.

Keep the tone warm, grounded, and sharply focused on nervous system regulation.`;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Journal Entry:\n\n"${journalText}"` }] }],
            systemInstruction: systemInstruction,
            generationConfig: { temperature: 0.6 }
        });
        return result.response.text();
    } catch (e) {
        console.error("Gemini Journal API Error:", e);
        throw new Error("Analysis failed: " + e.message);
    }
}
