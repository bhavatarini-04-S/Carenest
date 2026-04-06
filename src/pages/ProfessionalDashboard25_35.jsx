import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import BurnoutScorer from '../components/BurnoutScorer'
import BurnoutTrend from '../components/BurnoutTrend'
import CalmEnvironment from '../components/CalmEnvironment'
import StressSourceAttribution from '../components/StressSourceAttribution'
import AIChat1825 from '../components/AIchat'
import EmergencySupportSection from '../components/EmergencySupportSection'

export default function ProfessionalDashboard25_35() {
    const [tab, setTab] = useState('burnout')
    const navigate = useNavigate()
    const { professions, burnoutHistory, language, setLanguage } = useStore()
    const [showScorer, setShowScorer] = useState(false)

    const lastScore = burnoutHistory.length > 0 ? burnoutHistory[burnoutHistory.length - 1] : null

    return (
        <div style={s.layout}>
            {/* Nav Sidebar */}
            <aside style={s.sidebar}>
                <div>
                    <div style={s.brand}>🌿 CareNest</div>
                    <div style={s.brandSub}>25-35 Professional Space</div>
                </div>

                <div style={s.navGroup}>
                    <button style={{ ...s.navBtn, ...(tab === 'burnout' ? s.navBtnActive : {}) }} onClick={() => setTab('burnout')}>
                        <span style={s.icon}>🔥</span> Burnout Assessment
                    </button>
                    <button style={{ ...s.navBtn, ...(tab === 'chat' ? s.navBtnActive : {}) }} onClick={() => setTab('chat')}>
                        <span style={s.icon}>💬</span> AI Wellness Chat
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'stress' ? s.navBtnActive : {}) }} onClick={() => setTab('stress')}>
                        <span style={s.icon}>🧠</span> Stress Attribution
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'calm' ? s.navBtnActive : {}) }} onClick={() => setTab('calm')}>
                        <span style={s.icon}>🌊</span> Calm Environment
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'emergency' ? s.navBtnActive : {}) }} onClick={() => setTab('emergency')}>
                        <span style={s.icon}>🆘</span> Emergency Support
                    </button>
                </div>

                <div style={s.sidebarFooter}>
                    <div style={s.userType}>{professions[0] || 'Professional'}</div>
                    <button style={s.logout} onClick={() => navigate('/auth')}>Sign out</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={s.main}>
                {tab === 'burnout' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Weekly Burnout Assessment</h1>
                            <p style={s.subtitle}>Based on Maslach Burnout Inventory dimensions. Complete weekly to track your burnout risk.</p>
                        </div>
                        
                        <div style={s.grid}>
                            <div style={s.colMain}>
                                {lastScore && <BurnoutTrend history={burnoutHistory} />}
                                <div style={s.card}>
                                    <div style={s.cardTitle}>Take the Questionnaire</div>
                                    <p style={s.cardSub}>Answer 7 questions about emotional exhaustion, cynicism, and professional efficacy.</p>
                                    <button style={s.primaryBtn} onClick={() => setShowScorer(true)}>
                                        {lastScore ? 'Retake Assessment' : 'Start Now'}
                                    </button>
                                </div>
                            </div>
                            <div style={s.colSide}>
                                <div style={s.card}>
                                    <div style={s.cardTitle}>Your Current Status</div>
                                    <div style={s.scoreDisplay}>
                                        {lastScore ? (
                                            <>
                                                <div style={s.scoreValue}>{lastScore.score}%</div>
                                                <div style={s.scoreLabel}>Burnout Risk</div>
                                                <div style={s.scoreDate}>{new Date(lastScore.date).toLocaleDateString()}</div>
                                            </>
                                        ) : (
                                            <div style={s.scoreEmpty}>No assessment yet</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'chat' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>AI Wellness Chat</h1>
                            <p style={s.subtitle}>Empathetic, practical support for work-life balance, career anxiety, and relationships.</p>
                        </div>
                        <AIChat1825 />
                    </div>
                )}

                {tab === 'stress' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Stress Source Attribution</h1>
                            <p style={s.subtitle}>Bayesian classifier identifies whether stress originates from work, relationships, finances, or health.</p>
                        </div>
                        <div style={s.componentWrapper}>
                            <StressSourceAttribution />
                        </div>
                    </div>
                )}

                {tab === 'calm' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Calm Environment</h1>
                            <p style={s.subtitle}>Immersive soundscapes and focus music to reduce stress and boost concentration.</p>
                        </div>
                        <CalmEnvironment />
                    </div>
                )}

                {tab === 'emergency' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Emergency Support</h1>
                            <p style={s.subtitle}>24/7 crisis helplines, licensed therapists, and mental health resources. Immediate support is always available.</p>
                        </div>
                        <EmergencySupportSection />
                    </div>
                )}
            </main>

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
    layout: { display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' },
    sidebar: { width: 300, background: 'var(--charcoal)', color: 'white', display: 'flex', flexDirection: 'column', padding: '40px 28px' },
    brand: { fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: 'var(--sage-light)', marginBottom: 8, lineHeight: 1.2 },
    brandSub: { fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 32 },
    languageSelector: { marginBottom: 24 },
    languageLabel: { display: 'block', fontSize: 11, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 },
    languageSelect: { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, color: 'white', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', cursor: 'pointer' },
    navGroup: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
    navBtn: { display: 'flex', alignItems: 'center', padding: '16px 20px', background: 'transparent', color: 'rgba(255,255,255,.6)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .25s ease' },
    navBtnActive: { background: 'rgba(255,255,255,.1)', color: 'white' },
    icon: { fontSize: 18, marginRight: 12, opacity: .9 },
    sidebarFooter: { paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 'auto' },
    userType: { fontSize: 11, color: 'var(--sage-light)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.08em' },
    logout: { background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', transition: '.2s' },
    main: { flex: 1, overflowY: 'auto', position: 'relative', padding: '40px' },
    tabContent: { maxWidth: 1100, margin: '0 auto' },
    header: { marginBottom: 40 },
    title: { fontFamily: 'Fraunces,serif', fontSize: 44, fontWeight: 500, color: '#0F172A', margin: 0, marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#475569', lineHeight: 1.6 },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 },
    colMain: { display: 'flex', flexDirection: 'column', gap: 28 },
    colSide: { display: 'flex', flexDirection: 'column', gap: 28 },
    card: { background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 10 },
    cardSub: { fontSize: 13, lineHeight: 1.8, color: '#475569', marginBottom: 20 },
    primaryBtn: { background: '#1A5E38', color: 'white', border: 'none', padding: '14px 28px', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: '.2s' },
    scoreDisplay: { textAlign: 'center', padding: '20px 0' },
    scoreValue: { fontFamily: 'Fraunces,serif', fontSize: 52, fontWeight: 700, color: '#1A5E38', margin: 0 },
    scoreLabel: { fontSize: 13, color: '#6B7280', marginTop: 8, fontWeight: 600 },
    scoreDate: { fontSize: 11, color: '#9CA3AF', marginTop: 8 },
    scoreEmpty: { fontSize: 14, color: '#9CA3AF', padding: '40px 20px' },
    componentWrapper: { maxWidth: 400 },
    resourceCard: { background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)', display: 'flex', flexDirection: 'column', gap: 14 },
    resourceIcon: { fontSize: 36 },
    resourceTitle: { fontSize: 16, fontWeight: 700, color: '#0F172A' },
    resourceDesc: { fontSize: 13, lineHeight: 1.6, color: '#475569' },
    resourceList: { fontSize: 13, color: '#475569', paddingLeft: 20, margin: 0, lineHeight: 1.8 },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
    modalBody: { background: 'white', borderRadius: 28, maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative' },
    modalHeader: { padding: '24px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' },
}
