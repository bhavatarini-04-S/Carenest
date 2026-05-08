import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import YoungAdultDashboard from './YoungAdultDashboard'
import ProfessionalDashboard25_35 from './ProfessionalDashboard25_35'
import ProfessionalDashboard35_45 from './ProfessionalDashboard35_45'

const MOODS = ['😔', '😕', '😐', '🙂', '😊']
const MOOD_LABELS = ['Struggling', 'Low', 'Okay', 'Good', 'Great']

export function DefaultDashboard() {
    const navigate = useNavigate()
    const { ageCategory, professions, setMood } = useStore()
    const [activeMood, setActiveMood] = useState(null)

    const hour = new Date().getHours()
    const greet = hour < 12 ? 'Good morning ☀️' : hour < 17 ? 'Good afternoon 🌤' : 'Good evening 🌙'

    function pickMood(i) { setActiveMood(i); setMood(i + 1) }

    return (
        <div style={s.root}>
            <nav style={s.nav}>
                <div style={s.navLogo}>🌿 CareNest</div>
                <div style={s.navLinks}>
                    {['Home', 'Resources', 'Journal'].map((l) => (
                        <div key={l} style={{ ...s.navLink, ...(l === 'Home' ? s.navLinkActive : {}) }}>{l}</div>
                    ))}
                    <div style={{ ...s.navLink, cursor: 'pointer' }} onClick={() => navigate('/chat')}>Chat with AI</div>
                </div>
                <div style={s.avatar}>A</div>
            </nav>

            <div style={s.body}>
                <div style={s.greeting}>
                    <div style={s.greetLabel}>{greet} · {ageCategory || '18-25'} · {professions[0] || 'Explorer'}</div>
                    <h1 style={s.greetTitle}>Hey, how are you<br /><em style={{ fontStyle: 'italic', color: '#4A57A0' }}>really</em> feeling today?</h1>
                </div>

                <div style={s.grid}>
                    <div style={s.colMain}>

                        {/* Mood check-in */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Daily mood check-in</div>
                            <div style={s.cardSub}>Tap how you're feeling right now — no judgement here</div>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {MOODS.map((e, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <div onClick={() => pickMood(i)} style={{ ...s.moodBtn, ...(activeMood === i ? s.moodBtnActive : {}) }}>{e}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 4 }}>{MOOD_LABELS[i]}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 14 }}>Your mood is private. We use it only to personalise your AI conversations.</div>
                        </div>

                        {/* Chat CTA */}
                        <div style={s.chatCta} onClick={() => navigate('/chat')}>
                            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', opacity: .7, marginBottom: 8 }}>AI Support · Always available</div>
                            <div style={{ fontFamily: 'Fraunces,serif', fontSize: 28, fontWeight: 400, marginBottom: 6, lineHeight: 1.3 }}>Ready to talk?<br />CareNest is listening.</div>
                            <div style={{ fontSize: 13, opacity: .75, marginBottom: 20 }}>No scripts, no judgement. Just a calm conversation — whenever you need it.</div>
                            <div style={s.chatCtaBtn}>Start chatting →</div>
                        </div>

                        {/* Resources */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Quick resources for you</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                                {[
                                    { bg: 'linear-gradient(135deg,#EEF2FF,#E0E5F8)', icon: '🧘', title: '4-7-8 Breathing', desc: '2 minutes to calm your nervous system right now' },
                                    { bg: 'linear-gradient(135deg,#EDF7EF,#DCF0E0)', icon: '📔', title: 'Guided journaling', desc: "Prompts to help you process what's on your mind" },
                                    { bg: 'linear-gradient(135deg,#FEF5E8,#F9E8D0)', icon: '📞', title: 'iCall Helpline', desc: '9152987821 · Free counselling, Mon–Sat 8am–10pm' },
                                    { bg: 'linear-gradient(135deg,#FDE8F3,#F8D0E8)', icon: '🤝', title: 'Peer communities', desc: 'Connect with others who understand you' },
                                ].map((r) => (
                                    <div key={r.title} style={{ borderRadius: 14, padding: 18, background: r.bg, cursor: 'pointer' }}>
                                        <div style={{ fontSize: 22, marginBottom: 8 }}>{r.icon}</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{r.title}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{r.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent sessions */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Recent conversations</div>
                            {[
                                { dot: '#7B8EC8', text: 'Talked through exam anxiety and coping strategies', time: 'Today' },
                                { dot: '#A8C5AE', text: 'Explored feelings around friendship and belonging', time: 'Yesterday' },
                                { dot: '#E8CA80', text: 'Tried 4-7-8 breathing — mood improved from 2 → 4', time: '2 days ago' },
                                { dot: '#F4C0D1', text: 'Discussed social comparison and self-esteem', time: '4 days ago' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < 3 ? '1px solid #F0F2FF' : 'none' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                                    <div style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.4 }}>{item.text}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={s.colSide}>

                        {/* Streak */}
                        <div style={s.streakCard}>
                            <div style={{ fontFamily: 'Fraunces,serif', fontSize: 56, fontWeight: 600, color: '#1A5E38', lineHeight: 1 }}>12</div>
                            <div style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 500, marginTop: 4 }}>🔥 Day check-in streak</div>
                            <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
                                {Array.from({ length: 7 }, (_, i) => (
                                    <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < 6 ? '#2D6A4F' : '#B5D9BB' }} />
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: '#2D6A4F', marginTop: 10 }}>Check in today to keep your streak alive!</div>
                        </div>

                        {/* Insights */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Your insights this week</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
                                {[
                                    { label: 'Avg mood', val: '3.8 / 5', pct: 76, color: '#4A57A0', track: '#EEF2FF' },
                                    { label: 'Sessions', val: '7 this week', pct: 70, color: '#2D6A4F', track: '#EDF7EF' },
                                ].map((ins) => (
                                    <div key={ins.label}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ins.label}</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: ins.color }}>{ins.val}</span>
                                        </div>
                                        <div style={{ height: 6, background: ins.track, borderRadius: 3 }}>
                                            <div style={{ width: `${ins.pct}%`, height: '100%', background: ins.color, borderRadius: 3 }} />
                                        </div>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Top theme</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--terra-dark)' }}>Exam stress</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div style={s.card}>
                            <div style={s.cardTitle}>Quick actions</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                                {[
                                    { bg: '#EEF2FF', icon: '💬', label: 'Talk to CareNest AI', sub: 'Start a new conversation', action: () => navigate('/chat') },
                                    { bg: '#EDF7EF', icon: '📔', label: 'Journal entry', sub: "Write today's thoughts", action: null },
                                    { bg: '#FEF5E8', icon: '🧘', label: 'Breathe with me', sub: '2-min guided exercise', action: null },
                                    { bg: '#FDE8F3', icon: '📞', label: 'Crisis support', sub: 'iCall: 9152987821', action: null },
                                ].map((qa) => (
                                    <div key={qa.label} style={s.qaItem} onClick={qa.action || undefined}>
                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: qa.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{qa.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{qa.label}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{qa.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Affirmation */}
                        <div style={s.affirmCard}>
                            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#4A57A0', marginBottom: 10 }}>Today's affirmation</div>
                            <div style={{ fontFamily: 'Fraunces,serif', fontSize: 19, fontWeight: 400, color: '#2C3566', lineHeight: 1.4, fontStyle: 'italic' }}>
                                "You are allowed to be both a masterpiece and a work in progress."
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    root: { background: '#F0F2FF', minHeight: '100vh', animation: 'fadeIn .5s ease' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', background: 'white', borderBottom: '1px solid rgba(123,142,200,.15)' },
    navLogo: { fontFamily: 'Fraunces,serif', fontSize: 20, fontWeight: 600, color: '#4A57A0' },
    navLinks: { display: 'flex', gap: 6 },
    navLink: { padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#6B7280', cursor: 'pointer' },
    navLinkActive: { background: '#EEF2FF', color: '#4A57A0' },
    avatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7B8EC8,#4A57A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer' },
    body: { padding: '32px 40px', maxWidth: 1200, margin: '0 auto' },
    greeting: { marginBottom: 32 },
    greetLabel: { fontSize: 13, color: '#7B8EC8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 },
    greetTitle: { fontFamily: 'Fraunces,serif', fontSize: 40, fontWeight: 400, color: '#1A2332', lineHeight: 1.2 },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 },
    colMain: { display: 'flex', flexDirection: 'column', gap: 20 },
    colSide: { display: 'flex', flexDirection: 'column', gap: 20 },
    card: { background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 2px 16px rgba(123,142,200,.1)' },
    cardTitle: { fontSize: 14, fontWeight: 600, color: '#1A2332', marginBottom: 4 },
    cardSub: { fontSize: 12, color: '#9CA3AF', marginBottom: 20 },
    moodBtn: { width: 52, height: 52, borderRadius: 14, border: '2px solid transparent', background: '#F5F6FF', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '.2s' },
    moodBtnActive: { borderColor: '#7B8EC8', background: '#EEF2FF', transform: 'scale(1.1)' },
    chatCta: { background: 'linear-gradient(135deg,#4A57A0,#7B8EC8)', borderRadius: 20, padding: 28, color: 'white', cursor: 'pointer', transition: '.3s' },
    chatCtaBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#4A57A0', padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600 },
    streakCard: { background: 'linear-gradient(135deg,#E8F5EE,#D5EDDC)', borderRadius: 20, padding: 24 },
    qaItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--off-white)', borderRadius: 14, cursor: 'pointer', border: '1.5px solid transparent', transition: '.2s' },
    affirmCard: { background: 'linear-gradient(145deg,#EEF2FF,#E0E5F8)', borderRadius: 20, padding: 24, border: '1.5px solid #C5CCF0' },
}

export default function Dashboard() {
    const { ageCategory } = useStore()
    if (ageCategory === '18-25') return <YoungAdultDashboard />
    if (ageCategory === '25-35') return <ProfessionalDashboard25_35 />
    if (ageCategory === '35-45') return <ProfessionalDashboard35_45 />
    if (ageCategory === '45+') return <Navigate to="/dashboard/senior" replace />
    return <DefaultDashboard />
}