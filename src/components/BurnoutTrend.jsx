import React from 'react'

export default function BurnoutTrend({ history = [] }) {
    if (!history || history.length < 2) return (
        <div style={s.empty}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
            <div style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center' }}>Keep checking in weekly to see your burnout trend here.</div>
        </div>
    )

    // Last 7 entries
    const data = history.slice(-7)
    const maxScore = 100
    const width = 300
    const height = 120
    const padding = 20

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding
        const y = height - ((d.score / maxScore) * (height - 2 * padding) + padding)
        return { x, y, score: d.score, date: d.date }
    })

    const pathD = points.reduce((acc, p, i) => 
        acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), '')

    return (
        <div style={s.container}>
            <div style={s.header}>
                <div style={s.title}>Trend Tracking</div>
                <div style={s.val}>{data[data.length - 1].score}% Risk</div>
            </div>
            
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(v => {
                    const y = height - ((v / maxScore) * (height - 2 * padding) + padding)
                    return <line key={v} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#F0F2FF" strokeWidth="1" />
                })}
                
                {/* The Path */}
                <path d={pathD} fill="none" stroke="var(--sage-dark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Dots */}
                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="white" stroke="var(--sage-dark)" strokeWidth="2" />
                ))}
            </svg>
            
            <div style={s.footer}>
                <div style={{ ...s.label, textAlign: 'left' }}>{new Date(data[0].date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                <div style={{ ...s.label, textAlign: 'right' }}>Today</div>
            </div>
        </div>
    )
}

const s = {
    container: { background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,.04)' },
    empty: { background: '#F8F9FA', borderRadius: 20, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E5E7EB' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
    title: { fontSize: 13, fontWeight: 600, color: '#1A2332' },
    val: { fontSize: 22, fontFamily: 'Fraunces', fontWeight: 600, color: 'var(--sage-dark)' },
    footer: { display: 'flex', justifyContent: 'space-between', marginTop: 12 },
    label: { fontSize: 10, color: '#9CA3AF', width: '50%' },
}
