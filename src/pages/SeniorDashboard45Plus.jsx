import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import SeniorWellnessChat from '../components/SeniorWellnessChat'
import SeniorSpiritualSupport from '../components/SeniorSpiritualSupport'
import CalmEnvironment from '../components/CalmEnvironment'
import EmergencySupportSection from '../components/EmergencySupportSection'
import HealthMonitoring from '../components/HealthMonitoring'
import EmergencySafety from '../components/EmergencySafety'
import FitnessWellness from '../components/FitnessWellness'
import MentalWellness from '../components/MentalWellness'

export default function SeniorDashboard45Plus() {
    const [tab, setTab] = useState('chat')
    const navigate = useNavigate()
    const { professions } = useStore()

    const TABS = [
        { id: 'sos', icon: '🆘', label: 'SOS Emergency System' },
        { id: 'medicine', icon: '💊', label: 'Medicine Reminder' },
        { id: 'ai', icon: '🤖', label: 'AI Health Assistant' },
        { id: 'family', icon: '👪', label: 'Family Monitoring Dashboard' },
        { id: 'doctor', icon: '🩺', label: 'Doctor Consultation' },
        { id: 'analytics', icon: '📊', label: 'Health Analytics' },
        { id: 'chat', icon: '💬', label: 'Wellbeing Chat' },
        { id: 'health', icon: '❤️', label: 'Health Monitor' },
        { id: 'fitness', icon: '🏃', label: 'Fitness' },
        { id: 'mental', icon: '🧠', label: 'Mental Wellness' },
        { id: 'spiritual', icon: '🌸', label: 'Spiritual Support' },
        { id: 'calm', icon: '🌊', label: 'Calm Space' },
    ]

    return (
        <div style={s.layout}>
            <aside style={s.sidebar}>
                <div>
                    <div style={s.brand}>🌿 CareNest</div>
                    <div style={s.brandSub}>45+ Senior Wellness</div>
                </div>

                <div style={s.navGroup}>
                    {TABS.map((item) => (
                        <button
                            key={item.id}
                            style={{ ...s.navBtn, ...(tab === item.id ? s.navBtnActive : {}) }}
                            onClick={() => setTab(item.id)}
                        >
                            <span style={s.icon}>{item.icon}</span>
                            <span>{item.label}</span>
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

                    {tab === 'health' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>Your Health Dashboard</h1>
                                <p style={s.displaySubtitle}>Monitor your vital signs and manage your health records.</p>
                            </div>
                            <HealthMonitoring />
                        </div>
                    )}

                    {tab === 'sos' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}><span style={{ color: '#DC2626' }}>🆘 SOS Emergency System</span></h1>
                                <p style={s.displaySubtitle}>Immediate access to alerts, emergency contacts, and safety planning.</p>
                            </div>
                            <EmergencySafety />
                        </div>
                    )}

                    {tab === 'medicine' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}><span style={{ color: '#2563EB' }}>💊 Medicine Reminder</span></h1>
                                <p style={s.displaySubtitle}>Stay on schedule with medication reminders and refill alerts.</p>
                            </div>
                            <div style={s.card}>
                                {[
                                    { med: 'Amlodipine', time: '8:00 AM', note: 'Blood pressure support' },
                                    { med: 'Vitamin D', time: '1:00 PM', note: 'Bone health' },
                                    { med: 'Omega-3', time: '7:30 PM', note: 'Heart support' },
                                ].map((item) => (
                                    <div key={item.med} style={s.reminderRow}>
                                        <div>
                                            <div style={s.cardTitle}>{item.med}</div>
                                            <div style={s.cardSub}>{item.note}</div>
                                        </div>
                                        <div style={s.reminderTime}>{item.time}</div>
                                    </div>
                                ))}
                                <div style={s.reminderNote}>Tap a medicine to mark it as taken, or set a new reminder in your assistant.</div>
                            </div>
                        </div>
                    )}

                    {tab === 'ai' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}><span style={{ color: '#1D4ED8' }}>🤖 AI Health Assistant</span></h1>
                                <p style={s.displaySubtitle}>Ask for advice, schedule reminders, or get wellness coaching through your AI companion.</p>
                            </div>
                            <div style={s.chatContainer}>
                                <SeniorWellnessChat />
                            </div>
                        </div>
                    )}

                    {tab === 'family' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>👪 Family Monitoring Dashboard</h1>
                                <p style={s.displaySubtitle}>Share updates with family, track care check-ins, and keep loved ones informed.</p>
                            </div>
                            <div style={s.card}>
                                {[
                                    { name: 'Arun', status: 'Checked in 18 mins ago', note: 'Comfortable and active' },
                                    { name: 'Priya', status: 'Called 2 hours ago', note: 'Needs medication reminder' },
                                    { name: 'Rahul', status: 'Awaiting update', note: 'Follow up later today' },
                                ].map((item) => (
                                    <div key={item.name} style={s.familyRow}>
                                        <div>
                                            <div style={s.cardTitle}>{item.name}</div>
                                            <div style={s.cardSub}>{item.status}</div>
                                        </div>
                                        <div style={s.familyNote}>{item.note}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'doctor' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>🩺 Doctor Consultation</h1>
                                <p style={s.displaySubtitle}>Book a follow-up, review care notes, and prepare questions for your provider.</p>
                            </div>
                            <div style={s.card}>
                                <div style={s.consultRow}>
                                    <div>
                                        <div style={s.cardTitle}>Dr. Meera Kapoor</div>
                                        <div style={s.cardSub}>Cardiologist · Next available slot: Wed 11:00 AM</div>
                                    </div>
                                    <button style={s.primaryBtn}>Request consultation</button>
                                </div>
                                <div style={s.consultNote}>Upload recent readings or symptoms before your visit for a smoother consultation.</div>
                            </div>
                        </div>
                    )}

                    {tab === 'analytics' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>📊 Health Analytics</h1>
                                <p style={s.displaySubtitle}>Review your progress with trend summaries and wellbeing insights.</p>
                            </div>
                            <HealthMonitoring />
                        </div>
                    )}

                    {tab === 'fitness' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>Fitness & Wellness</h1>
                                <p style={s.displaySubtitle}>Track your activity, yoga, and personalized wellness routines.</p>
                            </div>
                            <FitnessWellness />
                        </div>
                    )}

                    {tab === 'mental' && (
                        <div style={s.tabContent}>
                            <div style={s.header}>
                                <h1 style={s.displayTitle}>Mental Wellness</h1>
                                <p style={s.displaySubtitle}>Manage stress, track your mood, and find inner peace.</p>
                            </div>
                            <MentalWellness />
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
                </div>
            </main>
        </div>
    )
}

const s = {
    layout: { display: 'flex', height: '100vh', background: 'var(--cream)', overflow: 'hidden' },
    sidebar: { width: 300, background: 'var(--charcoal)', color: 'white', display: 'flex', flexDirection: 'column', padding: '40px 28px' },
    brand: { fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 600, color: 'var(--sage-light)', marginBottom: 8, lineHeight: 1.2 },
    brandSub: { fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 32 },
    navGroup: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto', paddingRight: 4 },
    navBtn: { display: 'flex', alignItems: 'center', padding: '16px 20px', background: 'transparent', color: 'rgba(255,255,255,.7)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .25s ease', textAlign: 'left' },
    navBtnActive: { background: 'rgba(255,255,255,.12)', color: 'white' },
    icon: { fontSize: 18, marginRight: 12, opacity: .9 },
    sidebarFooter: { paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 'auto' },
    userType: { fontSize: 11, color: 'var(--sage-light)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.08em' },
    logout: { background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', transition: '.2s' },
    main: { flex: 1, overflowY: 'auto', padding: '40px' },
    tabContent: { maxWidth: 1100, margin: '0 auto' },
    header: { marginBottom: 40 },
    title: { fontFamily: 'Fraunces, serif', fontSize: 44, fontWeight: 500, color: '#0F172A', margin: 0, marginBottom: 16, lineHeight: 1.15 },
    subtitle: { fontSize: 16, color: '#475569', lineHeight: 1.6, maxWidth: 680 },
    chatContainer: { minHeight: 620, boxShadow: '0 20px 60px rgba(15,23,42,.12)', borderRadius: 24, overflow: 'hidden', background: 'white' },
    card: { background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
    cardSub: { fontSize: 13, lineHeight: 1.8, color: '#475569' },
    reminderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid rgba(15,23,42,.08)' },
    reminderTime: { fontSize: 14, fontWeight: 700, color: '#1D4ED8' },
    reminderNote: { fontSize: 13, color: '#475569', marginTop: 14 },
    familyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 0', borderBottom: '1px solid rgba(15,23,42,.08)' },
    familyNote: { fontSize: 12, color: '#475569', marginTop: 6, textAlign: 'right', maxWidth: 220 },
    consultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, padding: '18px 0' },
    primaryBtn: { borderRadius: 14, border: 'none', padding: '14px 24px', background: '#2563EB', color: 'white', fontWeight: 700, cursor: 'pointer' },
    consultNote: { fontSize: 13, color: '#475569', marginTop: 16, lineHeight: 1.6 },
}
