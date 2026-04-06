import React, { useMemo, useState } from 'react'

const CATEGORIES = {
    work: { label: 'Work', color: '#4A57A0', keywords: ['work', 'job', 'boss', 'deadline', 'career', 'promotion', 'bosses', 'team', 'manager', 'office', 'meeting', 'commute', 'project', 'pay', 'salary'] },
    relationships: { label: 'Relationships', color: '#C55689', keywords: ['partner', 'relationship', 'marriage', 'family', 'friend', 'dating', 'spouse', 'girlfriend', 'boyfriend', 'communication', 'conflict', 'support', 'lonely'] },
    finances: { label: 'Finances', color: '#B8860B', keywords: ['money', 'rent', 'bills', 'debt', 'loan', 'savings', 'salary', 'income', 'budget', 'expenses', 'paycheck', 'tax', 'finance'] },
    health: { label: 'Health', color: '#1A5E38', keywords: ['sleep', 'tired', 'fatigue', 'illness', 'doctor', 'exercise', 'diet', 'body', 'energy', 'headache', 'pain', 'health', 'fitness', 'anxiety'] },
}

function scoreText(text) {
    const normalized = text.toLowerCase()
    const tokens = normalized.match(/[a-z]+/g) || []
    const counts = Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: 1 }), {})

    for (const token of tokens) {
        Object.entries(CATEGORIES).forEach(([key, meta]) => {
            if (meta.keywords.includes(token)) counts[key] += 1
        })
    }

    const total = Object.values(counts).reduce((sum, value) => sum + value, 0)
    return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, v / total]))
}

function ProbBar({ label, value, color }) {
    return (
        <div style={styles.barRow}>
            <div style={styles.barLabel}>{label}</div>
            <div style={styles.barTrack}><div style={{ ...styles.barFill, width: `${Math.round(value * 100)}%`, background: color }} /></div>
            <div style={styles.barValue}>{Math.round(value * 100)}%</div>
        </div>
    )
}

export default function StressSourceAttribution() {
    const [text, setText] = useState('I feel overloaded at work and my partner and I keep arguing. Money is tight too.')
    const probabilities = useMemo(() => scoreText(text), [text])
    const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1])
    const top = sorted[0]

    return (
        <div style={styles.panel}>
            <div style={styles.headerRow}>
                <div>
                    <div style={styles.title}>Bayesian Stress Attribution</div>
                    <div style={styles.subtitle}>Identify whether your stress is coming from work, relationships, finances, or health.</div>
                </div>
                <div style={styles.badge}>{top ? CATEGORIES[top[0]].label : 'Work'}</div>
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                style={styles.textarea}
                placeholder="Type a short summary of what feels most stressful right now."
            />

            <div style={styles.sourceRow}>
                {sorted.map(([key, value]) => (
                    <div key={key} style={styles.sourceItem}>
                        <div style={{ ...styles.sourceDot, background: CATEGORIES[key].color }} />
                        <div>
                            <div style={styles.sourceName}>{CATEGORIES[key].label}</div>
                            <div style={styles.sourceHint}>{Math.round(value * 100)}% likelihood</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.notice}>
                This classifier is based on your text and common stress patterns. Use it as a guide, not a diagnosis.
            </div>
        </div>
    )
}

const styles = {
    panel: { background: 'white', borderRadius: 22, boxShadow: '0 12px 30px rgba(0,0,0,.08)', padding: 22, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 320 },
    headerRow: { display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' },
    title: { fontSize: 17, fontWeight: 700, color: '#1A2332' },
    subtitle: { fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginTop: 4 },
    badge: { background: '#EEF2FF', color: '#4A57A0', borderRadius: 999, padding: '6px 12px', fontSize: 11, fontWeight: 700 },
    textarea: { width: '100%', minHeight: 120, borderRadius: 18, border: '1px solid #E2E8F0', padding: 14, fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans,sans-serif', color: '#1A2332', lineHeight: 1.6 },
    sourceRow: { display: 'grid', gap: 12 },
    sourceItem: { display: 'flex', gap: 12, alignItems: 'center', padding: 14, background: '#F8FAFB', borderRadius: 16 },
    sourceDot: { width: 12, height: 12, borderRadius: '50%', flexShrink: 0 },
    sourceName: { fontSize: 13, fontWeight: 700, color: '#1A2332' },
    sourceHint: { fontSize: 11, color: '#6B7280' },
    notice: { fontSize: 11, lineHeight: 1.5, color: '#4A5665', background: '#FFFBEB', border: '1px solid #F8E5A6', borderRadius: 16, padding: 12 },
    barRow: { display: 'grid', gridTemplateColumns: '1fr 72px 42px', gap: 12, alignItems: 'center' },
    barLabel: { fontSize: 12, color: '#4A5568', fontWeight: 600 },
    barTrack: { width: '100%', height: 10, background: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 999 },
    barValue: { fontSize: 12, fontWeight: 700, color: '#1A2332', textAlign: 'right' },
}
