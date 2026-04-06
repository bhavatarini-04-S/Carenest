import React, { useState } from 'react'

const REFLECTIONS = [
    { type: 'prayer', icon: '🙏', title: 'Morning Intention', content: '"May I meet this day with a heart open to what is, rather than what I wish it to be. May I find peace in the ordinary, and meaning in the moments between."' },
    { type: 'philosophy', icon: '🌼', title: 'Marcus Aurelius', content: '"You have power over your mind — not outside events. Realize this, and you will find strength." Every difficulty is an opportunity for inner growth.' },
    { type: 'gratitude', icon: '✨', title: 'Gratitude Practice', content: 'Name three things from today — however small. The warmth of sunlight. A sip of chai. A memory that made you smile. Gratitude rewires the brain toward peace.' },
    { type: 'meditation', icon: '🕯️', title: 'Breath Meditation', content: 'Place one hand on your chest. Breathe in slowly for 4 counts. Hold for 2. Release for 6. Repeat 3 times. You are here. You are enough. This moment is yours.' },
    { type: 'philosophy', icon: '📿', title: 'Viktor Frankl', content: '"Everything can be taken from a person but one thing: the last of human freedoms — to choose one\'s attitude in any given set of circumstances." Your spirit endures.' },
    { type: 'prayer', icon: '🌙', title: 'Evening Reflection', content: '"As this day closes, I release what did not go as planned. I hold gratitude for what was beautiful. Tomorrow is a new beginning waiting quietly for me."' },
    { type: 'gratitude', icon: '💌', title: 'Letter of Love', content: 'Think of someone who shaped who you are. Write — even mentally — one sentence of gratitude to them. Gratitude shared, even silently, lightens the heart.' },
    { type: 'meditation', icon: '🌊', title: 'Body Scan for Calm', content: 'Close your eyes. Start at your feet. Gently notice each part of your body — no judgment, just awareness. By the time you reach your head, tension begins to release.' },
]

export default function SeniorSpiritualSupport() {
    const [activeType, setActiveType] = useState('all')
    const [expanded, setExpanded] = useState(null)

    const types = [
        { id: 'all', icon: '🌟', label: 'All' },
        { id: 'prayer', icon: '🙏', label: 'Prayer' },
        { id: 'meditation', icon: '🕯️', label: 'Meditation' },
        { id: 'philosophy', icon: '🌼', label: 'Reflection' },
        { id: 'gratitude', icon: '✨', label: 'Gratitude' },
    ]

    const filtered = activeType === 'all' ? REFLECTIONS : REFLECTIONS.filter(r => r.type === activeType)

    return (
        <div style={s.root}>
            <div style={s.header}>
                <h2 style={s.title}>Spiritual & Meaning-Based Support</h2>
                <p style={s.subtitle}>Timeless wisdom and practices to help you find peace and purpose in every chapter of life.</p>
            </div>

            <div style={s.filterBar}>
                {types.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveType(t.id)}
                        style={{
                            ...s.filterBtn,
                            borderColor: activeType === t.id ? '#7C3AED' : '#E5E7EB',
                            background: activeType === t.id ? '#F5F3FF' : 'white',
                            color: activeType === t.id ? '#7C3AED' : '#6B7280',
                            transform: activeType === t.id ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        <span style={{ fontSize: 20 }}>{t.icon}</span> {t.label}
                    </button>
                ))}
            </div>

            <div style={s.grid}>
                {filtered.map((r, i) => (
                    <div
                        key={i}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        style={{
                            ...s.card,
                            borderColor: expanded === i ? '#C4B5FD' : '#E8EEF4',
                            boxShadow: expanded === i ? '0 12px 32px rgba(124,58,237,.15)' : '0 4px 12px rgba(0,0,0,.04)',
                        }}
                    >
                        <div style={s.cardHeader}>
                            <span style={s.icon}>{r.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={s.cardTitle}>{r.title}</div>
                                <div style={s.cardType}>{r.type}</div>
                            </div>
                            <span style={s.chevron}>{expanded === i ? '▴' : '▾'}</span>
                        </div>
                        {expanded === i && (
                            <div style={s.cardContent}>
                                {r.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

const s = {
    root: { padding: '10px 0', animation: 'fadeIn 0.6s ease' },
    header: { marginBottom: 32 },
    title: { fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 600, color: '#1E1B4B', marginBottom: 12 },
    subtitle: { fontSize: 18, color: '#4B5563', lineHeight: 1.6, maxWidth: 700 },
    filterBar: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 },
    filterBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 30, border: '2px solid', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'all .25s ease', fontFamily: 'DM Sans, sans-serif' },
    grid: { display: 'flex', flexDirection: 'column', gap: 18 },
    card: { background: 'white', borderRadius: 24, padding: '24px 32px', border: '2.5px solid', cursor: 'pointer', transition: 'all .3s ease' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 20 },
    icon: { fontSize: 36, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.1))' },
    cardTitle: { fontSize: 22, fontWeight: 700, color: '#1F2937', fontFamily: 'Fraunces, serif' },
    cardType: { fontSize: 13, fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 },
    chevron: { fontSize: 24, color: '#9CA3AF' },
    cardContent: { fontSize: 20, lineHeight: 1.8, color: '#374151', fontStyle: 'italic', marginTop: 20, borderLeft: '4px solid #C4B5FD', paddingLeft: 24, paddingBottom: 8, animation: 'slideDown .3s ease' },
}
