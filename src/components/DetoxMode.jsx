import React, { useState, useEffect } from 'react'

export default function DetoxMode({ onExit }) {
    const [duration, setDuration] = useState(15 * 60) // default 15 minutes
    const [isActive, setIsActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    const [phase, setPhase] = useState('breathe in')
    const [scale, setScale] = useState(1)

    // Timer logic
    useEffect(() => {
        if (!isActive) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleExit() // Auto exit on completion
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isActive])

    // Breathing Animation Cycle
    useEffect(() => {
        if (!isActive) return
        const interval = setInterval(() => {
            setPhase(p => p === 'breathe in' ? 'hold' : p === 'hold' ? 'breathe out' : 'breathe in')
        }, 4000)
        return () => clearInterval(interval)
    }, [isActive])

    useEffect(() => {
        if (phase === 'breathe in') setScale(1.8)
        else if (phase === 'breathe out') setScale(1)
    }, [phase])

    function handleStart() {
        setTimeLeft(duration)
        setIsActive(true)
        // Request fullscreen to block out other PC/Mac distractions
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => { })
        }
    }

    function handleExit() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { })
        }
        onExit()
    }

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    // 1. Setup Screen
    if (!isActive) {
        return (
            <div style={s.root}>
                <div style={s.grain} />
                <div style={s.setupCard}>
                    <h2 style={s.setupTitle}>Detox & Focus</h2>
                    <p style={s.setupSub}>Mute notifications and lock out distractions. How long do you want to disconnect?</p>

                    <div style={s.timeGrid}>
                        {[5, 15, 30, 60].map(mins => (
                            <button
                                key={mins}
                                style={{ ...s.timeBtn, ...(duration === mins * 60 ? s.timeBtnActive : {}) }}
                                onClick={() => setDuration(mins * 60)}
                            >
                                {mins} min
                            </button>
                        ))}
                    </div>

                    <div style={s.setupActions}>
                        <button style={s.cancelBtn} onClick={onExit}>Cancel</button>
                        <button style={s.startBtn} onClick={handleStart}>Enter Detox</button>
                    </div>
                </div>
            </div>
        )
    }

    // 2. Active Detox Screen
    return (
        <div style={s.rootActive}>
            <div style={s.grain} />

            <div style={s.topBar}>
                <div style={s.timer}>{formatTime(timeLeft)}</div>
            </div>

            <div style={s.blobContainer}>
                <div style={{ ...s.blob, transform: `scale(${scale})` }} />
                <div style={s.centerText}>{Math.floor(timeLeft) > 0 ? phase : 'Done'}</div>
            </div>

            <button style={s.exitEarly} onClick={handleExit}>Exit Early</button>
        </div>
    )
}

const s = {
    root: { position: 'fixed', inset: 0, background: 'var(--sage-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'hidden', animation: 'fadeIn .5s ease' },
    rootActive: { position: 'fixed', inset: 0, background: '#1A3326', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'hidden', animation: 'fadeIn 1s ease' },
    grain: { position: 'absolute', inset: 0, opacity: .3, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`, zIndex: 0, pointerEvents: 'none' },

    // Setup state styles
    setupCard: { position: 'relative', zIndex: 1, background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.1)', padding: '48px 40px', borderRadius: 24, width: '100%', maxWidth: 440, textAlign: 'center' },
    setupTitle: { fontFamily: 'Fraunces, serif', fontSize: 32, color: 'white', marginBottom: 16 },
    setupSub: { fontSize: 15, color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginBottom: 40 },
    timeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 },
    timeBtn: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: 'white', padding: '16px', borderRadius: 16, fontSize: 16, fontWeight: 500, cursor: 'pointer', transition: '.2s', fontFamily: 'DM Sans, sans-serif' },
    timeBtnActive: { background: 'white', color: 'var(--sage-dark)', borderColor: 'white' },
    setupActions: { display: 'flex', gap: 16 },
    cancelBtn: { flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,.2)', color: 'white', padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
    startBtn: { flex: 2, background: 'white', border: 'none', color: 'var(--sage-dark)', padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,.1)' },

    // Active state styles
    topBar: { position: 'absolute', top: 48, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 2 },
    timer: { fontSize: 24, color: 'rgba(255,255,255,.9)', fontFamily: 'DM Sans, monospace', fontWeight: 500, letterSpacing: '.1em', background: 'rgba(255,255,255,.05)', padding: '8px 24px', borderRadius: 30, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,.05)' },
    blobContainer: { position: 'relative', width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    blob: { width: 140, height: 140, background: 'linear-gradient(135deg,rgba(168,197,174,.4),rgba(255,255,255,.2))', borderRadius: '50%', transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'blur(12px)', position: 'absolute' },
    centerText: { fontFamily: 'Fraunces, serif', fontSize: 32, color: 'white', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 300, transition: '.5s', position: 'relative', zIndex: 2 },
    exitEarly: { position: 'absolute', bottom: 48, background: 'transparent', color: 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em', textDecoration: 'underline', outline: 'none', zIndex: 2, transition: '.2s' }
}
