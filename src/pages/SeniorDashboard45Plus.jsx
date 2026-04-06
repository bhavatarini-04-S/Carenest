import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import SeniorWellnessChat from '../components/SeniorWellnessChat'
import SeniorSpiritualSupport from '../components/SeniorSpiritualSupport'
import CalmEnvironment from '../components/CalmEnvironment'
import EmergencySupportSection from '../components/EmergencySupportSection'

export default function SeniorDashboard45Plus() {
    const [tab, setTab] = useState('chat')
    const navigate = useNavigate()
    const { professions } = useStore()

    const TABS = [
        { id: 'chat', icon: '💬', label: 'Wellbeing Chat', desc: 'AI guidance & support' },
        { id: 'spiritual', icon: '🌸', label: 'Spiritual Support', desc: 'Prayer & reflections' },
        { id: 'calm', icon: '🌊', label: 'Calm Spaces', desc: 'Meditation & music' },
        { id: 'emergency', icon: '🆘', label: 'Get Help Now', desc: '24/7 Crisis support' },
    ]

    return (
        <div style={s.layout}>
            {/* Sidebar — Consistent with other professional dashboards but simplified */}
            <aside style={s.sidebar}>
                <div style={s.top}>
                    <div style={s.brand}>🌿 CareNest</div>
                    <div style={s.brandSub}>Senior Wellness Space</div>
                </div>

                <div style={s.navGroup}>
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            style={{ ...s.navBtn, ...(tab === t.id ? s.navBtnActive : {}) }}
                            onClick={() => setTab(t.id)}
                            title={t.desc}
                        >
                            <span style={s.icon}>{t.icon}</span>
                            <div style={s.navLabelGroup}>
                                <div style={s.navLabel}>{t.label}</div>
                                <div style={s.navDesc}>{t.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>

                <div style={s.sidebarFooter}>
                    <div style={s.userType}>{professions[0] || 'Soul Seeker'}</div>
                    <button style={s.logout} onClick={() => navigate('/auth')}>Sign out</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={s.main}>
                <div style={s.contentWrapper}>
                    {tab === 'chat' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>How is your heart <em style={{ fontStyle: 'italic', fontWeight: 300 }}>today?</em></h1>
                                <p style={s.displaySubtitle}>Our AI companion is here to listen without judgment. Take your time — there is no rush.</p>
                            </div>
                            <div style={s.chatContainer}>
                                <SeniorWellnessChat />
                            </div>
                        </div>
                    )}

                    {tab === 'spiritual' && (
                        <div style={s.tabContent}>
                            <SeniorSpiritualSupport />
                        </div>
                    )}

                    {tab === 'calm' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>A Moment of Quiet</h1>
                                <p style={s.displaySubtitle}>Immerse yourself in calming soundscapes and gentle music to soothe the mind.</p>
                            </div>
                            <CalmEnvironment />
                        </div>
                    )}

                    {tab === 'emergency' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}><span style={{ color: '#DC2626' }}>🆘 Immediate Support</span></h1>
                                <p style={s.displaySubtitle}>You are never alone. Professional help and crisis services are available 24/7 if you need them.</p>
                            </div>
                            <EmergencySupportSection />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

const s = {
    layout: { display: 'flex', height: '100vh', background: '#F8FAFC', overflow: 'hidden', animation: 'fadeIn .5s ease' },
    sidebar: { width: 340, background: 'var(--charcoal)', color: 'white', display: 'flex', flexDirection: 'column', padding: '48px 32px' },
    brand: { fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 600, color: 'var(--sage-light)', marginBottom: 6 },
    brandSub: { fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 600, marginBottom: 48 },
    navGroup: { display: 'flex', flexDirection: 'column', gap: 14, flex: 1 },
    navBtn: { display: 'flex', alignItems: 'center', padding: '20px 24px', background: 'transparent', color: 'rgba(255,255,255,.6)', border: 'none', borderRadius: 20, cursor: 'pointer', transition: 'all .3s ease', textAlign: 'left', outline: 'none' },
    navBtnActive: { background: 'rgba(255,255,255,.1)', color: 'white', boxShadow: '0 4px 20px rgba(0,0,0,.1)' },
    icon: { fontSize: 24, marginRight: 20, flexShrink: 0 },
    navLabelGroup: { display: 'flex', flexDirection: 'column', gap: 4 },
    navLabel: { fontSize: 16, fontWeight: 700, fontFamily: 'DM Sans, sans-serif' },
    navDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
    sidebarFooter: { paddingTop: 40, borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 'auto' },
    userType: { fontSize: 12, color: 'var(--sage-light)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700 },
    logout: { background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 14, textDecoration: 'underline', transition: '.2s' },
    main: { flex: 1, overflowY: 'auto', padding: '60px 40px' },
    contentWrapper: { maxWidth: 1000, margin: '0 auto' },
    tabContent: { animation: 'slideUp 0.5s ease' },
    header: { marginBottom: 48 },
    displayTitle: { fontFamily: 'Fraunces, serif', fontSize: 52, fontWeight: 500, color: '#0F172A', margin: 0, marginBottom: 16, lineHeight: 1.15 },
    displaySubtitle: { fontSize: 20, color: '#475569', lineHeight: 1.6, maxWidth: 600 },
    chatContainer: { height: '650px', boxShadow: '0 20px 60px rgba(15,23,42,.12)', borderRadius: 24, overflow: 'hidden' },
}
