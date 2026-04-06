import React, { useState } from 'react'
import AIChat1825 from '../components/AIchat'
import WellnessJournal from '../components/WellnessJournal'
import DetoxMode from '../components/DetoxMode'
import StressRelief from '../components/StressRelief'
import ProgressTracking from '../components/ProgressTracking'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function YoungAdultDashboard() {
    const [tab, setTab] = useState('chat')
    const navigate = useNavigate()
    const { professions } = useStore()

    if (tab === 'detox') return <DetoxMode onExit={() => setTab('chat')} />

    return (
        <div style={s.layout}>
            {/* Nav Sidebar */}
            <aside style={s.sidebar}>
                <div>
                    <div style={s.brand}>🌿 CareNest</div>
                    <div style={s.brandSub}>18-25 Personalized Space</div>
                </div>

                <div style={s.navGroup}>
                    <button style={{ ...s.navBtn, ...(tab === 'chat' ? s.navBtnActive : {}) }} onClick={() => setTab('chat')}>
                        <span style={s.icon}>💬</span> Bayesian AI Chat
                    </button>
                    <button style={{ ...s.navBtn, ...(tab === 'journal' ? s.navBtnActive : {}) }} onClick={() => setTab('journal')}>
                        <span style={s.icon}>📔</span> Wellness Journal
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'relief' ? s.navBtnActive : {}) }} onClick={() => setTab('relief')}>
                        <span style={s.icon}>🪴</span> Stress Relief
                    </button>

                    <button style={{ ...s.navBtn, ...(tab === 'progress' ? s.navBtnActive : {}) }} onClick={() => setTab('progress')}>
                        <span style={s.icon}>📈</span> Progress
                    </button>

                    <button style={{ ...s.navBtn, ...s.detoxBtn, marginTop: 12 }} onClick={() => setTab('detox')}>
                        <span style={s.icon}>🧘‍♀️</span> Enter Detox Mode
                    </button>
                </div>

                <div style={s.sidebarFooter}>
                    <div style={s.userType}>{professions[0] || 'Explorer'}</div>
                    <button style={s.logout} onClick={() => navigate('/auth')}>Sign out</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={s.main}>
                {tab === 'chat' && <AIChat1825 />}
                {tab === 'journal' && <WellnessJournal />}
                {tab === 'relief' && <StressRelief />}
                {tab === 'progress' && <ProgressTracking />}
            </main>
        </div>
    )
}

const s = {
    layout: { display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' },
    sidebar: { width: 300, background: 'var(--charcoal)', color: 'white', display: 'flex', flexDirection: 'column', padding: '40px 28px' },
    brand: { fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: 'var(--sage-light)', marginBottom: 8, lineHeight: 1.2 },
    brandSub: { fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 56 },
    navGroup: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
    navBtn: { display: 'flex', alignItems: 'center', padding: '16px 20px', background: 'transparent', color: 'rgba(255,255,255,.6)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .25s ease' },
    navBtnActive: { background: 'rgba(255,255,255,.1)', color: 'white' },
    icon: { fontSize: 18, marginRight: 12, opacity: .9 },
    detoxBtn: { background: 'rgba(107,143,113,.15)', border: '1px solid rgba(107,143,113,.3)', color: 'var(--sage-light)' },
    sidebarFooter: { paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 'auto' },
    userType: { fontSize: 11, color: 'var(--sage-light)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.08em' },
    logout: { background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', transition: '.2s' },
    main: { flex: 1, overflowY: 'auto', position: 'relative' },
}
