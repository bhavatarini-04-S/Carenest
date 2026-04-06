import React, { useState, useRef, useEffect } from 'react'
import { sendMessage, analyzeSentiment } from '../lib/groq'
import BayesianSentimentPanel from './BayesianChat'
import useStore from '../store/useStore'
import { logProgressEntry } from './ProgressTracking'

// ─── NLP Crisis Detection Engine ─────────────────────────────────────────────
const CRISIS_T1 = [
    /\bsuicid/i, /\bkill (my)?self/i, /\bend (my|this) life/i, /\bwant to die\b/i,
    /\bnot (want|wanting) to (be here|live|exist)/i, /\bno reason to (live|be here)/i,
    /\bcan'?t (go on|continue|do this anymore)/i, /\btake my (own )?life/i,
    /\bself.?harm/i, /\bcut(ting)? (my|myself)/i, /\bhurt(ing)? (my|myself)/i,
    /\boverdos/i, /\bpills to (end|kill|die)/i, /\bmethod (to|for) (kill|die|end)/i,
    /\balready said goodbye/i, /\bno (way out|hope left|point anymore)/i,
]
const CRISIS_T2 = [
    /\bgive up/i, /\btired of (living|life|everything)/i, /\bnothing matters/i,
    /\bwish (i was|i were|i'd) (dead|gone|never born)/i, /\bworthless/i, /\bhopeless/i,
    /\bhelpless/i, /\bdesperate/i, /\bcan'?t go on/i, /\bso depressed/i,
    /\bevery(thing|body) hates me/i, /\bno one understands/i, /\bbroke down/i,
    /\bempty inside/i, /\bno one cares/i, /\bbetter off without me/i,
    /\bcan'?t (take it|cope|handle it) anymore/i, /\bfall apart/i,
    /\bso alone/i, /\bcompletely alone/i, /\bso lost/i,
    /\bfeel like (a burden|dying|giving up)/i, /\bno point/i,
    /\bwant to disappear/i, /\bwish i were dead/i,
    /\bso miserable/i, /\bi hate (my life|myself|living)/i,
]

function detectCrisis(text) {
    if (!text || text.trim().length < 3) return 0
    if (CRISIS_T1.some(p => p.test(text))) return 2
    if (CRISIS_T2.some(p => p.test(text))) return 1
    return 0
}

// ─── Crisis Banner (fixed position, never blocks input) ───────────────────────
function CrisisBanner({ level, onDismiss }) {
    if (level === 0) return null
    const isImminent = level === 2
    return (
        <div style={{
            position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, width: '90%', maxWidth: 700,
            background: isImminent
                ? 'linear-gradient(135deg, #7B0000, #A00000)'
                : 'linear-gradient(135deg, #5A3000, #7A4500)',
            borderRadius: 18,
            border: `1.5px solid ${isImminent ? 'rgba(255,120,120,0.45)' : 'rgba(255,200,80,0.4)'}`,
            padding: '18px 22px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
            animation: 'slideUp 0.3s ease',
        }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{isImminent ? '💛' : '🤍'}</span>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>
                            {isImminent ? 'You matter. Please reach out right now.' : "It sounds like you're carrying something heavy."}
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.72)', marginTop: 4, lineHeight: 1.5 }}>
                            {isImminent
                                ? "CareNest detected signs of a crisis. Trained counsellors are available 24/7 — you don't have to face this alone."
                                : "What you feel is completely valid. A trained voice can help. You can still keep typing — I'm here too."}
                        </div>
                    </div>
                </div>
                <button
                    onClick={onDismiss}
                    style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontSize: 16, width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 12 }}
                >✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                    { name: 'iCall', hours: 'Mon–Sat 8am–10pm', number: '9152987821' },
                    { name: 'Vandrevala', hours: '24/7', number: '1860-2662-345' },
                    { name: 'AASRA', hours: '24/7', number: '9820466627' },
                    { name: 'Snehi', hours: '10am–10pm', number: '044-24640050' },
                ].map(h => (
                    <a key={h.number} href={`tel:${h.number}`} style={{
                        padding: '10px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: 'white', textDecoration: 'none',
                        display: 'flex', flexDirection: 'column', gap: 2,
                    }}>
                        <span style={{ fontSize: 11, fontWeight: 700 }}>📞 {h.name}</span>
                        <span style={{ fontSize: 10, opacity: 0.65 }}>{h.hours}</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{h.number}</span>
                    </a>
                ))}
            </div>
        </div>
    )
}

// ─── Main Chat Component ──────────────────────────────────────────────────────
export default function AIChat1825() {
    const { ageCategory, professions, mood, language, setLanguage } = useStore()

    // ── Chat Mode (18-25 only add-ons) ──
    const [chatMode, setChatMode] = useState('venting')

    const MODES = [
        { id: 'venting',    label: 'Venting',     icon: '💭', color: '#4A57A0', bg: '#EEF2FF', desc: 'Share your feelings — I\'m listening' },
        { id: 'rant',       label: 'Rant Mode',   icon: '🤣', color: '#DC2626', bg: '#FEF2F2', desc: 'Just let it all out. I won\'t interrupt.' },
        { id: 'advice',     label: 'Advice',      icon: '🎯', color: '#059669', bg: '#ECFDF5', desc: 'Get practical, structured solutions' },
        { id: 'motivation', label: 'Motivation',  icon: '⚡',  color: '#D97706', bg: '#FFFBEB', desc: 'Get a push forward' },
    ]

    const WELCOME_MSGS = {
        venting:    "Hey, I'm really glad you're here 💙 How are you feeling right now — honestly? There's no right or wrong answer. Just start wherever feels comfortable.",
        rant:       "Rant Mode activated 🤣 I'm not going to give you advice or ask a million questions — I'm just here to listen. Go off. I got you.",
        advice:     "Advice Mode 🎯 Let's figure this out together. Tell me what's going on and I'll give you some real, specific things you can actually do about it.",
        motivation: "Let's go ⚡ Tell me what you're up against — I'll help you find the energy to move through it.",
    }

    const PLACEHOLDERS = {
        venting:    "Share what's on your mind…",
        rant:       "Let it all out. No filter needed 🤣",
        advice:     "Describe what's going on — I'll help you figure it out…",
        motivation: "Tell me what you're facing — let's tackle it together ⚡",
    }

    function switchMode(newMode) {
        if (newMode === chatMode) return
        setChatMode(newMode)
        const modeInfo = MODES.find(m => m.id === newMode)
        // Insert a system-like hint message
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: WELCOME_MSGS[newMode],
            sentiment: null,
            isModeSwitchMsg: true,
        }])
    }

    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: WELCOME_MSGS['venting'],
        sentiment: null,
    }])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [liveSentiment, setLiveSentiment] = useState(null)
    const [typingTimeout, setTypingTimeout] = useState(null)
    const [crisisLevel, setCrisisLevel] = useState(0)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [voiceSupported, setVoiceSupported] = useState(false)
    const bottomRef = useRef(null)
    const recognitionRef = useRef(null)
    const synthRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    // Initialize voice functionality
    useEffect(() => {
        // Check if Web Speech API is supported
        const speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
        const synthSupported = 'speechSynthesis' in window
        
        setVoiceSupported(speechSupported && synthSupported)
        
        if (speechSupported) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            
            // Set language based on selected language
            const langMap = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'ta': 'ta-IN',
                'te': 'te-IN',
                'bn': 'bn-IN',
                'mr': 'mr-IN',
                'gu': 'gu-IN',
                'kn': 'kn-IN',
                'ml': 'ml-IN',
                'pa': 'pa-IN',
                'or': 'or-IN',
                'as': 'as-IN'
            }
            recognitionRef.current.lang = langMap[language] || 'en-US'
            
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setInput(prev => prev + (prev ? ' ' : '') + transcript)
                setIsListening(false)
            }
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error)
                setIsListening(false)
            }
            
            recognitionRef.current.onend = () => {
                setIsListening(false)
            }
        }
        
        if (synthSupported) {
            synthRef.current = window.speechSynthesis
        }
        
        // Cleanup on unmount
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (synthRef.current) {
                synthRef.current.cancel()
            }
        }
    }, [language]) // Re-initialize when language changes

    function handleInput(e) {
        const val = e.target.value
        setInput(val)
        // Crisis detection is INSTANT — no debounce
        setCrisisLevel(detectCrisis(val))
        if (typingTimeout) clearTimeout(typingTimeout)
        if (val.trim().length > 8) {
            const t = setTimeout(() => setLiveSentiment(analyzeSentiment(val)), 600)
            setTypingTimeout(t)
        } else {
            setLiveSentiment(null)
        }
    }

    async function send() {
        const text = input.trim()
        if (!text || loading) return

        const userSentiment = analyzeSentiment(text)
        setLiveSentiment(userSentiment)
        // Auto-log distress into progress tracker
        logProgressEntry({ distress: userSentiment.distressScore, source: 'chat' })
        // Reset crisis level after message is sent
        setCrisisLevel(0)

        const userMsg = { role: 'user', content: text, sentiment: userSentiment }
        const updated = [...messages, userMsg]
        setMessages(updated)
        setInput('')
        setLoading(true)

        try {
            const { reply, sentiment: responseSentiment } = await sendMessage(
                updated.map(m => ({ role: m.role, content: m.content })),
                ageCategory, professions, mood, text, language, chatMode
            )
            setMessages(prev => [...prev, { role: 'assistant', content: reply, sentiment: responseSentiment }])
            
            // Auto-speak the response if voice is supported
            if (voiceSupported && !isSpeaking) {
                setTimeout(() => speakText(reply), 500)
            }
        } catch (err) {
            const errorMsg = "I'm having a small moment of trouble connecting — please try again. I'm still here with you 💙"
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMsg,
                sentiment: null,
            }])
            
            // Speak error message too
            if (voiceSupported && !isSpeaking) {
                setTimeout(() => speakText(errorMsg), 500)
            }
        } finally {
            setLoading(false)
        }
    }

    function handleKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    }

    // Voice functions
    function startListening() {
        if (!recognitionRef.current || isListening) return
        
        try {
            recognitionRef.current.start()
            setIsListening(true)
        } catch (error) {
            console.error('Error starting speech recognition:', error)
        }
    }

    function stopListening() {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }

    function speakText(text) {
        if (!synthRef.current || isSpeaking) return
        
        // Cancel any ongoing speech
        synthRef.current.cancel()
        
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8
        
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        
        synthRef.current.speak(utterance)
    }

    function stopSpeaking() {
        if (synthRef.current) {
            synthRef.current.cancel()
            setIsSpeaking(false)
        }
    }

    const panelSentiment = liveSentiment ||
        [...messages].reverse().find(m => m.role === 'user' && m.sentiment)?.sentiment

    // Dynamic background tint when crisis is detected
    const crisisBg = crisisLevel === 2
        ? 'linear-gradient(180deg, rgba(100,0,0,0.10) 0%, var(--off-white) 50%)'
        : crisisLevel === 1
            ? 'linear-gradient(180deg, rgba(80,40,0,0.08) 0%, var(--off-white) 50%)'
            : 'var(--off-white)'

    return (
        <>
            {/* Fixed-position crisis banner — floats above all content, never blocks typing */}
            <CrisisBanner level={crisisLevel} onDismiss={() => setCrisisLevel(0)} />

            <div style={s.root}>
                {/* Left: Chat */}
                <div style={{ ...s.chatCol, background: crisisBg, transition: 'background 0.5s ease' }}>
                    {/* Header */}
                    <div style={s.header}>
                        <div style={s.headerAvatar}>🌿</div>
                        <div style={s.headerInfo}>
                            <div style={s.headerName}>CareNest AI</div>
                            <div style={s.headerStatus}>
                                <span style={s.statusDot} />
                                Personal wellness support · 18–25
                            </div>
                        </div>
                        {panelSentiment && (
                            <div style={{
                                ...s.sentimentPill,
                                background: panelSentiment.color + '18',
                                borderColor: panelSentiment.color + '55',
                                color: panelSentiment.color,
                            }}>
                                {panelSentiment.emoji} {panelSentiment.label}
                            </div>
                        )}
                        <select
                            style={s.languageSelect}
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            title="Change conversation language"
                        >
                            <option value="en">🌐 English</option>
                            <option value="hi">🇮🇳 हिंदी</option>
                            <option value="ta">🇮🇳 தமிழ்</option>
                            <option value="te">🇮🇳 తెలుగు</option>
                            <option value="bn">🇮🇳 বাংলা</option>
                            <option value="mr">🇮🇳 मराठी</option>
                            <option value="gu">🇮🇳 ગુજરાતી</option>
                            <option value="kn">🇮🇳 ಕನ್ನಡ</option>
                            <option value="ml">🇮🇳 മലയാളം</option>
                            <option value="pa">🇮🇳 ਪੰਜਾਬੀ</option>
                            <option value="or">🇮🇳 ଓଡ଼િଆ</option>
                            <option value="as">🇮🇳 অসমীয়া</option>
                        </select>
                    </div>

                    {/* ── Mode Selector (18-25 only) ── */}
                    {ageCategory === '18-25' && (
                        <div style={s.modeBar}>
                            {MODES.map(m => {
                                const active = chatMode === m.id
                                return (
                                    <button
                                        key={m.id}
                                        style={{
                                            ...s.modeBtn,
                                            background: active ? m.color : 'transparent',
                                            color: active ? 'white' : '#64748B',
                                            border: `1.5px solid ${active ? m.color : '#E5E7EB'}`,
                                            boxShadow: active ? `0 4px 14px ${m.color}40` : 'none',
                                            transform: active ? 'scale(1.04)' : 'scale(1)',
                                        }}
                                        onClick={() => switchMode(m.id)}
                                        title={m.desc}
                                    >
                                        <span style={{ fontSize: 15 }}>{m.icon}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    {/* Rant Mode listening indicator */}
                    {chatMode === 'rant' && (
                        <div style={s.rantBanner}>
                            <span style={s.rantPulse}>👂</span>
                            <span>I'm just <strong>listening</strong>. No advice, no questions — just me, nodding along.</span>
                        </div>
                    )}

                    {/* Advice mode context bar */}
                    {chatMode === 'advice' && (
                        <div style={s.adviceBanner}>
                            <span style={{ fontSize: 14 }}>🎯</span>
                            <span>Advice Mode — tell me what's going on and I'll give you real, actionable steps.</span>
                        </div>
                    )}

                    {/* Messages */}
                    <div style={s.messages}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ ...s.msgRow, ...(m.role === 'user' ? s.msgRowUser : {}) }}>
                                {m.role === 'assistant' && <div style={{ ...s.aiAvatar, ...(m.isModeSwitchMsg ? s.aiAvatarMode : {}) }}>{m.isModeSwitchMsg ? MODES.find(md => chatMode === md.id)?.icon || '🌿' : '🌿'}</div>}
                                <div style={{ maxWidth: '72%' }}>
                                    <div style={{ ...s.bubble, ...(m.role === 'user' ? s.bubbleUser : s.bubbleAI) }}>
                                        {m.content}
                                    </div>
                                    {m.role === 'user' && m.sentiment && m.sentiment.emotionalState !== 'neutral' && (
                                        <div style={{
                                            ...s.msgSentimentTag,
                                            color: m.sentiment.color,
                                            background: m.sentiment.color + '12',
                                            border: `1px solid ${m.sentiment.color}30`,
                                        }}>
                                            {m.sentiment.emoji} {m.sentiment.emotionalState} · {m.sentiment.distressScore}/10
                                        </div>
                                    )}
                                </div>
                                {m.role === 'user' && <div style={s.userAvatar}>A</div>}
                            </div>
                        ))}

                        {loading && (
                            <div style={s.msgRow}>
                                <div style={s.aiAvatar}>🌿</div>
                                <div style={s.typingBubble}>
                                    {[0, 1, 2].map(i => (
                                        <div key={i} style={{ ...s.typingDot, animationDelay: `${i * 0.2}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Live typing sentiment */}
                    {liveSentiment && input.trim().length > 8 && (
                        <div style={s.typingIndicator}>
                            <span style={{ fontSize: 13 }}>{liveSentiment.emoji}</span>
                            <span style={{ ...s.typingLabel, color: liveSentiment.color }}>{liveSentiment.label}</span>
                            <span style={s.typingScore}>{liveSentiment.distressScore}/10</span>
                        </div>
                    )}

                    {/* Input — always accessible */}
                    <div style={s.inputArea}>
                        <textarea
                            style={s.input}
                            placeholder={PLACEHOLDERS[chatMode] || "Share what's on your mind..."}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKey}
                            rows={2}
                        />
                        
                        {/* Voice Controls */}
                        {voiceSupported && (
                            <div style={s.voiceControls}>
                                <button
                                    style={{
                                        ...s.voiceBtn,
                                        background: isListening ? '#EF4444' : '#10B981',
                                        opacity: isListening ? 1 : 0.8
                                    }}
                                    onClick={isListening ? stopListening : startListening}
                                    title={isListening ? 'Stop listening' : 'Start voice input'}
                                >
                                    {isListening ? '⏹️' : '🎤'}
                                </button>
                                
                                <button
                                    style={{
                                        ...s.voiceBtn,
                                        background: isSpeaking ? '#F59E0B' : '#6366F1',
                                        opacity: isSpeaking ? 1 : 0.8
                                    }}
                                    onClick={isSpeaking ? stopSpeaking : () => speakText(input || "Please type or speak a message first")}
                                    title={isSpeaking ? 'Stop speaking' : 'Speak your message'}
                                >
                                    {isSpeaking ? '🔇' : '🔊'}
                                </button>
                            </div>
                        )}
                        
                        <button
                            style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.4 }}
                            onClick={send}
                            disabled={!input.trim() || loading}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>

                    <div style={s.disclaimer}>
                        CareNest is an AI support companion, not a replacement for professional mental healthcare.
                    </div>
                </div>

                {/* Right: Bayesian Panel — dimmed in Rant Mode */}
                <div style={{ ...s.bayesCol, opacity: chatMode === 'rant' ? 0.35 : 1, transition: 'opacity .4s ease', pointerEvents: chatMode === 'rant' ? 'none' : 'auto' }}>
                    <BayesianSentimentPanel sentiment={panelSentiment} />
                </div>
            </div>
        </>
    )
}

const s = {
    // Mode selector bar
    modeBar: { display: 'flex', gap: 8, padding: '10px 16px', background: 'white', borderBottom: '1px solid var(--cream-dark)', flexShrink: 0, flexWrap: 'wrap' },
    modeBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .2s ease', flexShrink: 0 },

    // Rant mode banner
    rantBanner: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)', borderBottom: '1px solid #FECACA', fontSize: 12, color: '#7F1D1D', flexShrink: 0 },
    rantPulse: { fontSize: 18, animation: 'pulse 2s ease-in-out infinite' },

    // Advice mode banner
    adviceBanner: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', borderBottom: '1px solid #A7F3D0', fontSize: 12, color: '#064E3B', flexShrink: 0 },

    // Mode switch message avatar variant
    aiAvatarMode: { background: 'linear-gradient(135deg, #FDE68A, #F59E0B)', fontSize: 18 },

    root: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, height: '100%', minHeight: 0 },
    chatCol: { display: 'flex', flexDirection: 'column', borderRadius: 20, border: '1.5px solid var(--cream-dark)', overflow: 'hidden', minHeight: 0 },
    bayesCol: { overflowY: 'auto', minHeight: 0 },

    header: { padding: '16px 20px', background: 'white', borderBottom: '1px solid var(--cream-dark)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, flexWrap: 'wrap' },
    headerAvatar: { width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,var(--sage),var(--sage-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, animation: 'glow 3s ease-in-out infinite' },
    headerInfo: { flex: 1 },
    headerName: { fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' },
    headerStatus: { fontSize: 11, color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 },
    statusDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)', display: 'inline-block', animation: 'pulse-ring 2s ease-out infinite' },
    sentimentPill: { fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, border: '1.5px solid', flexShrink: 0 },

    messages: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 },
    msgRow: { display: 'flex', gap: 10, alignItems: 'flex-end', animation: 'slideUp .3s ease' },
    msgRowUser: { flexDirection: 'row-reverse' },
    aiAvatar: { width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,var(--sage-light),var(--sage))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 },
    userAvatar: { width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#7B8EC8,#4A57A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 },
    bubble: { padding: '12px 16px', borderRadius: 16, fontSize: 14, lineHeight: 1.7, display: 'inline-block' },
    bubbleAI: { background: 'white', color: 'var(--text-primary)', borderRadius: '16px 16px 16px 3px', boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid var(--cream-dark)' },
    bubbleUser: { background: 'var(--sage-dark)', color: 'white', borderRadius: '16px 16px 3px 16px' },
    msgSentimentTag: { fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, marginTop: 5, display: 'inline-block' },

    typingBubble: { display: 'flex', gap: 4, padding: '14px 18px', background: 'white', borderRadius: '16px 16px 16px 3px', border: '1px solid var(--cream-dark)', alignItems: 'center' },
    typingDot: { width: 7, height: 7, borderRadius: '50%', background: 'var(--sage-light)', animation: 'typing 1.2s infinite' },

    typingIndicator: { margin: '0 16px', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--cream)', borderRadius: 10, border: '1px solid var(--cream-dark)', flexShrink: 0 },
    typingLabel: { fontSize: 12, fontWeight: 600, flex: 1 },
    typingScore: { fontSize: 11, color: 'var(--text-light)' },

    inputArea: { padding: '14px 16px', background: 'white', borderTop: '1px solid var(--cream-dark)', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 },
    input: { flex: 1, padding: '12px 16px', border: '1.5px solid var(--cream-dark)', borderRadius: 14, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'DM Sans,sans-serif', resize: 'none', outline: 'none', background: 'var(--off-white)', maxHeight: 100, lineHeight: 1.6 },
    voiceControls: { display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' },
    voiceBtn: { width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', fontSize: 14, transition: '.2s', flexShrink: 0 },
    sendBtn: { width: 44, height: 44, background: 'var(--sage-dark)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0, transition: '.2s' },
    disclaimer: { fontSize: 10, color: 'var(--text-light)', textAlign: 'center', padding: '8px', flexShrink: 0 },
    languageSelect: { padding: '8px 12px', background: '#F3F4F6', border: '1.5px solid var(--cream-dark)', borderRadius: 8, fontSize: 12, fontFamily: 'DM Sans, sans-serif', outline: 'none', cursor: 'pointer', color: 'var(--charcoal)', minWidth: 140 },
}
