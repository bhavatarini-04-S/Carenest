import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

function FloatCard({ children, style }) {
    return (
        <div style={{
            position: 'absolute', background: 'white', borderRadius: 20,
            padding: '16px 20px', boxShadow: '0 8px 40px rgba(0,0,0,.08)',
            width: 180, animation: 'float 4s ease-in-out infinite', ...style,
        }}>
            {children}
        </div>
    )
}

export default function Landing() {
    const navigate = useNavigate()
    const setAnonymous = useStore((s) => s.setAnonymous)

    function goAnonymous() {
        setAnonymous(true)
        navigate('/onboarding/age')
    }

    return (
        <div style={s.root}>
            <div style={s.blob1} />
            <div style={s.blob2} />
            <div style={s.blob3} />

            <div style={s.inner}>
                {/* Nav */}
                <nav style={s.nav}>
                    <div style={s.logoWrap}>
                        <div style={s.logoIcon}>🌿</div>
                        <span style={s.logoText}>CareNest</span>
                    </div>
                    <div style={s.navLinks}>
                        <button style={s.navGhost} onClick={() => navigate('/auth?tab=signin')}>Sign In</button>
                        <button style={s.navFilled} onClick={() => navigate('/auth?tab=signup')}>Get Started</button>
                    </div>
                </nav>

                {/* Hero */}
                <div style={s.hero}>
                    <div>
                        <div style={s.badge}><span style={s.badgeDot} /> AI-powered mental wellness</div>
                        <h1 style={s.heroTitle}>
                            You don't have<br />to carry{' '}
                            <em style={{ fontStyle: 'italic', color: 'var(--sage-dark)' }}>this</em><br />
                            <strong style={{ fontWeight: 600 }}>alone.</strong>
                        </h1>
                        <p style={s.heroSub}>
                            CareNest offers compassionate AI-powered mental health support tailored
                            to your age, profession, and life stage — private, personalised, and always here.
                        </p>
                        <div style={s.heroActions}>
                            <button style={s.btnPrimary} onClick={() => navigate('/auth?tab=signup')}>Begin your journey →</button>
                            <button style={s.btnSecondary} onClick={() => navigate('/auth?tab=signin')}>Already have an account</button>
                            <button style={s.btnAnon} onClick={goAnonymous}>🛡 Continue anonymously — no account needed</button>
                            <p style={s.anonNote}>Your privacy is sacred. Anonymous mode stores nothing personal.</p>
                        </div>
                    </div>

                    <div style={s.heroRight}>
                        <div style={s.centerOrb}>
                            <div style={{ fontFamily: 'Fraunces,serif', fontSize: 40, color: 'var(--sage-dark)', textAlign: 'center', lineHeight: 1.2 }}>
                                🌿<br /><span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 16, fontWeight: 400 }}>safe space</span>
                            </div>
                        </div>
                        <FloatCard style={{ top: -20, right: -20, animationDelay: '0s' }}>
                            <div style={s.fcLabel}>Today's mood</div>
                            <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
                                {['😊', '🌱', '✨'].map((e, i) => <div key={i} style={s.moodDot}>{e}</div>)}
                            </div>
                            <div style={s.fcSub}>Feeling a little better</div>
                        </FloatCard>
                        <FloatCard style={{ bottom: 60, left: -30, animationDelay: '1.5s' }}>
                            <div style={s.fcLabel}>Sessions this week</div>
                            <div style={s.fcValue}>7</div>
                            <div style={s.fcSub}>+3 from last week 🎉</div>
                        </FloatCard>
                        <FloatCard style={{ top: '50%', right: -40, animationDelay: '0.8s' }}>
                            <div style={s.fcLabel}>Streak</div>
                            <div style={{ ...s.fcValue, fontSize: 20 }}>🔥 12 days</div>
                            <div style={s.fcSub}>Keep going!</div>
                        </FloatCard>
                    </div>
                </div>

                {/* Features */}
                <div style={s.featuresStrip}>
                    {[
                        { icon: '🔒', title: 'Fully private', desc: 'Anonymous login available. No personal data stored. Your thoughts stay yours.' },
                        { icon: '🎯', title: 'Personalised support', desc: 'Tailored to your age group and profession — because context changes everything.' },
                        { icon: '🌿', title: 'AI triage', desc: 'Smart crisis detection. When you need more than a chat, we connect you to real help.' },
                        { icon: '🇮🇳', title: 'India-first resources', desc: 'iCall, Vandrevala Foundation, NIMHANS — vetted local support at your fingertips.' },
                    ].map((f) => (
                        <div key={f.title} style={s.featureItem}>
                            <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                            <div style={s.fiTitle}>{f.title}</div>
                            <div style={s.fiDesc}>{f.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const s = {
    root: { minHeight: '100vh', background: 'var(--cream)', position: 'relative', overflow: 'hidden', animation: 'fadeIn .5s ease' },
    blob1: { position: 'fixed', width: 600, height: 600, borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%', background: 'linear-gradient(135deg,rgba(107,143,113,.25),rgba(168,197,174,.15))', top: -100, right: -100, animation: 'blob 12s ease-in-out infinite', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0 },
    blob2: { position: 'fixed', width: 500, height: 500, borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%', background: 'linear-gradient(135deg,rgba(196,120,90,.2),rgba(232,168,136,.1))', bottom: -80, left: -80, animation: 'blob 15s ease-in-out infinite reverse', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0 },
    blob3: { position: 'fixed', width: 300, height: 300, borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%', background: 'linear-gradient(135deg,rgba(201,168,76,.15),rgba(232,202,128,.1))', top: '40%', left: '45%', animation: 'blob 10s ease-in-out infinite 3s', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0 },
    inner: { position: 'relative', zIndex: 2, minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto' },
    nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 48px' },
    logoWrap: { display: 'flex', alignItems: 'center', gap: 10 },
    logoIcon: { width: 36, height: 36, background: 'linear-gradient(135deg,var(--sage),var(--sage-dark))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, animation: 'glow 3s ease-in-out infinite' },
    logoText: { fontFamily: 'Fraunces,serif', fontSize: 22, fontWeight: 600, color: 'var(--sage-dark)' },
    navLinks: { display: 'flex', gap: 8 },
    navGhost: { padding: '10px 20px', borderRadius: 50, fontSize: 14, fontWeight: 500, background: 'transparent', color: 'var(--slate)', border: '1.5px solid transparent', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    navFilled: { padding: '10px 20px', borderRadius: 50, fontSize: 14, fontWeight: 500, background: 'var(--sage-dark)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    hero: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', padding: '40px 48px 60px' },
    heroRight: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107,143,113,.12)', border: '1px solid rgba(107,143,113,.3)', borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: 'var(--sage-dark)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 28 },
    badgeDot: { width: 7, height: 7, background: 'var(--sage)', borderRadius: '50%', display: 'inline-block' },
    heroTitle: { fontFamily: 'Fraunces,serif', fontSize: 68, lineHeight: 1.05, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 20 },
    heroSub: { fontSize: 18, lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: 460, marginBottom: 40 },
    heroActions: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 340 },
    btnPrimary: { padding: '18px 32px', background: 'var(--sage-dark)', color: 'white', borderRadius: 16, fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    btnSecondary: { padding: '16px 32px', background: 'rgba(196,120,90,.1)', color: 'var(--terra-dark)', borderRadius: 16, fontSize: 16, fontWeight: 500, border: '1.5px solid rgba(196,120,90,.3)', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    btnAnon: { padding: '14px 32px', background: 'transparent', color: 'var(--text-muted)', borderRadius: 16, fontSize: 14, border: '1.5px solid rgba(107,143,113,.2)', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    anonNote: { fontSize: 11, color: 'var(--text-light)', textAlign: 'center' },
    centerOrb: { width: 280, height: 280, background: 'linear-gradient(135deg,rgba(107,143,113,.3),rgba(168,197,174,.2))', borderRadius: '50%', margin: '60px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blob 8s ease-in-out infinite' },
    fcLabel: { fontSize: 11, color: 'var(--text-light)', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4 },
    fcValue: { fontFamily: 'Fraunces,serif', fontSize: 28, fontWeight: 600, color: 'var(--sage-dark)' },
    fcSub: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
    moodDot: { width: 28, height: 28, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 },
    featuresStrip: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(107,143,113,.15)' },
    featureItem: { padding: '32px 36px', borderRight: '1px solid rgba(107,143,113,.1)' },
    fiTitle: { fontFamily: 'Fraunces,serif', fontSize: 17, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 },
    fiDesc: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 },
}