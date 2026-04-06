import React, { useState } from 'react'
import useStore from '../store/useStore'

export default function DecisionIntelligence() {
    const [decision, setDecision] = useState('')
    const [category, setCategory] = useState('career')
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const { language } = useStore()

    const categories = [
        { id: 'career', label: '💼 Career Decision', icon: '💼' },
        { id: 'parenting', label: '👨‍👩‍👧‍👦 Parenting Dilemma', icon: '👨‍👩‍👧‍👦' },
        { id: 'financial', label: '💰 Financial Choice', icon: '💰' },
    ]

    // Enhanced analysis frameworks for each decision type
    function generateCategorySpecificAnalysis(decisionText, decisionCategory) {
        const frameworks = {
            career: {
                prosCons: {
                    pros: [
                        'Career growth and skill development opportunities',
                        'Potential increase in income and financial stability',
                        'Enhanced professional reputation and network expansion',
                        'Personal fulfillment and alignment with core values',
                        'Improved work-life balance and job satisfaction',
                    ],
                    cons: [
                        'Initial transition period and learning curve',
                        'Potential salary adjustment during change',
                        'Risk of unfamiliar work environment and culture',
                        'Time investment in training and skill building',
                        'Uncertainty about long-term career trajectory',
                    ]
                },
                emotionalImpact: 'Career changes trigger anxiety about uncertainty, but also excitement about new possibilities. Consider how this aligns with your professional identity and aspirations. Trust that your skills are transferable and valuable.',
                practicalImpact: 'Evaluate your financial runway, market demand for your skills, and required certifications. Research industry standards, salary ranges, and job availability in your target role.',
                longTermView: 'In 5 years, this decision will shape your expertise, earning potential, and career trajectory. Choose paths that build toward your 10-year vision and create compound professional growth.',
                shortTermView: 'Next 3 months: Prepare financially, update your resume/portfolio, build relevant skills through courses or side projects. Consider part-time exploration before full commitment.',
                recommendation: 'Career decisions are investments in your future self. Balance ambition with pragmatism—take calculated risks after thorough research and skill preparation.',
            },
            parenting: {
                prosCons: {
                    pros: [
                        'Demonstrates commitment to child\'s wellbeing and development',
                        'Builds stronger emotional connection and trust',
                        'Models important values and life lessons',
                        'Creates lasting positive memories and bonding',
                        'Supports healthy child development and confidence',
                    ],
                    cons: [
                        'Requires significant time and energy commitment',
                        'May involve financial investment or resource allocation',
                        'Potential conflict with other family members',
                        'Personal sacrifice of time for self-care or work',
                        'Uncertainty about outcomes and effectiveness',
                    ]
                },
                emotionalImpact: 'Parenting decisions often trigger guilt, worry, and doubt—this is normal. Remember that "good enough" parenting prioritizes your child\'s safety while maintaining your own wellbeing. Your emotional bandwidth matters too.',
                practicalImpact: 'Assess impact on family schedule, budget, siblings, and your capacity. Consider your child\'s age, readiness, and personality. Are resources (time, money, expertise) available?',
                longTermView: 'Think about what your child will remember and value at age 25. Will this decision strengthen their character, skills, or relationship with you? Consider long-term patterns, not one-time decisions.',
                shortTermView: 'Next month: Assess realistic capacity. Can you sustain this commitment without burnout? Involve your child in age-appropriate ways. Start small and scale up if it\'s working.',
                recommendation: 'The best parenting decisions balance your child\'s needs with your family\'s realistic capacity. Children thrive with present, healthy parents more than perfect parenting.',
            },
            financial: {
                prosCons: {
                    pros: [
                        'Builds emergency fund and long-term financial security',
                        'Reduces financial stress and anxiety',
                        'Creates opportunities for future investments and goals',
                        'Improves debt-to-income ratio and credit score',
                        'Enables flexibility for opportunities and unexpected events',
                    ],
                    cons: [
                        'Short-term lifestyle adjustments and spending discipline',
                        'Opportunity cost of money used for other priorities',
                        'Market risk if investing in stocks or crypto',
                        'Requires consistent commitment and habit change',
                        'May delay gratification for current desires',
                    ]
                },
                emotionalImpact: 'Money decisions trigger fear, shame, or urgency. Separate your net worth from your self-worth. Every financial decision is a step toward freedom, not restriction.',
                practicalImpact: 'Calculate exact numbers: monthly cost, total investment, break-even point, and monthly savings. Compare to income, current debt, and emergency reserves. Check current interest rates and market conditions.',
                longTermView: 'In 5 years, this financial choice contributes to your security, freedom, and optionality. Compound interest works for those who stay disciplined. Consider inflation and wage growth projections.',
                shortTermView: 'Next 30 days: Create a detailed budget, automate transfers, and track spending. Small behavioral changes compound—starting now matters more than perfection.',
                recommendation: 'Financial decisions require both emotional alignment and mathematical clarity. Start small, build discipline, and use automation to remove willpower from the equation.',
            }
        }
        
        return frameworks[decisionCategory] || frameworks.career
    }

    async function analyzeDecision() {
        if (!decision.trim()) return

        setLoading(true)
        try {
            const response = await fetch('/api/analyze-decision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision, category, language }),
            })

            if (response.ok) {
                const data = await response.json()
                setAnalysis(data)
            } else {
                // Fallback to category-specific analysis
                const baseAnalysis = generateCategorySpecificAnalysis(decision, category)
                setAnalysis({
                    category,
                    decision,
                    ...baseAnalysis,
                })
            }
        } catch (error) {
            console.error('Analysis error:', error)
            const baseAnalysis = generateCategorySpecificAnalysis(decision, category)
            setAnalysis({
                category,
                decision,
                ...baseAnalysis,
            })
        } finally {
            setLoading(false)
        }
    }

    function reset() {
        setDecision('')
        setAnalysis(null)
    }

    return (
        <div style={s.root}>
            {!analysis ? (
                <div style={s.input_section}>
                    <div style={s.card}>
                        <div style={s.card_title}>Decision Intelligence System</div>
                        <div style={s.card_subtitle}>
                            Get structured analysis combining emotional wisdom with practical thinking
                        </div>

                        <div style={s.field_group}>
                            <label style={s.label}>What type of decision are you facing?</label>
                            <div style={s.category_buttons}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        style={{
                                            ...s.category_btn,
                                            ...(category === cat.id ? s.category_btn_active : {}),
                                        }}
                                        onClick={() => setCategory(cat.id)}
                                    >
                                        <span style={s.cat_icon}>{cat.icon}</span>
                                        <span>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={s.field_group}>
                            <label style={s.label}>Describe the decision in detail</label>
                            <textarea
                                style={s.textarea}
                                placeholder={
                                    category === 'career'
                                        ? 'What role/change are you considering? Current salary, hours worked, skills needed, company culture concerns? Your dreams and fears about this change?'
                                        : category === 'parenting'
                                        ? 'What\'s your parenting dilemma? Child\'s age, current situation, your concerns, values at stake? What would "success" look like?'
                                        : 'What\'s the financial decision? Amount, purpose, timeline, impact on budget? Current financial situation and goals?'
                                }
                                value={decision}
                                onChange={(e) => setDecision(e.target.value)}
                                rows={6}
                            />
                            <div style={s.char_count}>{decision.length} characters</div>
                        </div>

                        <button
                            style={{...s.analyze_btn, opacity: decision.trim() ? 1 : 0.5}}
                            onClick={analyzeDecision}
                            disabled={!decision.trim() || loading}
                        >
                            {loading ? '⏳ Analyzing...' : '🔍 Analyze Decision'}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={s.analysis_section}>
                    <button
                        style={s.back_btn}
                        onClick={reset}
                    >
                        ← New Decision
                    </button>

                    <div style={s.card}>
                        <div style={s.analysis_title}>Decision Analysis</div>
                        <div style={s.decision_category}>{analysis.category === 'career' ? '💼 Career' : analysis.category === 'parenting' ? '👨‍👩‍👧‍👦 Parenting' : '💰 Financial'}</div>
                        <div style={s.decision_text}>{analysis.decision}</div>
                    </div>

                    {/* Pros & Cons */}
                    <div style={s.grid}>
                        <div style={s.card}>
                            <div style={s.section_title}>✅ Strengths & Pros</div>
                            <ul style={s.list}>
                                {(analysis.prosCons?.pros || []).map((pro, i) => (
                                    <li key={i} style={s.list_item}>
                                        <span style={s.bullet}>•</span>
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div style={s.card}>
                            <div style={s.section_title}>⚠️ Challenges & Cons</div>
                            <ul style={s.list}>
                                {(analysis.prosCons?.cons || []).map((con, i) => (
                                    <li key={i} style={s.list_item}>
                                        <span style={s.bullet}>•</span>
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Emotional & Practical */}
                    <div style={s.grid}>
                        <div style={s.card}>
                            <div style={s.section_title}>💙 Emotional Impact</div>
                            <p style={s.impact_text}>{analysis.emotionalImpact}</p>
                        </div>

                        <div style={s.card}>
                            <div style={s.section_title}>📋 Practical Impact</div>
                            <p style={s.impact_text}>{analysis.practicalImpact}</p>
                        </div>
                    </div>

                    {/* Time Horizons */}
                    <div style={s.grid}>
                        <div style={s.card}>
                            <div style={s.section_title}>🚀 5-Year Vision (Long-Term)</div>
                            <p style={s.impact_text}>{analysis.longTermView}</p>
                        </div>

                        <div style={s.card}>
                            <div style={s.section_title}>⚡ Next 3 Months (Short-Term)</div>
                            <p style={s.impact_text}>{analysis.shortTermView}</p>
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div style={s.card}>
                        <div style={s.section_title}>🎯 Decision Recommendation</div>
                        <p style={s.recommendation_text}>{analysis.recommendation}</p>
                        
                        <div style={s.action_section}>
                            <div style={s.action_title}>Next Steps:</div>
                            {category === 'career' && (
                                <ul style={s.action_list}>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Research roles, salary benchmarks, and required skills</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Build or strengthen relevant skills through courses/projects</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Network with professionals in the target field</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Update resume and portfolio before applying</li>
                                </ul>
                            )}
                            {category === 'parenting' && (
                                <ul style={s.action_list}>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Talk openly with your child (age-appropriate)</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Research best practices for your situation</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Set clear expectations and boundaries</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Build in regular check-ins to assess and adjust</li>
                                </ul>
                            )}
                            {category === 'financial' && (
                                <ul style={s.action_list}>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Create a detailed budget and financial plan</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Set up automatic transfers or payments</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Track progress monthly and celebrate milestones</li>
                                    <li style={s.action_item}><span style={s.bullet}>•</span>Review and adjust strategy quarterly</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const s = {
    root: { display: 'flex', flexDirection: 'column', gap: 24, padding: '0' },

    input_section: {},
    analysis_section: { display: 'flex', flexDirection: 'column', gap: 24 },
    back_btn: { alignSelf: 'flex-start', background: 'transparent', border: 'none', color: '#4A57A0', cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 16, transition: '.2s' },

    card: { background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)', border: '1px solid var(--cream-dark)' },

    card_title: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
    card_subtitle: { fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 24 },

    field_group: { marginBottom: 24 },
    label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 12 },

    category_buttons: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
    category_btn: { padding: '16px 12px', background: '#F3F4F6', border: '1.5px solid #E5E7EB', borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: '#475569', transition: '.2s' },
    category_btn_active: { background: '#4A57A0', borderColor: '#4A57A0', color: 'white' },
    cat_icon: { fontSize: 24 },

    textarea: { width: '100%', padding: '14px 16px', border: '1.5px solid var(--cream-dark)', borderRadius: 14, fontSize: 13, fontFamily: 'DM Sans, sans-serif', color: '#0F172A', background: '#F9FAFB', outline: 'none', resize: 'none', lineHeight: 1.6 },
    char_count: { fontSize: 11, color: '#9CA3AF', marginTop: 6, textAlign: 'right' },

    analyze_btn: { width: '100%', padding: '14px 28px', background: '#4A57A0', color: 'white', border: 'none', borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: '.2s', marginTop: 16 },

    analysis_title: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 12 },
    decision_category: { fontSize: 12, fontWeight: 600, color: '#7B8EC8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 },
    decision_text: { fontSize: 15, color: '#475569', lineHeight: 1.7, fontStyle: 'italic', padding: '16px', background: '#F9FAFB', borderRadius: 12, marginBottom: 20 },

    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },

    section_title: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 },

    list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 },
    list_item: { fontSize: 13, color: '#475569', paddingLeft: 0, position: 'relative', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 10 },
    bullet: { color: '#4A57A0', fontWeight: 700, fontSize: 16, minWidth: 12, flexShrink: 0, marginTop: 0 },
    impact_text: { fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 },

    recommendation_text: { fontSize: 14, color: '#0F172A', lineHeight: 1.8, padding: '16px', background: 'linear-gradient(135deg, #EEF2FF, #E0E5F8)', borderRadius: 12, margin: 0, fontWeight: 500, borderLeft: '4px solid #4A57A0' },
    
    action_section: { marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E7EB' },
    action_title: { fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.05em' },
    action_list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 },
    action_item: { fontSize: 13, color: '#475569', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 10 },
}
