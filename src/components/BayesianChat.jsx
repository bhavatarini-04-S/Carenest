// ─────────────────────────────────────────────────────────────────────────────
// BayesianSentimentPanel.jsx
// Live visualisation of the Bayesian Network inference results
// Place this file at: src/components/BayesianSentimentPanel.jsx
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react'

function Speedometer({ value, maxVal = 10 }) {
    const pct = Math.min(100, Math.max(0, (value / maxVal) * 100))
    let color = 'var(--sage-dark)'
    if (value >= 5) color = '#B8860B'
    if (value >= 8) color = '#C0392B'

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: 24 }}>
            <svg width="100%" height="80" viewBox="0 0 140 80" style={{ overflow: 'visible', maxWidth: 160 }}>
                <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke="var(--cream-dark)" strokeWidth="12" strokeLinecap="round" />
                <path d="M 10 65 A 60 60 0 0 1 130 65" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray="188.5" strokeDashoffset={188.5 - (188.5 * (pct / 100))} style={{ transition: 'stroke-dashoffset 0.6s ease-out, stroke 0.6s ease' }} />
                <text x="70" y="60" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--charcoal)">{value}</text>
                <text x="70" y="80" textAnchor="middle" fontSize="11" fill="var(--text-light)" fontWeight="700" letterSpacing="1px">DISTRESS</text>
            </svg>
        </div>
    )
}

function ProbBar({ label, value, color, maxVal = 1 }) {
    const pct = Math.round((value / maxVal) * 100)
    return (
        <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: 'var(--cream-dark)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                    height: '100%', width: `${pct}%`, background: color,
                    borderRadius: 3, transition: 'width .6s cubic-bezier(.4,0,.2,1)',
                }} />
            </div>
        </div>
    )
}

function StateNode({ label, active, color }) {
    return (
        <div style={{
            padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
            background: active ? color + '20' : 'var(--cream)',
            border: `1.5px solid ${active ? color : 'var(--cream-dark)'}`,
            color: active ? color : 'var(--text-light)',
            transition: 'all .3s ease',
            whiteSpace: 'nowrap',
        }}>
            {active ? '● ' : '○ '}{label}
        </div>
    )
}

export default function BayesianSentimentPanel({ sentiment }) {
    if (!sentiment || !sentiment.emotionalState) {
        return (
            <div style={s.empty}>
                <div style={s.emptyIcon}>🧠</div>
                <div style={s.emptyTitle}>Bayesian Network</div>
                <div style={s.emptyText}>Start a conversation — the network will analyse your emotional state in real time.</div>
            </div>
        )
    }

    const {
        emotionalState, cognitiveState, socialState,
        distressScore, confidence, crisisAlert,
        label, color, emoji, advice,
        cognitiveLabel, socialLabel,
        posteriors, features,
    } = sentiment

    const emotionalColors = {
        crisis: '#C0392B', distressed: '#C4785A',
        anxious: '#B8860B', neutral: '#5A7A3C', positive: '#2D6A4F',
    }
    const cognitiveColors = {
        overwhelmed: '#C0392B', strained: '#C4785A', moderate: '#B8860B', clear: '#2D6A4F',
    }
    const socialColors = {
        isolated: '#C0392B', withdrawn: '#C4785A', connected: '#5A7A3C', supported: '#2D6A4F',
    }

    const distressPct = Math.round(distressScore * 10)

    return (
        <div style={s.root}>
            {/* Crisis Alert */}
            {crisisAlert && (
                <div style={s.crisisAlert}>
                    <span style={{ fontSize: 16 }}>💛</span>
                    <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                        <strong>Crisis signals detected.</strong><br />
                        iCall: <strong>9152987821</strong> · Vandrevala: <strong>1860-2662-345</strong>
                    </div>
                </div>
            )}

            {/* Header */}
            <div style={s.header}>
                <div style={s.headerLeft}>
                    <div style={s.brainIcon}>🧠</div>
                    <div>
                        <div style={s.title}>Bayesian Network</div>
                        <div style={s.subtitle}>Real-time sentiment inference</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ ...s.confidenceBadge, background: color + '18', color, borderColor: color + '44' }}>
                        {confidence}% confidence
                    </div>
                </div>
            </div>

            {/* Primary Result */}
            <div style={{ ...s.resultCard, borderColor: color + '55', background: color + '08' }}>
                <div style={s.resultTop}>
                    <span style={{ fontSize: 28 }}>{emoji}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ ...s.resultLabel, color }}>{label}</div>
                        <div style={s.resultAdvice}>{advice}</div>
                    </div>
                </div>
                {/* Distress meter / Speedometer */}
                <Speedometer value={distressScore} />
            </div>

            {/* Hidden State Posteriors */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Posterior probabilities — Emotional state H₁</div>
                {posteriors?.emotional && Object.entries(posteriors.emotional)
                    .sort((a, b) => b[1] - a[1])
                    .map(([state, prob]) => (
                        <ProbBar
                            key={state}
                            label={state.charAt(0).toUpperCase() + state.slice(1)}
                            value={prob}
                            color={emotionalState === state ? (emotionalColors[state] || 'var(--sage-dark)') : 'var(--sage-light)'}
                        />
                    ))
                }
            </div>

            {/* Network Nodes — 3 hidden states */}
            <div style={s.section}>
                <div style={s.sectionTitle}>Hidden state nodes</div>
                <div style={s.nodesGrid}>
                    <div>
                        <div style={s.nodeGroupLabel}>Emotional H₁</div>
                        <div style={s.nodeGroup}>
                            {['crisis', 'distressed', 'anxious', 'neutral', 'positive'].map(state => (
                                <StateNode key={state} label={state} active={emotionalState === state} color={emotionalColors[state]} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={s.nodeGroupLabel}>Cognitive H₂</div>
                        <div style={s.nodeGroup}>
                            {['overwhelmed', 'strained', 'moderate', 'clear'].map(state => (
                                <StateNode key={state} label={state} active={cognitiveState === state} color={cognitiveColors[state]} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={s.nodeGroupLabel}>Social H₃</div>
                        <div style={s.nodeGroup}>
                            {['isolated', 'withdrawn', 'connected', 'supported'].map(state => (
                                <StateNode key={state} label={state} active={socialState === state} color={socialColors[state]} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Evidence Features */}
            {features && Object.keys(features).length > 0 && (
                <div style={s.section}>
                    <div style={s.sectionTitle}>Observable evidence nodes</div>
                    {[
                        { key: 'E1', label: 'Lexical distress', val: features.E1 },
                        { key: 'E2', label: 'Negation density', val: features.E2 },
                        { key: 'E3', label: 'First-person intensity', val: features.E3 },
                        { key: 'E4', label: 'Urgency markers', val: features.E4 },
                        { key: 'E5', label: 'Temporal despair', val: features.E5 },
                        { key: 'E6', label: 'Isolation cues', val: features.E6 },
                        { key: 'E7', label: 'Cognitive distortion', val: features.E7 },
                        { key: 'E8', label: 'Positive affect', val: features.E8 },
                    ].map(({ key, label, val }) => (
                        <ProbBar
                            key={key}
                            label={`${key}: ${label}`}
                            value={val}
                            color={
                                key === 'E8'
                                    ? 'var(--sage-dark)'
                                    : val > 0.6 ? '#C0392B' : val > 0.3 ? '#C4785A' : 'var(--sage)'
                            }
                        />
                    ))}
                </div>
            )}

            <div style={s.footer}>
                Dynamic Bayesian Network · Variable Elimination inference · {new Date().toLocaleTimeString()}
            </div>
        </div>
    )
}

const s = {
    root: { display: 'flex', flexDirection: 'column', gap: 16, padding: '20px', background: 'var(--off-white)', borderRadius: 20, border: '1.5px solid var(--cream-dark)', height: '100%', overflowY: 'auto' },
    empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, textAlign: 'center', flex: 1 },
    emptyIcon: { fontSize: 40 },
    emptyTitle: { fontFamily: 'Fraunces,serif', fontSize: 18, fontWeight: 400, color: 'var(--charcoal)' },
    emptyText: { fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 220 },
    crisisAlert: { display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(192,57,43,.08)', border: '1.5px solid rgba(192,57,43,.3)', borderRadius: 12, padding: '12px 14px', color: '#A93226' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    brainIcon: { fontSize: 22 },
    title: { fontFamily: 'Fraunces,serif', fontSize: 15, fontWeight: 600, color: 'var(--charcoal)', lineHeight: 1.2 },
    subtitle: { fontSize: 11, color: 'var(--text-light)' },
    confidenceBadge: { fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: '1px solid', display: 'inline-block' },
    resultCard: { border: '1.5px solid', borderRadius: 16, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 },
    resultTop: { display: 'flex', alignItems: 'flex-start', gap: 12 },
    resultLabel: { fontSize: 15, fontWeight: 700, marginBottom: 3 },
    resultAdvice: { fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 },
    meterWrap: {},
    meterTrack: { height: 8, background: 'var(--cream-dark)', borderRadius: 4, overflow: 'hidden', position: 'relative' },
    meterLabels: { display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'var(--text-light)' },
    section: { display: 'flex', flexDirection: 'column', gap: 6 },
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text-light)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4, paddingBottom: 6, borderBottom: '1px solid var(--cream-dark)' },
    nodesGrid: { display: 'flex', flexDirection: 'column', gap: 12 },
    nodeGroupLabel: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 },
    nodeGroup: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    footer: { fontSize: 10, color: 'var(--text-light)', textAlign: 'center', paddingTop: 8, borderTop: '1px solid var(--cream-dark)' },
}
