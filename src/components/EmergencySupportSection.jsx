import React, { useState } from 'react'

export default function EmergencySupportSection() {
    const [expanded, setExpanded] = useState({})

    const emergencyData = {
        helplines: [
            {
                id: 'icall',
                name: 'iCall - Mental Health Support',
                number: '9152987821',
                availability: '24/7',
                description: 'Emotional support, crisis intervention, and counselling.',
                type: 'General Mental Health',
            },
            {
                id: 'aasra',
                name: 'AASRA - Suicide Prevention',
                number: '9820466726',
                availability: '24/7',
                description: 'Crisis support and suicide prevention helpline.',
                type: 'Crisis/Suicide Prevention',
            },
            {
                id: 'vandrevala',
                name: 'Vandrevala Foundation',
                number: '1860-2662-345',
                availability: '24/7',
                description: 'Emotional support and crisis intervention.',
                type: 'Crisis Support',
            },
            {
                id: 'mantra',
                name: 'Mantra Crisis Support',
                number: '9903987786',
                availability: '24/7',
                description: 'Counselling and crisis support for all age groups.',
                type: 'Counselling',
            },
            {
                id: 'befriend',
                name: 'Befrienders India',
                number: '9892900288',
                availability: '24/7',
                description: 'Emotional support and companionship.',
                type: 'Emotional Support',
            },
        ],
        therapists: [
            {
                id: 'psychology-today',
                name: 'Psychology Today - Therapist Directory',
                link: 'https://www.psychologytoday.com',
                description: 'Find licensed therapists in your area, filter by insurance and specialization.',
                specialty: 'Multi-specialty directory',
            },
            {
                id: 'practo',
                name: 'Practo - Online Therapists (India)',
                link: 'https://www.practo.com',
                description: 'Online and in-person therapists across India with verified credentials.',
                specialty: 'Indian therapist network',
            },
            {
                id: 'mindpeers',
                name: 'MindPeers - Online Therapy',
                link: 'https://www.mindpeers.com',
                description: 'Affordable online therapy with licensed psychologists.',
                specialty: 'Affordable online therapy',
            },
            {
                id: 'heartsupport',
                name: 'HeartSupport - Counselling Platform',
                link: 'https://www.heartsupport.in',
                description: 'Connect with experienced counsellors specializing in workplace stress and burnout.',
                specialty: 'Workplace stress & burnout',
            },
        ],
        crisisResources: [
            {
                id: 'suicide-prevention',
                name: 'International Association for Suicide Prevention',
                link: 'https://www.iasp.info/resources/Crisis_Centres/',
                description: 'Global database of crisis centers and resources.',
                category: 'Global',
            },
            {
                id: 'mental-health-india',
                name: 'Mental Health India - Resources',
                link: 'https://www.mentalhealth.org.in',
                description: 'Information on mental health rights, government schemes, and local resources.',
                category: 'India-specific',
            },
            {
                id: 'mental-health-foundation',
                name: 'Mental Health Foundation - Crisis Guide',
                link: 'https://www.mentalhealth.org.uk/our-work/public-engagement/how-to-support-someone-crisis',
                description: 'Guide on supporting someone in crisis and accessing emergency services.',
                category: 'Crisis Management',
            },
            {
                id: 'beyond-blue',
                name: 'Beyond Blue Crisis Support',
                link: 'https://www.beyondblue.org.au',
                description: 'Mental health resources, crisis support info, and recovery guidance.',
                category: 'Mental Health',
            },
            {
                id: 'healthy-minds',
                name: 'Healthy Minds - Crisis Toolkit',
                link: 'https://www.healthyminds.org',
                description: 'Practical toolkit for managing mental health crises.',
                category: 'Crisis Management',
            },
        ],
    }

    const toggleExpanded = (section, id) => {
        const key = `${section}-${id}`
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div style={styles.root}>
            <div style={styles.intro}>
                <div style={styles.introIcon}>🆘</div>
                <div style={styles.introText}>
                    <strong>Immediate support is available 24/7.</strong> If you're in crisis, reach out to any helpline below. You are not alone.
                </div>
            </div>

            {/* Helplines Section */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>📞 Crisis Helplines (India)</div>
                <div style={styles.itemsContainer}>
                    {emergencyData.helplines.map((item) => (
                        <div key={item.id} style={styles.card}>
                            <div style={styles.cardHeader} onClick={() => toggleExpanded('helpline', item.id)}>
                                <div>
                                    <div style={styles.cardName}>{item.name}</div>
                                    <div style={styles.cardNumber}>{item.number}</div>
                                </div>
                                <div style={styles.expandIcon}>{expanded[`helpline-${item.id}`] ? '−' : '+'}</div>
                            </div>
                            {expanded[`helpline-${item.id}`] && (
                                <div style={styles.cardExpanded}>
                                    <div style={styles.typeTag}>{item.type}</div>
                                    <div style={styles.cardDesc}>{item.description}</div>
                                    <div style={styles.availability}>✓ {item.availability}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Therapists Section */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>👨‍⚕️ Find a Therapist</div>
                <div style={styles.itemsContainer}>
                    {emergencyData.therapists.map((item) => (
                        <div key={item.id} style={styles.card}>
                            <div style={styles.cardHeader} onClick={() => toggleExpanded('therapist', item.id)}>
                                <div>
                                    <div style={styles.cardName}>{item.name}</div>
                                    <div style={styles.cardDesc}>{item.specialty}</div>
                                </div>
                                <div style={styles.expandIcon}>{expanded[`therapist-${item.id}`] ? '−' : '+'}</div>
                            </div>
                            {expanded[`therapist-${item.id}`] && (
                                <div style={styles.cardExpanded}>
                                    <div style={styles.cardDesc}>{item.description}</div>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                        Visit Platform →
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Crisis Resources Section */}
            <div style={styles.section}>
                <div style={styles.sectionTitle}>🛟 Crisis Resources & Information</div>
                <div style={styles.itemsContainer}>
                    {emergencyData.crisisResources.map((item) => (
                        <div key={item.id} style={styles.card}>
                            <div style={styles.cardHeader} onClick={() => toggleExpanded('resource', item.id)}>
                                <div>
                                    <div style={styles.cardName}>{item.name}</div>
                                    <div style={styles.categoryTag}>{item.category}</div>
                                </div>
                                <div style={styles.expandIcon}>{expanded[`resource-${item.id}`] ? '−' : '+'}</div>
                            </div>
                            {expanded[`resource-${item.id}`] && (
                                <div style={styles.cardExpanded}>
                                    <div style={styles.cardDesc}>{item.description}</div>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                        Visit Resource →
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Important Note */}
            <div style={styles.importantNote}>
                <div style={styles.noteIcon}>⚠️</div>
                <div style={styles.noteText}>
                    <strong>In immediate danger?</strong> Call emergency services (Police: 100, Ambulance: 102, Fire: 101) or go to the nearest hospital emergency room.
                </div>
            </div>
        </div>
    )
}

const styles = {
    root: { padding: '20px', maxWidth: 1000, margin: '0 auto' },
    intro: { background: '#FEF3C7', borderRadius: 16, padding: 24, marginBottom: 32, display: 'flex', gap: 16, alignItems: 'flex-start' },
    introIcon: { fontSize: 32, flexShrink: 0 },
    introText: { fontSize: 14, color: '#78350F', lineHeight: 1.8 },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
    itemsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
    card: { background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 4px 12px rgba(15,23,42,.08)' },
    cardHeader: { padding: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, transition: 'background .2s' },
    cardName: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 },
    cardNumber: { fontSize: 16, fontWeight: 700, color: '#DC2626', fontFamily: 'monospace' },
    cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 1.6 },
    expandIcon: { fontSize: 20, color: '#9CA3AF', fontWeight: 600, minWidth: 24, textAlign: 'center' },
    cardExpanded: { padding: '0 16px 16px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 12 },
    typeTag: { fontSize: 11, fontWeight: 700, color: '#065F46', background: '#D1FAE5', padding: '4px 8px', borderRadius: 6, width: 'fit-content' },
    categoryTag: { fontSize: 12, color: '#6B7280', marginTop: 4 },
    availability: { fontSize: 13, color: '#047857', fontWeight: 600 },
    link: { fontSize: 13, fontWeight: 600, color: '#2563EB', textDecoration: 'none', marginTop: 4, display: 'inline-block' },
    importantNote: { background: '#FEE2E2', borderRadius: 16, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start' },
    noteIcon: { fontSize: 24, flexShrink: 0 },
    noteText: { fontSize: 13, color: '#7F1D1D', lineHeight: 1.8 },
}
