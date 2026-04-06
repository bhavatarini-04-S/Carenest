import React, { useState, useRef, useEffect, useCallback } from 'react'
import { sendMessage, analyzeSentiment } from '../lib/groq'
import useStore from '../store/useStore'

// ─── Advanced Triage Detection Engine for 45+ ─────────────────────────────────
const DEPRESSION_PATTERNS = [
    /\b(no joy|lost interest|nothing matters|empty|numb|no energy|exhausted|can't get up|don't care anymore|what's the point)\b/i,
    /\b(depressed|depression|hopeless|worthless|useless|burden|no purpose|pointless)\b/i,
    /\b(sleeping too much|can't sleep|no appetite|gained weight|lost weight|withdrawn)\b/i,
]
const LONELINESS_PATTERNS = [
    /\b(alone|lonely|no one|nobody|isolated|no friends|no family|disconnected|invisible)\b/i,
    /\b(no one visits|nobody calls|forgotten|abandoned|left behind|nobody cares)\b/i,
    /\b(miss my (family|children|husband|wife|partner|friends)|empty house|lonely since)\b/i,
]
const ANXIETY_PATTERNS = [
    /\b(worried|anxious|nervous|panic|scared|fear|terrified|dread|uneasy|restless)\b/i,
    /\b(health worry|doctor|diagnosis|illness|disease|pain|symptoms|what if)\b/i,
    /\b(can't stop thinking|racing thoughts|heart pounding|chest tight|can't breathe)\b/i,
]
const GRIEF_PATTERNS = [
    /\b(lost|loss|died|death|passed away|gone|miss them|grieving|grief|mourning)\b/i,
    /\b(widowed|widow|widower|bereaved|funeral|memorial|late husband|late wife)\b/i,
    /\b(can't move on|still grieving|years ago and still|never got over)\b/i,
]
const CRISIS_PATTERNS = [
    /\b(suicid|kill myself|end it|want to die|no reason to live|can't go on|take my life)\b/i,
    /\b(self.?harm|hurt myself|overdose|pills to end|better off dead|no way out)\b/i,
    /\b(not want to be here|wish i was dead|goodbye|final|nothing left)\b/i,
]

function runAdvancedTriage(text, behaviorTrend) {
    if (!text || text.trim().length < 3) return { level: 'stable', detectedConditions: [], riskScore: 0 }

    const detected = []
    let riskScore = 0

    if (DEPRESSION_PATTERNS.some(p => p.test(text))) { detected.push('depression'); riskScore += 25 }
    if (LONELINESS_PATTERNS.some(p => p.test(text))) { detected.push('loneliness'); riskScore += 20 }
    if (ANXIETY_PATTERNS.some(p => p.test(text))) { detected.push('anxiety'); riskScore += 20 }
    if (GRIEF_PATTERNS.some(p => p.test(text))) { detected.push('grief'); riskScore += 15 }
    if (CRISIS_PATTERNS.some(p => p.test(text))) { detected.push('crisis'); riskScore += 60 }

    // Factor in long-term behavior trend (not just instant mood)
    const avgTrendScore = behaviorTrend.length > 0
        ? behaviorTrend.slice(-5).reduce((a, b) => a + b, 0) / Math.min(behaviorTrend.length, 5)
        : 0
    if (avgTrendScore > 40) riskScore += 15 // persistent elevated distress
    if (avgTrendScore > 65) riskScore += 20 // chronic high distress

    const level = detected.includes('crisis') || riskScore >= 75
        ? 'high-risk'
        : riskScore >= 35
            ? 'needs-support'
            : 'stable'

    return { level, detectedConditions: [...new Set(detected)], riskScore: Math.min(100, riskScore) }
}

// ─── Triage Banner ─────────────────────────────────────────────────────────────
function TriageBanner({ triage, onDismiss }) {
    if (!triage || triage.level === 'stable') return null

    const isHighRisk = triage.level === 'high-risk'
    const config = isHighRisk
        ? { bg: 'linear-gradient(135deg,#7B0000,#A00000)', border: 'rgba(255,120,120,0.4)', icon: '🚨', title: 'We\'re here for you right now', sub: 'CareNest has detected signs that you might need immediate support. You are not alone.' }
        : { bg: 'linear-gradient(135deg,#92400E,#B45309)', border: 'rgba(251,191,36,0.4)', icon: '💛', title: 'It sounds like you\'re carrying something heavy', sub: 'Talking to someone you trust can really help. I\'m here with you too.' }

    return (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, width: '92%', maxWidth: 720, background: config.bg, borderRadius: 20, border: `1.5px solid ${config.border}`, padding: '20px 24px', boxShadow: '0 16px 56px rgba(0,0,0,0.5)', animation: 'slideDown .3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{config.icon}</span>
                    <div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 4 }}>{config.title}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', lineHeight: 1.5 }}>{config.sub}</div>
                    </div>
                </div>
                <button onClick={onDismiss} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: 'rgba(255,255,255,.8)', cursor: 'pointer', fontSize: 16, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12 }}>✕</button>
            </div>

            {isHighRisk && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                    {[
                        { name: 'iCall', hours: 'Mon–Sat 8am–10pm', number: '9152987821' },
                        { name: 'Vandrevala', hours: '24/7', number: '1860-2662-345' },
                        { name: 'AASRA', hours: '24/7', number: '9820466627' },
                    ].map(h => (
                        <a key={h.number} href={`tel:${h.number}`} style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: 'white', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>📞 {h.name}</span>
                            <span style={{ fontSize: 11, opacity: 0.7 }}>{h.hours}</span>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>{h.number}</span>
                        </a>
                    ))}
                </div>
            )}

            {!isHighRisk && (
                <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: 'white', fontSize: 13, lineHeight: 1.5 }}>
                        💬 <strong>Talk to someone:</strong> iCall — 9152987821 (Mon–Sat 8am–10pm)
                    </div>
                    <div style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)', color: 'white', fontSize: 13, lineHeight: 1.5 }}>
                        🤝 <strong>Guided support:</strong> Continue chatting — I'll walk with you through this.
                    </div>
                </div>
            )}

            {triage.detectedConditions.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {triage.detectedConditions.map(c => (
                        <span key={c} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,.15)', color: 'rgba(255,255,255,.85)', fontWeight: 600, textTransform: 'capitalize' }}>{c === 'crisis' ? '🔴 Crisis signals' : c === 'depression' ? '💙 Depression signals' : c === 'loneliness' ? '🕊️ Loneliness signals' : c === 'anxiety' ? '🌀 Anxiety signals' : '🌸 Grief signals'}</span>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Triage Status Widget ──────────────────────────────────────────────────────
function TriageStatusWidget({ currentTriage, behaviorTrend }) {
    const avgTrend = behaviorTrend.length > 0
        ? (behaviorTrend.slice(-7).reduce((a, b) => a + b, 0) / Math.min(behaviorTrend.length, 7)).toFixed(0)
        : null

    const statusMap = {
        'stable': { icon: '🟢', label: 'Stable', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', tip: 'You\'re doing well. Keep engaging.' },
        'needs-support': { icon: '🟡', label: 'Needs Support', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', tip: 'You may benefit from talking to someone.' },
        'high-risk': { icon: '🔴', label: 'High Risk', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', tip: 'Please reach out to a helpline or trusted person.' },
    }

    const status = statusMap[currentTriage?.level || 'stable']

    return (
        <div style={{ background: status.bg, borderRadius: 16, border: `1.5px solid ${status.border}`, padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{status.icon}</span>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: status.color }}>{status.label}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Current wellbeing status</div>
                </div>
            </div>
            <div style={{ fontSize: 13, color: status.color, lineHeight: 1.5, marginBottom: avgTrend ? 12 : 0 }}>{status.tip}</div>

            {avgTrend && (
                <div style={{ borderTop: `1px solid ${status.border}`, paddingTop: 12 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>7-Day Trend (distress %)</div>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 32 }}>
                        {behaviorTrend.slice(-7).map((v, i) => (
                            <div key={i} style={{ flex: 1, height: `${Math.max(10, v / 100 * 32)}px`, borderRadius: 4, background: v > 60 ? '#EF4444' : v > 35 ? '#F59E0B' : '#10B981', opacity: 0.7 + (i / 14) }} />
                        ))}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 6 }}>Avg distress: {avgTrend}% · Based on behavior trends, not just current mood</div>
                </div>
            )}
        </div>
    )
}

// ─── Spiritual / Meaning Panel ─────────────────────────────────────────────────
const REFLECTIONS = [
    { type: 'prayer', icon: '🙏', title: 'Morning Intention', content: '"May I meet this day with a heart open to what is, rather than what I wish it to be. May I find peace in the ordinary, and meaning in the moments between."' },
    { type: 'philosophy', icon: '🌼', title: 'Marcus Aurelius', content: '"You have power over your mind — not outside events. Realize this, and you will find strength." Every difficulty is an opportunity for inner growth.' },
    { type: 'gratitude', icon: '✨', title: 'Gratitude Practice', content: 'Name three things from today — however small. The warmth of sunlight. A sip of chai. A memory that made you smile. Gratitude rewires the brain toward peace.' },
    { type: 'meditation', icon: '🕯️', title: 'Breath Meditation', content: 'Place one hand on your chest. Breathe in slowly for 4 counts. Hold for 2. Release for 6. Repeat 3 times. You are here. You are enough. This moment is yours.' },
    { type: 'philosophy', icon: '📿', title: 'Viktor Frankl', content: '"Everything can be taken from a person but one thing: the last of human freedoms — to choose one\'s attitude in any given set of circumstances." Your spirit endures.' },
    { type: 'prayer', icon: '🌙', title: 'Evening Reflection', content: '"As this day closes, I release what did not go as planned. I hold gratitude for what was beautiful. Tomorrow is a new beginning waiting quietly for me."' },
    { type: 'gratitude', icon: '💌', title: 'Letter of Love', content: 'Think of someone who shaped who you are. Write — even mentally — one sentence of gratitude to them. Gratitude shared, even silently, lightens the heart.' },
    { type: 'meditation', icon: '🌊', title: 'Body Scan for Calm', content: 'Close your eyes. Start at your feet. Gently notice each part of your body — no judgment, just awareness. By the time you reach your head, tension begins to release.' },
]

function SpiritualPanel() {
    const [activeType, setActiveType] = useState('all')
    const [expanded, setExpanded] = useState(null)
    const types = [
        { id: 'all', icon: '🌟', label: 'All' },
        { id: 'prayer', icon: '🙏', label: 'Prayer' },
        { id: 'meditation', icon: '🕯️', label: 'Meditation' },
        { id: 'philosophy', icon: '🌼', label: 'Reflection' },
        { id: 'gratitude', icon: '✨', label: 'Gratitude' },
    ]
    const filtered = activeType === 'all' ? REFLECTIONS : REFLECTIONS.filter(r => r.type === activeType)

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {types.map(t => (
                    <button key={t.id} onClick={() => setActiveType(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 20, border: `1.5px solid ${activeType === t.id ? '#7C3AED' : '#E5E7EB'}`, background: activeType === t.id ? '#EDE9FE' : 'white', color: activeType === t.id ? '#7C3AED' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s', fontFamily: 'DM Sans, sans-serif' }}>
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filtered.map((r, i) => (
                    <div key={i} onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: 'white', borderRadius: 16, padding: '18px 22px', border: `1.5px solid ${expanded === i ? '#C4B5FD' : '#F3F4F6'}`, cursor: 'pointer', transition: 'all .25s', boxShadow: expanded === i ? '0 8px 24px rgba(124,58,237,.12)' : '0 2px 8px rgba(0,0,0,.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: expanded === i ? 12 : 0 }}>
                            <span style={{ fontSize: 26 }}>{r.icon}</span>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#1F1F2E' }}>{r.title}</div>
                                <div style={{ fontSize: 11, color: '#A78BFA', fontWeight: 600, textTransform: 'capitalize', marginTop: 2 }}>{r.type}</div>
                            </div>
                            <span style={{ marginLeft: 'auto', color: '#9CA3AF', fontSize: 18 }}>{expanded === i ? '▲' : '▼'}</span>
                        </div>
                        {expanded === i && (
                            <div style={{ fontSize: 15, lineHeight: 1.8, color: '#374151', fontStyle: 'italic', borderLeft: '3px solid #C4B5FD', paddingLeft: 16, marginTop: 4 }}>
                                {r.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Main 45+ Senior Wellness Chat ────────────────────────────────────────────
export default function SeniorWellnessChat() {
    const { ageCategory, professions, mood, language, setLanguage, behaviorTrend, addTrendScore } = useStore()

    const [chatMode, setChatMode] = useState('wellness')
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: "Hello 🌿 I'm so glad you're here. I'm your CareNest companion — a calm, patient space designed just for you. How are you feeling today? There's no rush — share as much or as little as feels comfortable.",
        sentiment: null,
    }])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentTriage, setCurrentTriage] = useState({ level: 'stable', detectedConditions: [], riskScore: 0 })
    const [triageBannerVisible, setTriageBannerVisible] = useState(false)
    const [liveSentiment, setLiveSentiment] = useState(null)
    const [typingTimeout, setTypingTimeout] = useState(null)
    const [showSpiritual, setShowSpiritual] = useState(false)
    const [voiceSupported, setVoiceSupported] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const bottomRef = useRef(null)
    const recognitionRef = useRef(null)
    const synthRef = useRef(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

    useEffect(() => {
        const speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
        const synthSupported = 'speechSynthesis' in window
        setVoiceSupported(speechSupported && synthSupported)
        if (speechSupported) {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SR()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'en-US'
            recognitionRef.current.onresult = (e) => { setInput(prev => prev + (prev ? ' ' : '') + e.results[0][0].transcript); setIsListening(false) }
            recognitionRef.current.onerror = () => setIsListening(false)
            recognitionRef.current.onend = () => setIsListening(false)
        }
        if (synthSupported) synthRef.current = window.speechSynthesis
        return () => { recognitionRef.current?.stop(); synthRef.current?.cancel() }
    }, [])

    function handleInput(e) {
        const val = e.target.value
        setInput(val)
        if (typingTimeout) clearTimeout(typingTimeout)
        if (val.trim().length > 8) {
            const t = setTimeout(() => {
                setLiveSentiment(analyzeSentiment(val))
                const triage = runAdvancedTriage(val, behaviorTrend)
                if (triage.level !== 'stable') { setCurrentTriage(triage); setTriageBannerVisible(true) }
            }, 700)
            setTypingTimeout(t)
        } else {
            setLiveSentiment(null)
        }
    }

    async function send() {
        const text = input.trim()
        if (!text || loading) return

        const sentiment = analyzeSentiment(text)
        const triage = runAdvancedTriage(text, behaviorTrend)

        addTrendScore(triage.riskScore)
        setCurrentTriage(triage)
        if (triage.level !== 'stable') setTriageBannerVisible(true)

        const userMsg = { role: 'user', content: text, sentiment }
        const updated = [...messages, userMsg]
        setMessages(updated)
        setInput('')
        setLiveSentiment(null)
        setLoading(true)

        try {
            const { reply, sentiment: resSentiment } = await sendMessage(
                updated.map(m => ({ role: m.role, content: m.content })),
                '45+', professions, mood, text, language, chatMode
            )
            setMessages(prev => [...prev, { role: 'assistant', content: reply, sentiment: resSentiment }])
            if (voiceSupported && !isSpeaking) setTimeout(() => speakText(reply), 500)
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a little trouble connecting right now. Please try again — I'm still here with you 💙", sentiment: null }])
        } finally {
            setLoading(false)
        }
    }

    function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

    function startListening() {
        if (!recognitionRef.current || isListening) return
        try { recognitionRef.current.start(); setIsListening(true) } catch {}
    }
    function stopListening() { recognitionRef.current?.stop(); setIsListening(false) }
    function speakText(text) {
        if (!synthRef.current || isSpeaking) return
        synthRef.current.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.rate = 0.82; u.pitch = 0.95; u.volume = 0.85
        u.onstart = () => setIsSpeaking(true)
        u.onend = () => setIsSpeaking(false)
        u.onerror = () => setIsSpeaking(false)
        synthRef.current.speak(u)
    }
    function stopSpeaking() { synthRef.current?.cancel(); setIsSpeaking(false) }

    const MODES = [
        { id: 'wellness', icon: '💙', label: 'Wellness Talk', color: '#1D4ED8', bg: '#EFF6FF' },
        { id: 'venting', icon: '💭', label: 'Share Feelings', color: '#7C3AED', bg: '#EDE9FE' },
        { id: 'advice', icon: '🎯', label: 'Guidance', color: '#059669', bg: '#ECFDF5' },
        { id: 'motivation', icon: '🌅', label: 'Encouragement', color: '#D97706', bg: '#FFFBEB' },
    ]

    if (showSpiritual) {
        return (
            <div style={s.chatShell}>
                <div style={s.spiritualHeader}>
                    <button onClick={() => setShowSpiritual(false)} style={s.backBtn}>← Back to Chat</button>
                    <div style={s.spiritualTitle}>🌸 Spiritual & Meaning-Based Support</div>
                    <div style={s.spiritualSub}>Prayer, meditation, philosophical reflections & gratitude practices</div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
                    <SpiritualPanel />
                </div>
            </div>
        )
    }

    return (
        <>
            {triageBannerVisible && (
                <TriageBanner triage={currentTriage} onDismiss={() => setTriageBannerVisible(false)} />
            )}

            <div style={s.chatShell}>
                {/* Chat Header */}
                <div style={s.header}>
                    <div style={s.headerAvatar}>🌿</div>
                    <div style={{ flex: 1 }}>
                        <div style={s.headerName}>CareNest — Senior Companion</div>
                        <div style={s.headerStatus}>
                            <span style={s.statusDot} />
                            Calm · Safe · Always here for you
                        </div>
                    </div>
                    <button onClick={() => setShowSpiritual(true)} style={s.spiritualBtn}>
                        🙏 Spiritual
                    </button>
                    <select style={s.langSelect} value={language} onChange={e => setLanguage(e.target.value)}>
                        <option value="en">🌐 English</option>
                        <option value="hi">🇮🇳 हिंदी</option>
                        <option value="ta">🇮🇳 தமிழ்</option>
                        <option value="te">🇮🇳 తెలుగు</option>
                        <option value="bn">🇮🇳 বাংলা</option>
                        <option value="mr">🇮🇳 मराठी</option>
                        <option value="gu">🇮🇳 ગુજરાતી</option>
                        <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                        <option value="ml">🇮🇳 മലയാളം</option>
                    </select>
                </div>

                {/* Mode Selector */}
                <div style={s.modeBar}>
                    {MODES.map(m => {
                        const active = chatMode === m.id
                        return (
                            <button key={m.id} onClick={() => setChatMode(m.id)} style={{ ...s.modeBtn, background: active ? m.color : m.bg, color: active ? 'white' : m.color, border: `1.5px solid ${active ? m.color : 'transparent'}`, boxShadow: active ? `0 4px 14px ${m.color}33` : 'none', transform: active ? 'scale(1.04)' : 'scale(1)' }}>
                                <span style={{ fontSize: 16 }}>{m.icon}</span>
                                <span>{m.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Messages */}
                <div style={s.messages}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ ...s.msgRow, ...(m.role === 'user' ? s.msgRowUser : {}) }}>
                            {m.role === 'assistant' && <div style={s.aiAvatar}>🌿</div>}
                            <div style={{ maxWidth: '76%' }}>
                                <div style={{ ...s.bubble, ...(m.role === 'user' ? s.bubbleUser : s.bubbleAI) }}>
                                    {m.content}
                                </div>
                                {m.role === 'user' && m.sentiment && m.sentiment.emotionalState !== 'neutral' && (
                                    <div style={{ ...s.sentimentTag, color: m.sentiment.color, background: m.sentiment.color + '12', border: `1px solid ${m.sentiment.color}30` }}>
                                        {m.sentiment.emoji} {m.sentiment.emotionalState} · {m.sentiment.distressScore}/10
                                    </div>
                                )}
                            </div>
                            {m.role === 'user' && <div style={s.userAvatar}>You</div>}
                        </div>
                    ))}

                    {loading && (
                        <div style={s.msgRow}>
                            <div style={s.aiAvatar}>🌿</div>
                            <div style={s.typingBubble}>
                                {[0, 1, 2].map(i => <div key={i} style={{ ...s.typingDot, animationDelay: `${i * 0.2}s` }} />)}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Live sentiment */}
                {liveSentiment && input.trim().length > 8 && (
                    <div style={s.liveIndicator}>
                        <span>{liveSentiment.emoji}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: liveSentiment.color }}>{liveSentiment.label}</span>
                        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{liveSentiment.distressScore}/10</span>
                    </div>
                )}

                {/* Input */}
                <div style={s.inputArea}>
                    <textarea
                        style={s.input}
                        placeholder="Type here — take your time… I'm listening 🌿"
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKey}
                        rows={2}
                    />
                    {voiceSupported && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button onClick={isListening ? stopListening : startListening} title={isListening ? 'Stop' : 'Voice input'} style={{ ...s.iconBtn, background: isListening ? '#EF4444' : '#10B981' }}>
                                {isListening ? '⏹️' : '🎤'}
                            </button>
                            <button onClick={isSpeaking ? stopSpeaking : undefined} title={isSpeaking ? 'Stop speaking' : 'AI speaks'} style={{ ...s.iconBtn, background: isSpeaking ? '#F59E0B' : '#6366F1', opacity: isSpeaking ? 1 : 0.6 }}>
                                {isSpeaking ? '🔇' : '🔊'}
                            </button>
                        </div>
                    )}
                    <button style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.4 }} onClick={send} disabled={!input.trim() || loading}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                    </button>
                </div>

                <div style={s.disclaimer}>CareNest is an AI companion. For medical emergencies, please call 112 or visit your nearest hospital.</div>
            </div>
        </>
    )
}

const s = {
    chatShell: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, borderRadius: 20, border: '1.5px solid #E8EEF4', overflow: 'hidden', background: '#FAFBFF' },
    header: { padding: '16px 20px', background: 'white', borderBottom: '1.5px solid #E8EEF4', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap' },
    headerAvatar: { width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#1A5268,#2D8CB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
    headerName: { fontSize: 15, fontWeight: 700, color: '#1A3A4A' },
    headerStatus: { fontSize: 12, color: '#2D8CB0', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 },
    statusDot: { width: 7, height: 7, borderRadius: '50%', background: '#2D8CB0', display: 'inline-block', animation: 'pulse-ring 2s ease-out infinite' },
    spiritualBtn: { padding: '8px 16px', background: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', border: '1.5px solid #C4B5FD', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#6D28D9', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', flexShrink: 0 },
    langSelect: { padding: '8px 12px', background: '#F3F4F6', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 12, fontFamily: 'DM Sans,sans-serif', outline: 'none', cursor: 'pointer', color: '#1A3A4A', minWidth: 130 },

    spiritualHeader: { padding: '20px 28px', background: 'linear-gradient(135deg,#F5F3FF,#EDE9FE)', borderBottom: '1.5px solid #DDD6FE', flexShrink: 0 },
    backBtn: { background: 'none', border: 'none', color: '#7C3AED', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginBottom: 10, fontFamily: 'DM Sans,sans-serif' },
    spiritualTitle: { fontSize: 22, fontWeight: 700, color: '#4C1D95', fontFamily: 'Fraunces,serif', marginBottom: 4 },
    spiritualSub: { fontSize: 13, color: '#6D28D9' },

    modeBar: { display: 'flex', gap: 8, padding: '12px 16px', background: 'white', borderBottom: '1px solid #E8EEF4', flexShrink: 0, flexWrap: 'wrap' },
    modeBtn: { display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 22, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 600, transition: 'all .2s ease', flexShrink: 0 },

    messages: { flex: 1, overflowY: 'auto', padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 16 },
    msgRow: { display: 'flex', gap: 10, alignItems: 'flex-end', animation: 'slideUp .3s ease' },
    msgRowUser: { flexDirection: 'row-reverse' },
    aiAvatar: { width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#1A5268,#2D8CB0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
    userAvatar: { width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#A8BDD0,#1A5268)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 },
    bubble: { padding: '14px 18px', borderRadius: 18, fontSize: 15, lineHeight: 1.8, display: 'inline-block' },
    bubbleAI: { background: 'white', color: '#1A3A4A', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 10px rgba(26,82,104,.08)', border: '1px solid #E8EEF4' },
    bubbleUser: { background: 'linear-gradient(135deg,#1A5268,#2D8CB0)', color: 'white', borderRadius: '18px 18px 4px 18px' },
    sentimentTag: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, marginTop: 5, display: 'inline-block' },

    typingBubble: { display: 'flex', gap: 5, padding: '14px 18px', background: 'white', borderRadius: '18px 18px 18px 4px', border: '1px solid #E8EEF4', alignItems: 'center' },
    typingDot: { width: 8, height: 8, borderRadius: '50%', background: '#2D8CB0', animation: 'typing 1.2s infinite' },

    liveIndicator: { margin: '0 16px', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: '#F0F4F8', borderRadius: 10, border: '1px solid #E8EEF4', flexShrink: 0 },

    inputArea: { padding: '14px 16px', background: 'white', borderTop: '1.5px solid #E8EEF4', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 },
    input: { flex: 1, padding: '14px 18px', border: '1.5px solid #E8EEF4', borderRadius: 16, fontSize: 15, color: '#1A3A4A', fontFamily: 'DM Sans,sans-serif', resize: 'none', outline: 'none', background: '#F8FAFC', maxHeight: 110, lineHeight: 1.65 },
    iconBtn: { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: 15, transition: '.2s', flexShrink: 0 },
    sendBtn: { width: 48, height: 48, background: 'linear-gradient(135deg,#1A5268,#2D8CB0)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0, transition: '.2s' },
    disclaimer: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', padding: '8px 12px', flexShrink: 0 },
}
