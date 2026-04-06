import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import BurnoutScorer from '../components/BurnoutScorer'
import BurnoutTrend from '../components/BurnoutTrend'
import SleepHygieneLog from '../components/SleepHygieneLog'
import StressSourceAttribution from '../components/StressSourceAttribution'

export default function ProfessionalDashboard() {
    const navigate = useNavigate()
    const { ageCategory, professions, burnoutHistory, setMood } = useStore()
    const [showScorer, setShowScorer] = useState(false)
    const [activeMood, setActiveMood] = useState(null)

    const lastScore = burnoutHistory.length > 0 ? burnoutHistory[burnoutHistory.length - 1] : null
    const hour = new Date().getHours()
    const greet = hour < 12 ? 'Good morning ☀️' : hour < 17 ? 'Good afternoon 🌤' : 'Good evening 🌙'

    return (
        <div style={s.root}>
            <nav style={s.nav}>
                <div style={s.navLogo}>🌿 CareNest Professional</div>
                <div style={s.navLinks}>
                    <div style={{ ...s.navLink, ...s.navLinkActive }}>Workspace</div>
                    <div style={s.navLink}>Burnout</div>
                    <div style={s.navLink}>Sleep</div>
                    <div style={s.navLink}>Chat</div>
                </div>
                <div style={s.avatar}>P</div>
            </nav>

            <div style={s.body}>
                <div style={s.hero}>
                    <div style={s.heroText}>
                        <div style={s.greetLabel}>{greet} · {ageCategory} · Professional track</div>
                        <h1 style={s.greetTitle}>Burnout risk, sleep hygiene, and stress attribution — all in one place.</h1>
                        <p style={s.greetCopy}>Weekly AI-guided scoring, empathetic wellness chat, Bayesian stress source analysis, and sleep-mood correlation designed for the 25–35 life stage.</p>
                    </div>

                    <div style={s.heroStats}>
                        <div style={s.statCard}>
                            <div style={s.statLabel}>Weekly burnout score</div>
                            <div style={s.statValue}>{lastScore ? `${lastScore.score}%` : '—'}</div>
                            <div style={s.statNote}>{lastScore ? `Last updated ${new Date(lastScore.date).toLocaleDateString()}` : 'Complete the questionnaire to begin.'}</div>
                        </div>
                        <div style={s.statCard}>
                            <div style={s.statLabel}>AI assistant</div>
                            <div style={s.statValue}>Professional wellness</div>
                            <div style={s.statNote}>Practical CBT micro-techniques for career, relationships and work-life balance.</div>
                        </div>
                    </div>
                </div>

                <div style={s.grid}>
                    <div style={s.colMain}>
                        <div style={s.card}>
                            <div style={s.cardTitle}>Weekly AI Questionnaire</div>
                            <div style={s.cardBody}>Answer industry-proven Maslach Burnout Inventory-style questions to generate a personalised burnout risk score and trend tracking.</div>
                            <div style={s.actionRow}>
                                <button style={s.primaryBtn} onClick={() => setShowScorer(true)}>{lastScore ? 'Review or retake' : 'Start assessment'}</button>
                                <button style={s.secondaryBtn} onClick={() => navigate('/chat')}>Open AI wellness chat</button>
                            </div>
                        </div>

                        <BurnoutTrend history={burnoutHistory} />

                        <div style={s.card}>
                            <div style={s.cardTitle}>Professional wellness AI chat</div>
                            <p style={s.cardBody}>CareNest listens with empathy and practical clarity. It understands work pressure, career anxiety, relationship tension, and suggests direct CBT micro-techniques you can use immediately.</p>
                            <button style={s.secondaryBtn} onClick={() => navigate('/chat')}>Talk with the AI</button>
                        </div>

                        <div style={s.card}>
                            <div style={s.cardTitle}>Today’s micro-practices</div>
                            <ul style={s.quickList}>
                                <li>Reframe “I should” into “I choose” for one task.</li>
                                <li>Practice a quick 4-7-8 breath after your next meeting.</li>
                                <li>Set one boundary around work time and protect it.</li>
                            </ul>
                        </div>

                        <div style={s.card}>
                            <div style={s.cardTitle}>Stress check-in</div>
                            <div style={s.cardBody}>Tap your current pressure level and let the AI adapt its support tone accordingly.</div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                {[1, 2, 3, 4, 5].map((lv) => (
                                    <button
                                        key={lv}
                                        onClick={() => setMood(lv)}
                                        style={{
                                            ...s.levelBtn,
                                            background: activeMood === lv ? '#1A5E38' : '#F0F2FF',
                                            color: activeMood === lv ? 'white' : '#4A5665',
                                        }}
                                    >
                                        {lv}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <aside style={s.colSide}>
                        <StressSourceAttribution />
                        <div style={s.card}>
                            <div style={s.cardTitle}>Financial stress resource hub</div>
                            <p style={s.cardBody}>Curated guides for financial anxiety, debt stress, and job loss with non-judgmental, practical support tailored for India.</p>
                            <ul style={{ ...s.quickList, marginTop: 14 }}>
                                <li>Steps to manage money anxiety without shame</li>
                                <li>Practical debt stress coping strategies</li>
                                <li>Where to seek local help for job insecurity</li>
                            </ul>
                        </div>
                        <SleepHygieneLog />
                    </aside>
                </div>
            </div>

            {showScorer && (
                <div style={s.modalOverlay}>
                    <div style={s.modalBody}>
                        <div style={s.modalHeader}>
                            <h3 style={{ fontFamily: 'Fraunces', fontSize: 24 }}>Burnout Risk Scorer</h3>
                            <button style={s.closeBtn} onClick={() => setShowScorer(false)}>✕</button>
                        </div>
                        <BurnoutScorer onComplete={() => setShowScorer(false)} />
                    </div>
                </div>
            )}
        </div>
    )
}

const s = {
    root: { background: '#F8F9FA', minHeight: '100vh', paddingBottom: 60 },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', background: 'white', borderBottom: '1px solid rgba(0,0,0,.05)' },
    navLogo: { fontFamily: 'Fraunces,serif', fontSize: 20, fontWeight: 600, color: 'var(--sage-dark)' },
    navLinks: { display: 'flex', gap: 12 },
    navLink: { padding: '10px 18px', borderRadius: 16, fontSize: 13, fontWeight: 600, color: '#6B7280', background: 'rgba(255,255,255,.9)', cursor: 'pointer' },
    navLinkActive: { background: '#EDF7EF', color: '#1A5E38' },
    avatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--sage-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'white' },
    body: { padding: '32px 40px', maxWidth: 1160, margin: '0 auto' },
    hero: { display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 32, flexWrap: 'wrap' },
    heroText: { flex: 1, minWidth: 320 },
    greetLabel: { fontSize: 12, color: '#1A5E38', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 },
    greetTitle: { fontFamily: 'Fraunces,serif', fontSize: 44, fontWeight: 500, color: '#0F172A', lineHeight: 1.05, margin: 0 },
    greetCopy: { fontSize: 15, lineHeight: 1.75, color: '#475569', maxWidth: 620, marginTop: 16 },
    heroStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, minWidth: 280 },
    statCard: { background: 'white', borderRadius: 24, padding: 24, boxShadow: '0 12px 30px rgba(0,0,0,.06)' },
    statLabel: { fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 },
    statValue: { fontFamily: 'Fraunces,serif', fontSize: 38, fontWeight: 700, color: '#1A2332', marginBottom: 10 },
    statNote: { fontSize: 13, color: '#64748B', lineHeight: 1.6 },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 },
    colMain: { display: 'flex', flexDirection: 'column', gap: 24 },
    colSide: { display: 'flex', flexDirection: 'column', gap: 24 },
    card: { background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 10 },
    cardBody: { fontSize: 13, lineHeight: 1.8, color: '#475569' },
    actionRow: { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 },
    primaryBtn: { background: '#1A5E38', color: 'white', border: 'none', padding: '14px 24px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    secondaryBtn: { background: 'transparent', color: '#1A5E38', border: '1.5px solid #D1E7D0', padding: '14px 24px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    quickList: { marginTop: 16, paddingLeft: 20, color: '#475569', lineHeight: 1.8 },
    levelBtn: { flex: 1, padding: '14px 0', borderRadius: 14, border: '1px solid transparent', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modalBody: { background: 'white', borderRadius: 28, maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'hidden', position: 'relative' },
    modalHeader: { padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' },
}
