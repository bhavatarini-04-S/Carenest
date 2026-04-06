import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useStore from '../store/useStore'

export default function Auth() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [tab, setTab] = useState(params.get('tab') || 'signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const setUser = useStore((s) => s.setUser)
    const setAnonymous = useStore((s) => s.setAnonymous)

    async function handleSubmit() {
        setLoading(true); setError('')
        try {
            if (tab === 'signup') {
                const { data, error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                setUser(data.user)
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                setUser(data.user)
            }
            navigate('/onboarding/age')
        } catch (e) {
            if (e.message?.toLowerCase().includes('rate limit') || e.status === 429) {
                setError("Supabase email rate limit exceeded. For testing, please click 'Continue anonymously' below, or disable 'Confirm email' in your Supabase Auth settings.")
            } else {
                setError(e.message)
            }
        }
        finally { setLoading(false) }
    }

    async function handleAnonymous() {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInAnonymously()
            if (error) throw error
            setUser(data.user); setAnonymous(true)
            navigate('/onboarding/age')
        } catch (e) {
            if (e.message?.toLowerCase().includes('rate limit') || e.status === 429) {
                setError("Rate limit exceeded. Please wait a moment or check your Supabase Auth rate limit settings.")
            } else {
                setError(e.message)
            }
        }
        finally { setLoading(false) }
    }

    return (
        <div style={s.root}>
            <div style={s.left}>
                <div style={s.leftBlob1} /><div style={s.leftBlob2} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={s.leftLogo}>🌿 CareNest</div>
                    <div style={s.leftQuote}>
                        "Healing begins when you feel{' '}
                        <em style={{ color: 'rgba(255,255,255,.7)' }}>truly heard</em> — not just listened to."
                    </div>
                    <div style={s.leftAttr}>— CareNest Philosophy</div>
                </div>
                <div style={s.leftStats}>
                    {[['50K+', 'Users supported'], ['98%', 'Feel heard'], ['24/7', 'Always available']].map(([n, l]) => (
                        <div key={l}>
                            <div style={s.statNum}>{n}</div>
                            <div style={s.statLabel}>{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={s.right}>
                <div style={s.box}>
                    <div style={s.tabs}>
                        {['signup', 'signin'].map((t) => (
                            <div key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }} onClick={() => setTab(t)}>
                                {t === 'signup' ? 'Create account' : 'Sign in'}
                            </div>
                        ))}
                    </div>
                    <h2 style={s.formTitle}>{tab === 'signup' ? 'Welcome to CareNest 🌿' : 'Good to have you back 💙'}</h2>
                    <p style={s.formSub}>{tab === 'signup' ? 'Create your safe space. Takes under a minute — completely free.' : 'Your space is waiting for you, exactly as you left it.'}</p>

                    {tab === 'signup' && (
                        <div style={s.formGroup}>
                            <label style={s.label}>Your name (optional)</label>
                            <input style={s.input} placeholder="How should we call you?" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                    )}
                    <div style={s.formGroup}>
                        <label style={s.label}>Email address</label>
                        <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div style={s.formGroup}>
                        <label style={s.label}>Password</label>
                        <input style={s.input} type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    {error && <p style={{ fontSize: 13, color: '#E24B4A', marginBottom: 12 }}>{error}</p>}

                    <button style={s.submit} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Please wait...' : tab === 'signup' ? 'Create my safe space →' : 'Sign in →'}
                    </button>
                    <div style={s.divider}>or</div>
                    <button style={s.anonBtn} onClick={handleAnonymous} disabled={loading}>
                        👤 Continue anonymously
                    </button>
                    <div style={s.privacyNote}>
                        🔒 Anonymous mode uses only a temporary session ID. No email, no name, no trace.
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    root: { display: 'flex', minHeight: '100vh' },
    left: { flex: 1, background: 'linear-gradient(145deg,var(--sage-dark),var(--forest))', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 48 },
    leftBlob1: { position: 'absolute', width: 400, height: 400, background: 'rgba(255,255,255,.07)', borderRadius: '50%', top: -100, right: -100, animation: 'blob 10s ease-in-out infinite', pointerEvents: 'none' },
    leftBlob2: { position: 'absolute', width: 300, height: 300, background: 'rgba(255,255,255,.05)', borderRadius: '50%', bottom: -60, left: -60, animation: 'blob 13s ease-in-out infinite reverse', pointerEvents: 'none' },
    leftLogo: { fontFamily: 'Fraunces,serif', fontSize: 26, fontWeight: 600, color: 'white', marginBottom: 80 },
    leftQuote: { fontFamily: 'Fraunces,serif', fontSize: 36, fontWeight: 300, color: 'white', lineHeight: 1.3, marginBottom: 12 },
    leftAttr: { fontSize: 14, color: 'rgba(255,255,255,.5)' },
    leftStats: { display: 'flex', gap: 32, position: 'relative', zIndex: 2 },
    statNum: { fontFamily: 'Fraunces,serif', fontSize: 32, fontWeight: 600, color: 'white' },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,.5)', letterSpacing: '.05em', textTransform: 'uppercase' },
    right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: 'var(--off-white)' },
    box: { width: '100%', maxWidth: 420 },
    tabs: { display: 'flex', background: 'var(--cream-dark)', borderRadius: 14, padding: 4, marginBottom: 36 },
    tab: { flex: 1, padding: 12, textAlign: 'center', borderRadius: 11, fontSize: 14, fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)', transition: '.2s' },
    tabActive: { background: 'white', color: 'var(--sage-dark)', boxShadow: '0 2px 8px rgba(0,0,0,.08)' },
    formTitle: { fontFamily: 'Fraunces,serif', fontSize: 30, fontWeight: 400, color: 'var(--charcoal)', marginBottom: 6 },
    formSub: { fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 },
    formGroup: { marginBottom: 18 },
    label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 7 },
    input: { width: '100%', padding: '14px 18px', background: 'white', border: '1.5px solid rgba(107,143,113,.2)', borderRadius: 12, fontSize: 15, color: 'var(--text-primary)', outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box' },
    submit: { width: '100%', padding: 16, background: 'var(--sage-dark)', color: 'white', borderRadius: 12, fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', marginTop: 8 },
    divider: { textAlign: 'center', margin: '20px 0', color: 'var(--text-light)', fontSize: 13 },
    anonBtn: { width: '100%', padding: 14, background: 'white', border: '1.5px solid rgba(107,143,113,.2)', borderRadius: 12, fontSize: 14, color: 'var(--slate)', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
    privacyNote: { fontSize: 12, color: 'var(--text-muted)', background: 'rgba(107,143,113,.07)', borderRadius: 10, padding: '12px 14px', marginTop: 16, lineHeight: 1.5 },
}