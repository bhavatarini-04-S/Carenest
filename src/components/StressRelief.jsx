import React, { useState, useEffect, useRef } from 'react'

// ─── Zen Garden Builder ───────────────────────────────────────────────────────

const GARDEN_ELEMENTS = [
    { emoji: '🪨', label: 'Rock' },
    { emoji: '⬛', label: 'Stone' },
    { emoji: '🌿', label: 'Fern' },
    { emoji: '🌱', label: 'Sprout' },
    { emoji: '🌸', label: 'Blossom' },
    { emoji: '🌼', label: 'Daisy' },
    { emoji: '🌺', label: 'Hibiscus' },
    { emoji: '🌲', label: 'Pine' },
    { emoji: '🌳', label: 'Oak' },
    { emoji: '🎋', label: 'Bamboo' },
    { emoji: '⛰️', label: 'Mountain' },
    { emoji: '🏔️', label: 'Peak' },
    { emoji: '💧', label: 'Water' },
    { emoji: '🏮', label: 'Lantern' },
    { emoji: '🌙', label: 'Moon' },
    { emoji: '🦋', label: 'Butterfly' },
]

const COLS = 14
const ROWS = 8

function ZenGarden() {
    const [selected, setSelected] = useState(null)
    const [grid, setGrid] = useState(() => Array(ROWS * COLS).fill(null))
    const [hovered, setHovered] = useState(null)

    const placeItem = (idx) => {
        if (!selected) return
        setGrid(prev => {
            const next = [...prev]
            next[idx] = prev[idx] === selected ? null : selected
            return next
        })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, color: 'var(--charcoal)', marginBottom: 6 }}>Zen Garden Builder</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Select an element from the palette, then click anywhere in the garden to place it. Create your own peaceful landscape.</p>
            </div>

            {/* Palette */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: '12px 0' }}>
                {GARDEN_ELEMENTS.map(el => (
                    <button
                        key={el.emoji}
                        onClick={() => setSelected(prev => prev === el.emoji ? null : el.emoji)}
                        title={el.label}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            padding: '10px 14px', borderRadius: 12, cursor: 'pointer', fontSize: 24,
                            border: selected === el.emoji ? '2.5px solid var(--sage-dark)' : '2px solid transparent',
                            background: selected === el.emoji ? 'rgba(107,143,113,0.14)' : 'var(--cream)',
                            boxShadow: selected === el.emoji ? '0 0 0 3px rgba(107,143,113,0.18)' : 'none',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {el.emoji}
                        <span style={{ fontSize: 9, color: 'var(--text-light)', fontWeight: 600 }}>{el.label}</span>
                    </button>
                ))}
            </div>

            {/* Garden Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: 3,
                background: 'linear-gradient(155deg, #E8DDB5 0%, #D4C88A 60%, #C2B47A 100%)',
                borderRadius: 20,
                padding: 16,
                boxShadow: 'inset 0 6px 20px rgba(0,0,0,0.10), 0 4px 20px rgba(0,0,0,0.06)',
                cursor: selected ? 'cell' : 'default',
                userSelect: 'none',
                minHeight: 320,
            }}>
                {grid.map((cell, i) => (
                    <div
                        key={i}
                        onClick={() => placeItem(i)}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                            height: 40,
                            borderRadius: 6,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 24,
                            background: hovered === i && selected && !cell ? 'rgba(255,255,255,0.28)' : 'transparent',
                            transition: 'background 0.1s',
                        }}
                    >
                        {cell
                            ? <span style={{ transition: 'transform 0.15s', transform: 'scale(1.1)', display: 'inline-block' }}>{cell}</span>
                            : hovered === i && selected
                                ? <span style={{ opacity: 0.3 }}>{selected}</span>
                                : null
                        }
                    </div>
                ))}
            </div>

            {/* Actions bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: selected ? 'var(--sage-dark)' : 'var(--text-muted)', fontWeight: selected ? 600 : 400 }}>
                    {selected ? `Placing: ${selected} — click inside the garden` : 'Pick something from the palette above'}
                </span>
                <button
                    onClick={() => { setGrid(Array(ROWS * COLS).fill(null)); setSelected(null) }}
                    style={{ padding: '10px 24px', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: 12, cursor: 'pointer', fontSize: 13 }}
                >
                    Clear Garden
                </button>
            </div>
        </div>
    )
}

// ─── Memory Game ──────────────────────────────────────────────────────────────

const SYMBOLS = ['🌿', '🌊', '☀️', '🌙', '☁️', '🍂']
function MemoryGame() {
    const [cards, setCards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [matched, setMatched] = useState([])
    const [moves, setMoves] = useState(0)

    useEffect(() => {
        const deck = [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5).map((s, i) => ({ id: i, symbol: s }))
        setCards(deck)
    }, [])

    const handleFlip = (idx) => {
        if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return
        const newFlipped = [...flipped, idx]
        setFlipped(newFlipped)
        if (newFlipped.length === 2) {
            setMoves(m => m + 1)
            if (cards[newFlipped[0]].symbol === cards[newFlipped[1]].symbol) {
                setMatched([...matched, newFlipped[0], newFlipped[1]])
                setFlipped([])
            } else {
                setTimeout(() => setFlipped([]), 1000)
            }
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', color: 'var(--charcoal)', marginBottom: 8 }}>Tranquil Match</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Moves: {moves}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {cards.map((c, i) => (
                    <div
                        key={c.id}
                        onClick={() => handleFlip(i)}
                        style={{
                            width: 80, height: 80, background: flipped.includes(i) || matched.includes(i) ? 'white' : 'var(--sage)',
                            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 32, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease', opacity: matched.includes(i) ? 0.6 : 1
                        }}
                    >
                        {flipped.includes(i) || matched.includes(i) ? c.symbol : ''}
                    </div>
                ))}
            </div>
            {matched.length === cards.length && cards.length > 0 && <div style={{ color: 'var(--sage-dark)', fontWeight: 600 }}>Mindfully completed. 🌿</div>}
        </div>
    )
}

// ─── Sunrise Runner ───────────────────────────────────────────────────────────

function SunriseRunner() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [score, setScore] = useState(0)
    const [isJumping, setIsJumping] = useState(false)
    const [obsLeft, setObsLeft] = useState(100)

    const jump = () => {
        if (!isJumping && isPlaying) {
            setIsJumping(true)
            setTimeout(() => setIsJumping(false), 500)
        }
    }

    useEffect(() => {
        let interval
        if (isPlaying) {
            interval = setInterval(() => {
                setObsLeft(prev => {
                    if (prev < -10) { setScore(s => s + 1); return 100 }
                    return prev - 2
                })
            }, 30)
        }
        return () => clearInterval(interval)
    }, [isPlaying])

    useEffect(() => {
        if (obsLeft < 15 && obsLeft > 5 && !isJumping && isPlaying) {
            setIsPlaying(false)
            setObsLeft(100)
            setScore(0)
        }
    }, [obsLeft, isJumping, isPlaying])

    return (
        <div style={{ width: 600, margin: '0 auto', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', color: 'var(--charcoal)', marginBottom: 8 }}>Sunrise Runner</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Click inside to jump. Score: {score}</p>
            <div
                onClick={jump}
                style={{ position: 'relative', height: 200, background: 'linear-gradient(to top, #7B8EC8, #FFD194)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1.5px solid var(--cream-dark)' }}
            >
                <div style={{ position: 'absolute', right: 40, top: 40, width: 60, height: 60, borderRadius: '50%', background: '#FFF1C5', boxShadow: '0 0 40px #FFF1C5' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, background: 'var(--sage)' }} />
                <div style={{ position: 'absolute', left: 40, bottom: isJumping ? 80 : 20, width: 24, height: 40, borderRadius: 4, background: 'white', transition: 'bottom 0.25s cubic-bezier(0.1,0.9,0.2,1)' }} />
                <div style={{ position: 'absolute', left: `${obsLeft}%`, bottom: 20, width: 20, height: 30, background: 'rgba(0,0,0,0.2)', borderRadius: '4px 4px 0 0' }} />
                {!isPlaying && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <button onClick={(e) => { e.stopPropagation(); setIsPlaying(true) }} style={{ padding: '12px 32px', border: 'none', background: 'var(--charcoal)', color: 'white', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Start Run</button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Breathing & Ocean Sounds ─────────────────────────────────────────────────

function BreathingExercise() {
    const [audioCtx, setAudioCtx] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [phase, setPhase] = useState('Inhale')
    const [timer, setTimer] = useState(4)

    useEffect(() => {
        let t
        if (isPlaying) {
            t = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        if (phase === 'Inhale') { setPhase('Hold'); return 7 }
                        if (phase === 'Hold') { setPhase('Exhale'); return 8 }
                        if (phase === 'Exhale') { setPhase('Inhale'); return 4 }
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(t)
    }, [isPlaying, phase])

    const startAudio = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        setAudioCtx(ctx)
        const bufferSize = ctx.sampleRate * 2
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const output = buffer.getChannelData(0)
        let lastOut = 0
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            output[i] = (lastOut + (0.02 * white)) / 1.02
            lastOut = output[i]
            output[i] *= 3.5
        }
        const brownNoise = ctx.createBufferSource()
        brownNoise.buffer = buffer
        brownNoise.loop = true
        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 400
        const lfo = ctx.createOscillator()
        lfo.type = 'sine'
        lfo.frequency.value = 0.1
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = 300
        lfo.connect(lfoGain)
        lfoGain.connect(filter.frequency)
        const gainNode = ctx.createGain()
        gainNode.gain.value = 0.2
        brownNoise.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(ctx.destination)
        brownNoise.start()
        lfo.start()
        setIsPlaying(true)
    }

    const stopAudio = () => {
        if (audioCtx) audioCtx.close()
        setIsPlaying(false)
        setPhase('Inhale')
        setTimer(4)
    }

    const circleSize = phase === 'Inhale' ? 240 : phase === 'Hold' ? 240 : 120

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontFamily: 'Fraunces, serif', color: 'var(--charcoal)', marginBottom: 8 }}>4-7-8 Breathing & Ocean Soundscape</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Put on your headphones. Let the synthetic waves ground you.</p>
            </div>
            <div style={{ position: 'relative', width: 300, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    position: 'absolute', width: circleSize, height: circleSize, borderRadius: '50%',
                    background: 'rgba(107,143,113,0.15)', border: '2px solid rgba(107,143,113,0.3)',
                    transition: phase === 'Inhale' ? 'width 4s linear, height 4s linear' : phase === 'Exhale' ? 'width 8s linear, height 8s linear' : 'none'
                }} />
                {isPlaying ? (
                    <div style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--sage-dark)', marginBottom: 8 }}>{phase}</div>
                        <div style={{ fontSize: 32, color: 'var(--charcoal)' }}>{timer}s</div>
                    </div>
                ) : (
                    <button onClick={startAudio} style={{ padding: '16px 32px', background: 'var(--sage-dark)', color: 'white', border: 'none', borderRadius: 20, fontSize: 16, cursor: 'pointer', zIndex: 10, position: 'relative' }}>
                        Play Waves & Start
                    </button>
                )}
            </div>
            {isPlaying && (
                <button onClick={stopAudio} style={{ padding: '8px 24px', background: 'transparent', border: '1px solid var(--charcoal)', color: 'var(--charcoal)', borderRadius: 12, cursor: 'pointer' }}>
                    Stop Soundscape
                </button>
            )}
        </div>
    )
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function StressRelief() {
    const [activeTab, setActiveTab] = useState('zen')

    const TABS = [
        { id: 'zen', label: 'Zen Garden', icon: '🪴' },
        { id: 'memory', label: 'Memory Game', icon: '🍃' },
        { id: 'runner', label: 'Sunrise Runner', icon: '🏃' },
        { id: 'breathing', label: 'Ocean Breathing', icon: '🌊' },
    ]

    return (
        <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', animation: 'fadeIn .5s ease' }}>
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 40, color: 'var(--charcoal)', marginBottom: 10 }}>Stress Relief</h2>
                <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Step away from the noise. Reconnect with the present through flow and sound.</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 32, borderBottom: '1px solid var(--cream-dark)', paddingBottom: 14 }}>
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px',
                            background: activeTab === t.id ? 'var(--charcoal)' : 'transparent',
                            color: activeTab === t.id ? 'white' : 'var(--text-muted)',
                            border: 'none', borderRadius: 20, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: '.2s'
                        }}
                    >
                        <span>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            <div style={{ background: 'white', borderRadius: 24, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,.03)' }}>
                {activeTab === 'zen' && <ZenGarden />}
                {activeTab === 'memory' && <MemoryGame />}
                {activeTab === 'runner' && <SunriseRunner />}
                {activeTab === 'breathing' && <BreathingExercise />}
            </div>
        </div>
    )
}
