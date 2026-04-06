import React, { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'carenest_sleep_v1'
const PROGRESS_KEY = 'carenest_progress_v1'

function loadData(key) {
    try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

function parseTime(value) {
    const [hour, minute] = value.split(':').map(Number)
    return hour * 60 + minute
}

function formatTime(total) {
    const h = Math.floor(total / 60)
    const m = total % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function computeCorrelation(sleep, mood) {
    if (sleep.length < 3 || mood.length < 3) return null
    const n = Math.min(sleep.length, mood.length)
    const xs = sleep.slice(0, n).map(e => e.duration)
    const ys = mood.slice(0, n).map(e => e.mood)
    const mean = arr => arr.reduce((sum, x) => sum + x, 0) / arr.length
    const xMean = mean(xs)
    const yMean = mean(ys)
    const numerator = xs.reduce((sum, x, i) => sum + (x - xMean) * (ys[i] - yMean), 0)
    const denom = Math.sqrt(xs.reduce((sum, x) => sum + (x - xMean) ** 2, 0) * ys.reduce((sum, y) => sum + (y - yMean) ** 2, 0))
    if (denom === 0) return null
    return numerator / denom
}

function SleepChart({ entries = [] }) {
    if (!entries.length) {
        return <div style={styles.empty}>No sleep entries yet. Log bedtime, wake time, and sleep quality to see your weekly rhythm.</div>
    }

    const data = entries.slice(-7)
    const width = 300
    const height = 140
    const pad = 24
    const max = Math.max(...data.map(e => e.duration), 10)
    const points = data.map((e, idx) => ({
        x: pad + (idx / Math.max(data.length - 1, 1)) * (width - pad * 2),
        y: height - pad - (e.duration / max) * (height - pad * 2),
        value: e.duration,
        label: e.date.slice(5),
    }))
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    return (
        <div style={styles.chartWrap}>
            <div style={styles.chartHeader}>Sleep hours — last 7 days</div>
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
                {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                    const y = pad + (1 - t) * (height - pad * 2)
                    return <line key={t} x1={pad} x2={width - pad} y1={y} y2={y} stroke="#E7EEF1" strokeWidth="1" />
                })}
                <path d={path} fill="none" stroke="#4A57A0" strokeWidth="3" strokeLinecap="round" />
                {points.map((p, idx) => (
                    <g key={idx}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#4A57A0" />
                        <text x={p.x} y={height - 6} textAnchor="middle" fontSize="9" fill="#556775">{p.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    )
}

function CorrelationSummary({ corr }) {
    if (corr === null) {
        return <div style={styles.summary}>Add at least three sleep entries and mood check-ins to see your next-day correlation.</div>
    }
    const strength = Math.abs(corr)
    const label = corr > 0 ? 'Positive' : 'Negative'
    const advice = corr > 0
        ? 'Better sleep is tracking with improved next-day mood. Keep this rhythm going.'
        : 'Your mood may dip after longer or poorer sleep. Try consistent bedtime routines and morning grounding.'

    return (
        <div style={styles.summary}>
            <strong>{label} correlation:</strong> {strength.toFixed(2)} — {advice}
        </div>
    )
}

export default function SleepHygieneLog() {
    const [entries, setEntries] = useState(loadData(STORAGE_KEY))
    const [progress, setProgress] = useState(loadData(PROGRESS_KEY))
    const [form, setForm] = useState({ bedtime: '23:00', wakeTime: '07:00', quality: 3 })

    useEffect(() => {
        setEntries(loadData(STORAGE_KEY))
        setProgress(loadData(PROGRESS_KEY))
    }, [])

    const recentSleep = useMemo(() => [...entries].slice(-7), [entries])
    const moodNextDay = useMemo(() => {
        const results = []
        for (let i = 0; i < recentSleep.length; i += 1) {
            const sleepEntry = recentSleep[i]
            const nextDay = new Date(sleepEntry.date)
            nextDay.setDate(nextDay.getDate() + 1)
            const dayKey = nextDay.toISOString().slice(0, 10)
            const moodEntry = progress.find((entry) => entry.date === dayKey && entry.mood != null)
            if (moodEntry) {
                results.push({ date: sleepEntry.date, duration: sleepEntry.duration, mood: moodEntry.mood })
            }
        }
        return results
    }, [recentSleep, progress])

    const corrValue = useMemo(() => {
        if (moodNextDay.length < 3) return null
        return computeCorrelation(
            moodNextDay.map((entry) => ({ duration: entry.duration })),
            moodNextDay.map((entry) => ({ mood: entry.mood }))
        )
    }, [moodNextDay])

    function handleSave() {
        const duration = (() => {
            const start = parseTime(form.bedtime)
            const end = parseTime(form.wakeTime)
            const raw = end <= start ? end + 24 * 60 - start : end - start
            return Number((raw / 60).toFixed(1))
        })()
        const entry = { date: new Date().toISOString().slice(0, 10), bedtime: form.bedtime, wakeTime: form.wakeTime, quality: Number(form.quality), duration }
        const existing = loadData(STORAGE_KEY)
        const idx = existing.findIndex((item) => item.date === entry.date)
        if (idx >= 0) existing[idx] = entry
        else existing.push(entry)
        saveData(STORAGE_KEY, existing)
        setEntries(existing)
    }

    return (
        <div style={styles.panel}>
            <div style={styles.headerRow}>
                <div>
                    <div style={styles.title}>Sleep Hygiene Log</div>
                    <div style={styles.subtitle}>Track bedtime, wake time, quality, and next-day mood correlation.</div>
                </div>
                <div style={styles.badge}>{recentSleep.length} entries</div>
            </div>

            <div style={styles.fieldRow}>
                <label style={styles.label}>Bedtime</label>
                <input
                    type="time"
                    value={form.bedtime}
                    onChange={(e) => setForm((f) => ({ ...f, bedtime: e.target.value }))}
                    style={styles.input}
                />
            </div>

            <div style={styles.fieldRow}>
                <label style={styles.label}>Wake time</label>
                <input
                    type="time"
                    value={form.wakeTime}
                    onChange={(e) => setForm((f) => ({ ...f, wakeTime: e.target.value }))}
                    style={styles.input}
                />
            </div>

            <div style={styles.fieldRow}>
                <label style={styles.label}>Sleep quality</label>
                <select
                    value={form.quality}
                    onChange={(e) => setForm((f) => ({ ...f, quality: e.target.value }))}
                    style={styles.input}
                >
                    {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>{value} / 5</option>
                    ))}
                </select>
            </div>

            <button style={styles.button} onClick={handleSave}>Save sleep entry</button>

            <SleepChart entries={recentSleep} />

            <CorrelationSummary corr={corrValue} />
        </div>
    )
}

const styles = {
    panel: { background: 'white', borderRadius: 22, boxShadow: '0 12px 30px rgba(0,0,0,.08)', padding: 22, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 },
    headerRow: { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
    title: { fontSize: 17, fontWeight: 700, color: '#1A2332' },
    subtitle: { fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginTop: 4 },
    badge: { background: '#EDF7EF', color: '#1A5E38', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 700 },
    fieldRow: { display: 'flex', flexDirection: 'column', gap: 6 },
    label: { fontSize: 12, fontWeight: 600, color: '#4A5665' },
    input: { borderRadius: 14, border: '1px solid #E2E8F0', padding: '10px 12px', fontSize: 13, outline: 'none', width: '100%' },
    button: { borderRadius: 14, padding: '12px 16px', border: 'none', background: '#1A5E38', color: 'white', fontWeight: 700, cursor: 'pointer', marginTop: 6 },
    chartWrap: { background: '#F8FAFB', borderRadius: 18, padding: 14, minHeight: 210, display: 'flex', flexDirection: 'column', gap: 10 },
    chartHeader: { fontSize: 12, fontWeight: 700, color: '#4A5665', marginBottom: 4 },
    empty: { fontSize: 12, color: '#6B7280', lineHeight: 1.6, background: '#F8FAFB', padding: 18, borderRadius: 18, textAlign: 'center' },
    summary: { fontSize: 12, color: '#4A5665', lineHeight: 1.6, background: '#FEF3E2', borderRadius: 16, padding: 14, border: '1px solid #FDE8C8' },
}
