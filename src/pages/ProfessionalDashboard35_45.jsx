import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import DecisionIntelligence from '../components/DecisionIntelligence'
import QuickRelaxationToolkit from '../components/QuickRelaxationToolkit'
import CalmEnvironment from '../components/CalmEnvironment'
import AIChat1825 from '../components/AIchat'
import EmergencySupportSection from '../components/EmergencySupportSection'

export default function ProfessionalDashboard35_45() {
    const [tab, setTab] = useState('decision')
    const navigate = useNavigate()
    const { professions } = useStore()

    return (
        <div style={s.layout}>
            {/* Nav Sidebar */}
            <aside style={s.sidebar}>
                <div>
                    <div style={s.brand}>🌿 CareNest</div>
                    <div style={s.brandSub}>35-45 Leadership Space</div>
                </div>

                <div style={s.navGroup}>
                    <button style={{ ...s.navBtn, ...(tab === 'decision' ? s.navBtnActive : {}) }} onClick={() => setTab('decision')}>
                        <span style={s.icon}>🎯</span> Decision Intelligence
                    </button>
                    <button style={{ ...s.navBtn, ...(tab === 'relaxation' ? s.navBtnActive : {}) }} onClick={() => setTab('relaxation')}>
                        <span style={s.icon}>⏱️</span> Exercise Corner
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'chat' ? s.navBtnActive : {}) }} onClick={() => setTab('chat')}>
                        <span style={s.icon}>💬</span> AI Wellness Chat
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'calm' ? s.navBtnActive : {}) }} onClick={() => setTab('calm')}>
                        <span style={s.icon}>🌊</span> Calm Environment
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'emergency' ? s.navBtnActive : {}) }} onClick={() => setTab('emergency')}>
                        <span style={s.icon}>🆘</span> Emergency Support
                    </button>
                </div>

                <div style={s.sidebarFooter}>
                    <div style={s.userType}>{professions[0] || 'Leader'}</div>
                    <button style={s.logout} onClick={() => navigate('/auth')}>Sign out</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={s.main}>
                {tab === 'decision' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Decision Intelligence System</h1>
                            <p style={s.subtitle}>Structured support for career decisions, parenting dilemmas, and financial choices with emotional + practical analysis.</p>
                        </div>
                        <DecisionIntelligence />
                    </div>
                )}

                {tab === 'relaxation' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Exercise Corner</h1>
                            <p style={s.subtitle}>5 guided exercises with tutorial videos and step-by-step instructions. Squats, breathing, yoga, push-ups, and stretching for quick wellness breaks.</p>
                        </div>
                        <QuickRelaxationToolkit />
                    </div>
                )}

                {tab === 'chat' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>AI Wellness Chat</h1>
                            <p style={s.subtitle}>Empathetic, practical support for work-life balance, leadership challenges, and personal growth.</p>
                        </div>
                        <AIChat1825 />
                    </div>
                )}

                {tab === 'calm' && (
                    <div style={s.tabContent}>
                        <div style={s.header}>
                            <h1 style={s.title}>Calm Environment</h1>
                            <p style={s.subtitle}>Immersive soundscapes and focus music to reduce stress and boost focus during work.</p>
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
        </div>
    )
}

const s = {
    layout: { display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' },
    sidebar: { width: 300, background: 'var(--charcoal)', color: 'white', display: 'flex', flexDirection: 'column', padding: '40px 28px' },
    brand: { fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: 'var(--sage-light)', marginBottom: 8, lineHeight: 1.2 },
    brandSub: { fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 32 },
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
}
