import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { updateProfileField } from '../lib/userProfile'

const PROFS = [
    { emoji: '🎓', name: 'Student', hint: 'School, college, university' },
    { emoji: '💻', name: 'Tech Professional', hint: 'Developer, designer, PM' },
    { emoji: '🏥', name: 'Healthcare Worker', hint: 'Doctor, nurse, paramedic' },
    { emoji: '📚', name: 'Educator', hint: 'Teacher, professor, tutor' },
    { emoji: '🎨', name: 'Creative / Artist', hint: 'Designer, writer, musician' },
    { emoji: '💼', name: 'Business / Manager', hint: 'Executive, team lead, sales' },
    { emoji: '🏠', name: 'Homemaker', hint: 'Full-time family caregiver' },
    { emoji: '🔧', name: 'Trades / Blue Collar', hint: 'Mechanic, electrician, etc.' },
    { emoji: '🌐', name: 'Job Seeking', hint: 'Between opportunities' },
    { emoji: '🌅', name: 'Retired', hint: 'Post-career life' },
    { emoji: '🤐', name: 'Prefer not to say', hint: "That's completely fine" },
    { emoji: '✨', name: 'Other', hint: 'Tell us in chat' },
]

export default function ProfessionSelect() {
    const navigate = useNavigate()
    const { ageCategory, professions, toggleProfession } = useStore()

    return (
        <div style={s.page}>
            <div style={s.header}>
                <div style={s.steps}>
                    <div style={{ ...s.dot, background: 'var(--sage-light)' }} />
                    <div style={{ ...s.dot, ...s.dotActive }} />
                </div>
                <h1 style={s.title}>What does your<br /><em style={{ fontStyle: 'italic', color: 'var(--sage-dark)' }}>day look like?</em></h1>
                <p style={s.sub}>Your work shapes your stresses. Knowing your world helps us support you better. Choose all that apply.</p>
            </div>

            <div style={s.grid}>
                {PROFS.map((p) => {
                    const active = professions.includes(p.name)
                    return (
                        <div key={p.name} onClick={() => toggleProfession(p.name)} style={{
                            ...s.card,
                            borderColor: active ? 'var(--sage-dark)' : 'transparent',
                            background: active ? 'rgba(107,143,113,.06)' : 'white',
                            transform: active ? 'translateY(-4px)' : 'none',
                            boxShadow: active ? '0 8px 24px rgba(107,143,113,.15)' : '0 2px 12px rgba(0,0,0,.04)',
                        }}>
                            {active && <div style={s.check}>✓</div>}
                            <div style={{ fontSize: 32, marginBottom: 10 }}>{p.emoji}</div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>{p.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{p.hint}</div>
                        </div>
                    )
                })}
            </div>

            <div style={s.footer}>
                <button style={s.btn} onClick={async () => {
                    // Save professions as comma-separated string
                    await updateProfileField('profession', professions.join(', '))
                    navigate(ageCategory === '45+' ? '/dashboard/senior' : '/dashboard')
                }}>Enter my CareNest →</button>
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
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, maxWidth: 960, margin: '0 auto 40px' },
    card: { borderRadius: 18, padding: '28px 20px', cursor: 'pointer', transition: '.25s', border: '2px solid transparent', textAlign: 'center', position: 'relative' },
    check: { position: 'absolute', top: 10, right: 12, fontSize: 12, color: 'var(--sage-dark)', fontWeight: 700 },
    footer: { display: 'flex', justifyContent: 'center', marginTop: 48 },
    btn: { padding: '18px 56px', background: 'var(--sage-dark)', color: 'white', borderRadius: 16, fontSize: 17, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif' },
}