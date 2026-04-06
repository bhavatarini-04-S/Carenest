import React, { useState } from 'react'
import useStore from '../store/useStore'

const QUESTIONS = [
    { id: 'EE1', text: 'I feel emotionally drained from my work.', dim: 'EE' },
    { id: 'EE2', text: 'I feel used up at the end of the working day.', dim: 'EE' },
    { id: 'EE3', text: 'I feel fatigued when I get up in the morning and have to face another day on the job.', dim: 'EE' },
    { id: 'DP1', text: 'I feel I treat some recipients as if they were impersonal objects.', dim: 'DP' },
    { id: 'DP2', text: 'I’ve become more callous toward people since I took this job.', dim: 'DP' },
    { id: 'PA1', text: 'I can easily understand how my recipients feel about things.', dim: 'PA' },
    { id: 'PA2', text: 'I deal very effectively with the problems of my recipients.', dim: 'PA' },
]

const SCALE = [
    { val: 0, label: 'Never' },
    { val: 1, label: 'A few times a year' },
    { val: 2, label: 'Once a month' },
    { val: 3, label: 'A few times a month' },
    { val: 4, label: 'Once a week' },
    { val: 5, label: 'A few times a week' },
    { val: 6, label: 'Every day' },
]

export default function BurnoutScorer({ onComplete }) {
    const addBurnoutScore = useStore((s) => s.addBurnoutScore)
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState({})

    const currentQ = QUESTIONS[step]

    function pick(val) {
        const nextAnswers = { ...answers, [currentQ.id]: val }
        setAnswers(nextAnswers)

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1)
        } else {
            finish(nextAnswers)
        }
    }

    function finish(finalAnswers) {
        // Scoring logic (Simplified MBI)
        let ee = 0, dp = 0, pa = 0;
        QUESTIONS.forEach(q => {
            const val = finalAnswers[q.id]
            if (q.dim === 'EE') ee += val
            else if (q.dim === 'DP') dp += val
            else if (q.dim === 'PA') pa += val
        })

        // EE and DP high = burnout. PA high = low burnout.
        // We'll calculate a simple risk score from 0-100
        // Max EE = 3*6 = 18, Max DP = 2*6 = 12, Max PA = 2*6 = 12
        // Inverse PA: (12 - PA)
        const total = ee + dp + (12 - pa)
        const max = 18 + 12 + 12
        const pct = Math.round((total / max) * 100)

        const result = {
            date: new Date().toISOString(),
            score: pct,
            dimensions: { ee, dp, pa }
        }

        addBurnoutScore(result)
        if (onComplete) onComplete(result)
    }

    return (
        <div style={s.container}>
            <div style={s.progress}>
                <div style={{ ...s.progressBar, width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
            </div>
            
            <div style={s.content}>
                <div style={s.meta}>Step {step + 1} of {QUESTIONS.length} · {currentQ.dim === 'EE' ? 'Emotional Energy' : currentQ.dim === 'DP' ? 'Connection' : 'Accomplishment'}</div>
                <h2 style={s.question}>{currentQ.text}</h2>
                
                <div style={s.options}>
                    {SCALE.map((o) => (
                        <button key={o.val} onClick={() => pick(o.val)} style={s.optionBtn}>
                            <span style={s.optionVal}>{o.val}</span>
                            <span style={s.optionLabel}>{o.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

const s = {
    container: { background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.08)', padding: 0 },
    progress: { height: 6, background: '#F0F2FF', width: '100%' },
    progressBar: { height: '100%', background: 'var(--sage-dark)', transition: '.4s ease' },
    content: { padding: '40px 32px' },
    meta: { fontSize: 11, fontWeight: 600, color: 'var(--sage-dark)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 },
    question: { fontFamily: 'Fraunces,serif', fontSize: 24, fontWeight: 400, color: 'var(--charcoal)', marginBottom: 32, lineHeight: 1.4 },
    options: { display: 'flex', flexDirection: 'column', gap: 8 },
    optionBtn: { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', background: '#F8F9FA', border: '1.5px solid transparent', borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: '.2s' },
    optionVal: { width: 28, height: 28, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--sage-dark)', boxShadow: '0 2px 4px rgba(0,0,0,.05)' },
    optionLabel: { fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 },
}
