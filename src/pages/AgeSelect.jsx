import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

const CARDS = [
    { id: '18-25', emoji: '🌱', range: '18–25', tagline: 'Figuring it all out', desc: 'Navigating identity, academics, first jobs, social anxiety, and the overwhelming feeling that everyone else has it together — except you.', tags: ['Academic stress', 'Identity', 'Social anxiety'], bg: 'linear-gradient(145deg,#EEF2FF,#E0E5F8)', border: '#C5CCF0', color: '#4A57A0', tagBg: 'rgba(74,87,160,.12)' },
    { id: '25-35', emoji: '⚡', range: '25–35', tagline: 'Balancing everything at once', desc: 'Career ambitions, relationship pressures, financial stress, and the exhausting performance of having it all together — while running on empty.', tags: ['Burnout', 'Work-life balance', 'Relationships'], bg: 'linear-gradient(145deg,#EDF7EF,#DCF0E0)', border: '#B5D9BB', color: '#1A5E38', tagBg: 'rgba(26,94,56,.12)' },
    { id: '35-45', emoji: '🌳', range: '35–45', tagline: 'Feeling the weight of it all', desc: 'Parenting, ageing parents, career plateaus, and that quiet mid-life questioning — who am I becoming, and is this what I wanted?', tags: ['Family stress', 'Mid-life transitions', 'Purpose'], bg: 'linear-gradient(145deg,#FEF5E8,#F9E8D0)', border: '#E8C898', color: '#8B4E35', tagBg: 'rgba(139,78,53,.12)' },
    { id: '45+', emoji: '🌊', range: '45+', tagline: "Navigating life's next chapter", desc: 'Empty nests, retirement, health changes, grief, and rediscovering who you are when the roles you played begin to shift.', tags: ['Loneliness', 'Grief & loss', 'Health anxiety'], bg: 'linear-gradient(145deg,#E8EEF4,#D8E5EE)', border: '#A8BDD0', color: '#1A5268', tagBg: 'rgba(26,82,104,.12)' },
]

export default function AgeSelect() {
    const navigate = useNavigate()
    const setAgeCategory = useStore((s) => s.setAgeCategory)
    const [selected, setSelected] = useState(null)

    function pick(id) { setSelected(id); setAgeCategory(id) }

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div style={s.steps}>
                    <div style={{ ...s.dot, ...s.dotActive }} />
                    <div style={s.dot} />
                </div>
                <h1 style={s.title}>Which chapter are<br /><em style={{ fontStyle: 'italic', color: 'var(--sage-dark)' }}>you in right now?</em></h1>
                <p style={s.sub}>Your age shapes your world — your pressures, your joys, your questions. Let us meet you where you are.</p>
            </div>

            <div style={s.grid}>
                {CARDS.map((c) => (
                    <div key={c.id} onClick={() => pick(c.id)} style={{
                        ...s.card, background: c.bg,
                        borderColor: selected === c.id ? c.color : c.border,
                        borderWidth: selected === c.id ? 2.5 : 2,
                        transform: selected === c.id ? 'translateY(-8px) scale(1.02)' : 'none',
                    }}>
                        {selected === c.id && <div style={s.check}>✓</div>}
                        <div style={{ fontSize: 36, marginBottom: 14 }}>{c.emoji}</div>
                        <div style={{ fontFamily: 'Fraunces,serif', fontSize: 52, fontWeight: 600, color: c.color, lineHeight: 1 }}>{c.range}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: c.color, margin: '10px 0 8px' }}>{c.tagline}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6, color: c.color, opacity: .75, marginBottom: 20 }}>{c.desc}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {c.tags.map((t) => (
                                <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: c.tagBg, color: c.color, fontWeight: 500 }}>{t}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div style={s.footer}>
                <button
                    style={{ ...s.btn, opacity: selected ? 1 : .4, pointerEvents: selected ? 'all' : 'none' }}
                    onClick={() => navigate('/onboarding/profession')}
                >
                    Continue to next step →
                </button>
            </div>
        </div>
    )
}

const s = {
    page: { background: 'var(--cream)', minHeight: '100vh', padding: '40px 48px', animation: 'fadeIn .5s ease' },
    header: { textAlign: 'center', marginBottom: 60 },
    steps: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 },
    dot: { width: 10, height: 10, borderRadius: '50%', background: 'var(--cream-dark)', transition: '.3s' },
    dotActive: { background: 'var(--sage-dark)', width: 28, borderRadius: 5 },
    title: { fontFamily: 'Fraunces,serif', fontSize: 52, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 12, lineHeight: 1.15 },
    sub: { fontSize: 17, color: 'var(--text-muted)', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, maxWidth: 900, margin: '0 auto' },
    card: { borderRadius: 24, padding: '48px 40px', cursor: 'pointer', transition: '.3s', border: '2px solid', minHeight: 280, position: 'relative', borderStyle: 'solid' },
    check: { position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: '50%', background: 'var(--sage-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 },
    footer: { display: 'flex', justifyContent: 'center', marginTop: 48 },
    btn: { padding: '18px 56px', background: 'var(--sage-dark)', color: 'white', borderRadius: 16, fontSize: 17, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', transition: '.25s' },
}