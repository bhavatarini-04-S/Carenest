import React, { useState, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'carenest_progress_v1'

function loadData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Called from AIchat.jsx or WellnessJournal.jsx to auto-log a distress reading
export function logProgressEntry({ distress, source = 'chat' }) {
    const existing = loadData()
    const today = new Date().toISOString().slice(0, 10)
    // Replace today's auto-entry for this source or push new
    const idx = existing.findIndex(e => e.date === today && e.source === source)
    const entry = { date: today, distress: Math.min(10, Math.max(0, distress)), source, mood: null, sleep: null, energy: null }
    if (idx >= 0) existing[idx] = { ...existing[idx], ...entry }
    else existing.push(entry)
    saveData(existing)
}

// ─── SVG Sparkline Chart ──────────────────────────────────────────────────────
function LineChart({ label, color, data, maxVal = 10, unit = '' }) {
    const W = 540, H = 130, PAD = { top: 10, bottom: 24, left: 32, right: 10 }
    const chartW = W - PAD.left - PAD.right
    const chartH = H - PAD.top - PAD.bottom
    const pts = data.filter(d => d.value != null)
    if (pts.length === 0) return (
        <div style={cs.chartWrap}>
            <div style={cs.chartLabel}>{label}</div>
            <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: 13 }}>No data yet — log your first check-in below</div>
        </div>
    )

    const xScale = i => PAD.left + (i / Math.max(pts.length - 1, 1)) * chartW
    const yScale = v => PAD.top + chartH - (v / maxVal) * chartH
    const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.value)}`).join(' ')
    const areaD = `${pathD} L ${xScale(pts.length - 1)} ${PAD.top + chartH} L ${xScale(0)} ${PAD.top + chartH} Z`

    return (
        <div style={cs.chartWrap}>
            <div style={cs.chartLabel}>{label}</div>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(t => (
                    <g key={t}>
                        <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + chartH * (1 - t)} y2={PAD.top + chartH * (1 - t)} stroke="var(--cream-dark)" strokeWidth="1" />
                        <text x={PAD.left - 4} y={PAD.top + chartH * (1 - t) + 4} fontSize="9" fill="var(--text-light)" textAnchor="end">{Math.round(maxVal * t)}</text>
                    </g>
                ))}
                {/* Area fill */}
                <path d={areaD} fill={color} fillOpacity="0.08" />
                {/* Line */}
                <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots + labels */}
                {pts.map((p, i) => (
                    <g key={i}>
                        <circle cx={xScale(i)} cy={yScale(p.value)} r="4" fill={color} />
                        <text x={xScale(i)} y={PAD.top + chartH + 16} fontSize="9" fill="var(--text-light)" textAnchor="middle">{p.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    )
}

// ─── PHQ-2 Quick Assessment ───────────────────────────────────────────────────
const PHQ_QUESTIONS = [
    'Little interest or pleasure in doing things',
    'Feeling down, depressed, or hopeless',
]
const PHQ_OPTIONS = [
    { label: 'Not at all', value: 0 },
    { label: 'Several days', value: 1 },
    { label: 'More than half', value: 2 },
    { label: 'Nearly every day', value: 3 },
]

function PHQWidget({ onScore }) {
    const [answers, setAnswers] = useState([null, null])
    const done = answers.every(a => a !== null)
    const score = answers.reduce((s, a) => s + (a || 0), 0)

    return (
        <div style={cs.phqCard}>
            <h4 style={cs.phqTitle}>PHQ-2 Quick Screen</h4>
            <p style={cs.phqSub}>Over the last 2 weeks, how often have you been bothered by:</p>
            {PHQ_QUESTIONS.map((q, qi) => (
                <div key={qi} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 8, fontWeight: 500 }}>{q}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {PHQ_OPTIONS.map(o => (
                            <button
                                key={o.value}
                                onClick={() => { const a = [...answers]; a[qi] = o.value; setAnswers(a) }}
                                style={{
                                    padding: '6px 14px', borderRadius: 10, fontSize: 12, cursor: 'pointer',
                                    border: answers[qi] === o.value ? '2px solid var(--sage-dark)' : '1.5px solid var(--cream-dark)',
                                    background: answers[qi] === o.value ? 'rgba(107,143,113,0.12)' : 'white',
                                    color: 'var(--text-primary)', transition: '.15s',
                                }}
                            >{o.label}</button>
                        ))}
                    </div>
                </div>
            ))}
            {done && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 13, color: score >= 3 ? '#C0392B' : 'var(--sage-dark)', fontWeight: 600 }}>
                        Score: {score}/6 — {score >= 3 ? 'Consider full PHQ-9 evaluation' : 'Low risk range'}
                    </span>
                    <button onClick={() => onScore(score)} style={{ padding: '8px 20px', background: 'var(--sage-dark)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>
                        Log Score
                    </button>
                </div>
            )}
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProgressTracking() {
    const [entries, setEntries] = useState(loadData)
    const [form, setForm] = useState({ mood: '', sleep: '', energy: '' })
    const [saved, setSaved] = useState(false)
    const [showPHQ, setShowPHQ] = useState(false)

    // Reload from localStorage whenever this page mounts
    useEffect(() => { setEntries(loadData()) }, [])

    // Last 14 entries for charts
    const recent = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-14)
    const fmt = d => d.slice(5)  // MM-DD

    const moodData = recent.map(e => ({ value: e.mood, label: fmt(e.date) }))
    const sleepData = recent.map(e => ({ value: e.sleep, label: fmt(e.date) }))
    const energyData = recent.map(e => ({ value: e.energy, label: fmt(e.date) }))
    const distressData = recent.map(e => ({ value: e.distress != null ? e.distress : e.phq, label: fmt(e.date) }))

    const handleCheckIn = () => {
        if (!form.mood && !form.sleep && !form.energy) return
        const today = new Date().toISOString().slice(0, 10)
        const existing = loadData()
        const idx = existing.findIndex(e => e.date === today && e.source === 'manual')
        const entry = {
            date: today, source: 'manual',
            mood: form.mood ? +form.mood : null,
            sleep: form.sleep ? +form.sleep : null,
            energy: form.energy ? +form.energy : null,
            distress: null,
        }
        if (idx >= 0) existing[idx] = { ...existing[idx], ...entry }
        else existing.push(entry)
        saveData(existing)
        setEntries(loadData())
        setForm({ mood: '', sleep: '', energy: '' })
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handlePHQ = (score) => {
        const today = new Date().toISOString().slice(0, 10)
        const existing = loadData()
        const phqEntry = { date: today, source: 'phq', phq: score, mood: null, sleep: null, energy: null, distress: null }
        existing.push(phqEntry)
        saveData(existing)
        setEntries(loadData())
        setShowPHQ(false)
    }

    const generateReport = () => {
        const lines = [
            'CareNest — Wellness Progress Report',
            `Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`,
            '',
            '── Last 14 Days Summary ──',
            ...recent.map(e =>
                `${e.date}  |  Mood: ${e.mood ?? '—'}/10  |  Sleep: ${e.sleep ?? '—'}h  |  Energy: ${e.energy ?? '—'}/10  |  Distress: ${e.distress ?? e.phq ?? '—'}`
            ),
            '',
            '── Notes ──',
            'This report was generated from self-reported check-ins, AI chat sentiment analysis, and wellness journal entries in CareNest.',
        ]
        navigator.clipboard.writeText(lines.join('\n'))
            .then(() => alert('Progress report copied to clipboard! Paste and share with your care team.'))
            .catch(() => alert(lines.join('\n')))
    }

    return (
        <div style={cs.root}>
            <div style={cs.header}>
                <div>
                    <h2 style={cs.title}>Progress Tracking</h2>
                    <p style={cs.sub}>Your wellness over time — auto-tracked from your AI chat and journal, plus what you log manually below.</p>
                </div>
                <button onClick={generateReport} style={cs.shareBtn}>
                    📋 Share with Care Team
                </button>
            </div>

            {/* Charts */}
            <div style={cs.chartsGrid}>
                <LineChart label="Mood (0–10)" color="#6B8F71" data={moodData} />
                <LineChart label="Sleep (hours)" color="#7B8EC8" data={sleepData} maxVal={12} unit="h" />
                <LineChart label="Energy (0–10)" color="#B8860B" data={energyData} />
                <LineChart label="Distress / PHQ-2 Score (0–10)" color="#C0392B" data={distressData} />
            </div>

            {/* Daily Check-In */}
            <div style={cs.checkinCard}>
                <h3 style={cs.checkinTitle}>Daily Check-In</h3>
                <p style={cs.checkinSub}>Takes 10 seconds. You can skip what you don't know.</p>
                <div style={cs.checkinRow}>
                    <div style={cs.field}>
                        <label style={cs.label}>😊 Mood today</label>
                        <input type="range" min="1" max="10" value={form.mood || 5} onChange={e => setForm(f => ({ ...f, mood: e.target.value }))} style={{ width: '100%' }} />
                        <span style={cs.rangeVal}>{form.mood || '—'} / 10</span>
                    </div>
                    <div style={cs.field}>
                        <label style={cs.label}>😴 Sleep last night (hours)</label>
                        <input type="range" min="0" max="12" step="0.5" value={form.sleep || 7} onChange={e => setForm(f => ({ ...f, sleep: e.target.value }))} style={{ width: '100%' }} />
                        <span style={cs.rangeVal}>{form.sleep || '—'} hrs</span>
                    </div>
                    <div style={cs.field}>
                        <label style={cs.label}>⚡ Energy level</label>
                        <input type="range" min="1" max="10" value={form.energy || 5} onChange={e => setForm(f => ({ ...f, energy: e.target.value }))} style={{ width: '100%' }} />
                        <span style={cs.rangeVal}>{form.energy || '—'} / 10</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 20, alignItems: 'center' }}>
                    <button onClick={handleCheckIn} style={cs.logBtn}>
                        {saved ? '✓ Saved!' : 'Log Check-In'}
                    </button>
                    <button onClick={() => setShowPHQ(!showPHQ)} style={cs.phqBtn}>
                        📋 PHQ-2 Assessment
                    </button>
                </div>
            </div>

            {showPHQ && <PHQWidget onScore={handlePHQ} />}

            {/* History Table */}
            {recent.length > 0 && (
                <div style={cs.historyCard}>
                    <h3 style={cs.checkinTitle}>Entry History</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--cream-dark)', textAlign: 'left' }}>
                                {['Date', 'Source', 'Mood', 'Sleep', 'Energy', 'Distress'].map(h => (
                                    <th key={h} style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...recent].reverse().map((e, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--cream)', background: i % 2 === 0 ? 'transparent' : 'rgba(107,143,113,0.03)' }}>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>{e.date}</td>
                                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'var(--cream)', color: 'var(--sage-dark)', fontWeight: 600 }}>{e.source}</span></td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{e.mood ?? '—'}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{e.sleep ? `${e.sleep}h` : '—'}</td>
                                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{e.energy ?? '—'}</td>
                                    <td style={{ padding: '10px 12px', color: e.distress > 6 ? '#C0392B' : 'var(--text-muted)', fontWeight: e.distress > 6 ? 600 : 400 }}>{e.distress ?? e.phq ?? '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

const cs = {
    root: { padding: '40px 56px', maxWidth: 960, margin: '0 auto', animation: 'fadeIn .5s ease' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 },
    title: { fontFamily: 'Fraunces, serif', fontSize: 40, color: 'var(--charcoal)', marginBottom: 8 },
    sub: { fontSize: 15, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.6 },
    shareBtn: { padding: '12px 24px', background: 'var(--charcoal)', color: 'white', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0 },

    chartsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 },
    chartWrap: { background: 'white', borderRadius: 18, padding: '20px 20px 12px', boxShadow: '0 2px 12px rgba(0,0,0,.04)', border: '1px solid var(--cream-dark)' },
    chartLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 },

    checkinCard: { background: 'white', borderRadius: 20, padding: 32, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,.04)', border: '1px solid var(--cream-dark)' },
    checkinTitle: { fontFamily: 'Fraunces, serif', fontSize: 22, color: 'var(--charcoal)', marginBottom: 4 },
    checkinSub: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 },
    checkinRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 },
    field: { display: 'flex', flexDirection: 'column', gap: 8 },
    label: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
    rangeVal: { fontSize: 12, color: 'var(--sage-dark)', fontWeight: 600, textAlign: 'right' },
    logBtn: { padding: '12px 28px', background: 'var(--sage-dark)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
    phqBtn: { padding: '12px 24px', background: 'transparent', border: '1.5px solid var(--cream-dark)', color: 'var(--text-primary)', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer' },

    phqCard: { background: 'white', borderRadius: 18, padding: 28, marginBottom: 20, border: '1.5px solid var(--cream-dark)', boxShadow: '0 2px 12px rgba(0,0,0,.04)' },
    phqTitle: { fontFamily: 'Fraunces, serif', fontSize: 20, color: 'var(--charcoal)', marginBottom: 4 },
    phqSub: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 },

    historyCard: { background: 'white', borderRadius: 18, padding: '24px 20px', border: '1px solid var(--cream-dark)', boxShadow: '0 2px 12px rgba(0,0,0,.04)' },
}
