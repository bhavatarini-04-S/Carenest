import React, { useState } from 'react'
import { analyzeSentiment } from '../lib/naiveBayes'
import { analyzeJournalWithAI } from '../lib/groq'
import useStore from '../store/useStore'
import { logProgressEntry } from './ProgressTracking'

function Speedometer({ value }) {
    const pct = Math.min(100, Math.max(0, (value / 10) * 100))
    let color = 'var(--sage-dark)'
    if (value >= 5) color = '#B8860B'
    if (value >= 8) color = '#C0392B'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 140 }}>
            <svg width="140" height="80" viewBox="0 0 140 80" style={{ overflow: 'visible' }}>
                <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke="var(--cream-dark)" strokeWidth="12" strokeLinecap="round" />
                <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset={188.5 - (188.5 * (pct / 100))} style={{ transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.6s ease' }} />
                <text x="70" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--charcoal)">{value}</text>
                <text x="70" y="80" textAnchor="middle" fontSize="10" fill="var(--text-light)" fontWeight="700" letterSpacing="1px">DISTRESS</text>
            </svg>
        </div>
    )
}

export default function WellnessJournal() {
    const { ageCategory, professions } = useStore()
    const [entry, setEntry] = useState('')
    const [saved, setSaved] = useState([])
    const [aiInsight, setAiInsight] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Live feedback based on the user's keystrokes
    const analysis = analyzeSentiment(entry)

    let tip = "Begin typing to process your thoughts."
    if (analysis.category === 'distressed') tip = "It sounds like you're carrying a lot right now. Writing it out is a good first step. Take a deep breath."
    else if (analysis.category === 'calm') tip = "You're in a clear headspace today. Protect this peace."
    else if (entry.length > 10) tip = "Thanks for checking in with yourself. Keep writing if you need to."

    async function handleAiAnalysis() {
        if (!entry.trim()) return
        setIsAnalyzing(true)
        try {
            const insight = await analyzeJournalWithAI(entry, ageCategory, professions)
            setAiInsight(insight)
            // Auto-log journal distress into progress tracker
            logProgressEntry({ distress: analysis.distressLevel, source: 'journal' })
        } catch (e) {
            setAiInsight("I'm having trouble analyzing this right now. Please try again.")
        } finally {
            setIsAnalyzing(false)
        }
    }



    return (
        <div style={s.root}>
            <div style={s.header}>
                <h2 style={s.title}>Wellness Journal</h2>
                <p style={s.sub}>Your private space to untangle the mind. Entries are analysed locally via our Naive Bayes engine to help you reflect, but are never stored permanently on our servers.</p>
            </div>

            <div style={s.editorBox}>
                <textarea
                    style={s.textarea}
                    placeholder="What's going through your mind today? Write as much or as little as you need."
                    value={entry}
                    onChange={e => setEntry(e.target.value)}
                />

                <div style={s.liveAnalysis}>
                    <Speedometer value={entry.trim().length < 5 ? 0 : analysis.distressLevel} />
                    <div style={s.tip}>{tip}</div>
                </div>

                <div style={s.actions}>
                    {entry.trim() && (
                        <button style={{ ...s.aiBtn, opacity: isAnalyzing ? 0.7 : 1 }} onClick={handleAiAnalysis} disabled={isAnalyzing}>
                            {isAnalyzing ? '✨ Analyzing...' : '✨ Get Deep AI Insights'}
                        </button>
                    )}

                </div>

                {aiInsight && (
                    <div style={{ ...s.aiInsightBox, animation: 'fadeIn .4s ease' }}>
                        <h4 style={s.aiInsightTitle}>CareNest AI Insights</h4>
                        <div style={s.aiInsightText}>{aiInsight}</div>
                    </div>
                )}
            </div>

            <div style={s.history}>
                <h3 style={s.historyTitle}>Past Entries</h3>
                {saved.length === 0 && <div style={s.empty}>Your journal is empty. Take a moment to write.</div>}
                {saved.map((e, i) => (
                    <div key={i} style={{ ...s.entryCard, animationDelay: `${i * 0.1}s` }}>
                        <div style={s.entryMeta}>
                            <span style={s.entryDate}>{e.date}</span>
                            <span style={{ fontSize: 11, background: 'rgba(107,143,113,.1)', padding: '4px 10px', borderRadius: 20, color: 'var(--sage-dark)', fontWeight: 600 }}>
                                Distress: {e.distress}/10
                            </span>
                        </div>
                        <div style={s.entryText}>{e.text}</div>
                        {e.insight && (
                            <div style={{ ...s.aiInsightBox, marginTop: 20, background: 'var(--cream)', border: 'none' }}>
                                <h4 style={s.aiInsightTitle}>Saved AI Insights</h4>
                                <div style={{ ...s.aiInsightText, fontSize: 13 }}>{e.insight}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const s = {
    root: { padding: '56px 64px', maxWidth: 880, margin: '0 auto', animation: 'fadeIn .5s ease' },
    header: { marginBottom: 40 },
    title: { fontFamily: 'Fraunces, serif', fontSize: 44, color: 'var(--charcoal)', marginBottom: 12 },
    sub: { fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 660 },
    editorBox: { background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,.03)', marginBottom: 48, position: 'relative' },
    textarea: { width: '100%', minHeight: 200, border: 'none', background: 'var(--off-white)', borderRadius: 16, padding: 24, fontSize: 16, fontFamily: 'DM Sans, sans-serif', resize: 'vertical', outline: 'none', color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.6 },
    liveAnalysis: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--cream)', padding: '16px 20px', borderRadius: 12, marginBottom: 20 },
    distressLevel: { fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' },
    tip: { fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '60%', textAlign: 'right' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 20 },
    saveBtn: { background: 'var(--charcoal)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: '.25s' },
    aiBtn: { background: 'var(--sage-dark)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: '.25s' },
    aiInsightBox: { marginTop: 24, padding: 24, background: 'linear-gradient(to bottom right, var(--cream), white)', border: '1.5px solid var(--cream-dark)', borderRadius: 16 },
    aiInsightTitle: { fontSize: 13, fontWeight: 700, color: 'var(--sage-dark)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 },
    aiInsightText: { fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' },
    historyTitle: { fontFamily: 'Fraunces, serif', fontSize: 26, color: 'var(--charcoal)', marginBottom: 24 },
    empty: { fontSize: 14, color: 'var(--text-light)', fontStyle: 'italic' },
    entryCard: { background: 'white', border: '1px solid rgba(107,143,113,.08)', borderRadius: 16, padding: 24, marginBottom: 16, animation: 'slideUp 0.4s ease backwards' },
    entryMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    entryDate: { fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 },
    entryText: { fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }
}
