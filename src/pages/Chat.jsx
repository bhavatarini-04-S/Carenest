import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { sendGroqMessage } from '../lib/groq'

export default function Chat() {
    const navigate = useNavigate()
    const { ageCategory, professions, mood } = useStore()
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hey, I'm really glad you're here. 💙 How are you feeling right now, in this exact moment? You can be as honest as you like — there's no right or wrong answer, and nothing you say will be judged." }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

    async function send() {
        const text = input.trim()
        if (!text || loading) return
        const updated = [...messages, { role: 'user', content: text }]
        setMessages(updated); setInput(''); setLoading(true)
        try {
            const reply = await sendGroqMessage(updated, ageCategory, professions, mood)
            setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: "I'm having a small moment of trouble connecting — please try again in a moment. I'm still here with you. 💙" }])
        } finally { setLoading(false) }
    }

    function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

    return (
        <div style={s.root}>
            <div style={s.header}>
                <div style={s.avatar}>🌿</div>
                <div style={{ flex: 1 }}>
                    <div style={s.headerName}>CareNest AI</div>
                    <div style={s.headerStatus}><span style={s.statusDot} /> Active and here for you</div>
                </div>
                <button style={s.backBtn} onClick={() => navigate('/dashboard')}>← Back to dashboard</button>
            </div>

            <div style={s.crisisBanner}>
                <span style={{ fontSize: 18 }}>💛</span>
                <div>If you're in crisis — <strong>iCall: 9152987821</strong> · <strong>Vandrevala Foundation: 1860-2662-345</strong> · Available 24/7</div>
            </div>

            <div style={s.body}>
                {messages.map((m, i) => (
                    <div key={i} style={{ ...s.msgRow, ...(m.role === 'user' ? s.msgRowUser : {}) }}>
                        <div style={{ ...s.msgAvatar, ...(m.role === 'user' ? s.msgAvatarUser : s.msgAvatarAI) }}>
                            {m.role === 'user' ? 'A' : '🌿'}
                        </div>
                        <div>
                            <div style={{ ...s.bubble, ...(m.role === 'user' ? s.bubbleUser : s.bubbleAI) }}>{m.content}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 5, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                                {m.role === 'user' ? 'You' : 'CareNest AI'} · Just now
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={s.msgRow}>
                        <div style={{ ...s.msgAvatar, ...s.msgAvatarAI }}>🌿</div>
                        <div style={s.typingWrap}>
                            {[0, 1, 2].map((i) => (
                                <div key={i} style={{ ...s.typingDot, animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div style={s.disclaimer}>
                CareNest is an AI support companion, not a replacement for professional mental healthcare.
            </div>

            <div style={s.inputArea}>
                <div style={s.inputWrap}>
                    <textarea
                        style={s.inputBox}
                        placeholder="Share what's on your mind..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        rows={1}
                    />
                    <button style={{ ...s.sendBtn, opacity: input.trim() ? 1 : .5 }} onClick={send}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

const s = {
    root: { background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column', animation: 'fadeIn .5s ease' },
    header: { background: 'white', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(107,143,113,.1)', boxShadow: '0 2px 12px rgba(0,0,0,.04)' },
    avatar: { width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,var(--sage),var(--sage-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, animation: 'glow 3s ease-in-out infinite' },
    headerName: { fontWeight: 600, fontSize: 16, color: 'var(--charcoal)' },
    headerStatus: { fontSize: 12, color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: 6 },
    statusDot: { width: 7, height: 7, background: 'var(--sage)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-ring 2s ease-out infinite' },
    backBtn: { padding: '10px 20px', background: 'rgba(107,143,113,.1)', color: 'var(--sage-dark)', borderRadius: 10, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    crisisBanner: { background: 'linear-gradient(135deg,#FEF3E2,#FDE8C8)', border: '1.5px solid #F6B84A', borderRadius: 14, padding: '14px 18px', margin: '16px 32px 0', display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#8B5E0A' },
    body: { flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 860, width: '100%', margin: '0 auto', overflowY: 'auto' },
    msgRow: { display: 'flex', gap: 12, animation: 'slideUp .3s ease' },
    msgRowUser: { flexDirection: 'row-reverse' },
    msgAvatar: { width: 36, height: 36, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
    msgAvatarAI: { background: 'linear-gradient(135deg,var(--sage-light),var(--sage))' },
    msgAvatarUser: { background: 'linear-gradient(135deg,#7B8EC8,#4A57A0)', fontSize: 13, fontWeight: 600, color: 'white' },
    bubble: { maxWidth: '65%', padding: '14px 18px', borderRadius: 18, fontSize: 14, lineHeight: 1.7 },
    bubbleAI: { background: 'white', color: 'var(--text-primary)', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 12px rgba(0,0,0,.06)' },
    bubbleUser: { background: 'var(--sage-dark)', color: 'white', borderRadius: '18px 18px 4px 18px' },
    typingWrap: { display: 'flex', gap: 5, padding: '14px 18px', background: 'white', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 12px rgba(0,0,0,.06)', alignItems: 'center' },
    typingDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--sage-light)', animation: 'typing 1.2s infinite' },
    disclaimer: { fontSize: 11, color: 'var(--text-light)', textAlign: 'center', padding: '8px 32px 0', maxWidth: 860, margin: '0 auto', width: '100%' },
    inputArea: { padding: '20px 32px', background: 'white', borderTop: '1px solid rgba(107,143,113,.1)' },
    inputWrap: { maxWidth: 860, margin: '0 auto', display: 'flex', gap: 12, alignItems: 'flex-end' },
    inputBox: { flex: 1, padding: '14px 20px', border: '1.5px solid rgba(107,143,113,.2)', borderRadius: 16, fontSize: 15, outline: 'none', color: 'var(--text-primary)', background: 'var(--off-white)', resize: 'none', maxHeight: 120, fontFamily: 'DM Sans,sans-serif' },
    sendBtn: { width: 48, height: 48, background: 'var(--sage-dark)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0, transition: '.2s' },
}