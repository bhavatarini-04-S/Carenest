import React, { useState } from 'react'

export default function EmergencySafety() {
    const [contacts, setContacts] = useState([])
    const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' })
    const [locationShared, setLocationShared] = useState(false)
    const [fallDetectionEnabled, setFallDetectionEnabled] = useState(false)

    const addContact = () => {
        if (newContact.name && newContact.phone) {
            setContacts([...contacts, { ...newContact, id: Date.now() }])
            setNewContact({ name: '', phone: '', relation: '' })
        }
    }

    const removeContact = (id) => {
        setContacts(contacts.filter(c => c.id !== id))
    }

    const handleEmergencySOS = () => {
        alert('🆘 EMERGENCY SOS ACTIVATED\n\nEmergency contacts are being notified with your location.\n\nAmbulance services are being contacted.')
    }

    const findNearbyHospital = () => {
        alert('🏥 Searching for nearby hospitals...\n\nTop hospitals near you:\n1. General Hospital - 2km away\n2. City Medical Center - 5km away\n3. Emergency Care Clinic - 8km away')
    }

    const callAmbulance = () => {
        alert('🚑 Ambulance services contacted!\n\nAmbulance ETA: 5-8 minutes\n\nDispatcher will call you shortly for confirmation.')
    }

    const shareLocation = () => {
        setLocationShared(!locationShared)
        if (!locationShared) {
            alert('📍 Location sharing enabled\n\nYour emergency contacts can now see your live location in real-time.')
        } else {
            alert('📍 Location sharing disabled')
        }
    }

    return (
        <div style={s.container}>
            {/* Emergency SOS Button - Large and Prominent */}
            <section style={s.sosSection}>
                <button
                    style={s.sosButton}
                    onClick={handleEmergencySOS}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    <span style={s.sosIcon}>🆘</span>
                    <div style={s.sosText}>
                        <strong>EMERGENCY SOS</strong>
                        <p>One-touch alert to all emergency contacts</p>
                    </div>
                </button>
                <p style={s.sosNote}>Press in case of emergency to instantly alert family and emergency services</p>
            </section>

            {/* Quick Emergency Actions */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🚨 Quick Emergency Actions</h2>
                <div style={s.quickGrid}>
                    <div style={s.card}>
                        <div style={s.cardContent}>
                            <div style={s.cardIcon}>🏥</div>
                            <h3 style={s.cardTitle}>Find Hospital</h3>
                            <p style={s.cardDesc}>Locate nearby hospitals and medical centers</p>
                            <button style={s.actionBtn} onClick={findNearbyHospital}>Find Now</button>
                        </div>
                    </div>

                    <div style={s.card}>
                        <div style={s.cardContent}>
                            <div style={s.cardIcon}>🚑</div>
                            <h3 style={s.cardTitle}>Call Ambulance</h3>
                            <p style={s.cardDesc}>Request emergency ambulance immediately</p>
                            <button style={s.actionBtn} onClick={callAmbulance}>Request</button>
                        </div>
                    </div>

                    <div style={s.card}>
                        <div style={s.cardContent}>
                            <div style={s.cardIcon}>📍</div>
                            <h3 style={s.cardTitle}>Live Location</h3>
                            <p style={s.cardDesc}>Share real-time location with family</p>
                            <button style={{ ...s.actionBtn, background: locationShared ? '#10B981' : '#6B7280' }} onClick={shareLocation}>
                                {locationShared ? '✓ Sharing' : 'Enable'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fall Detection */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>⚠️ Fall Detection Alerts</h2>
                <div style={s.card}>
                    <div style={s.toggleContainer}>
                        <div>
                            <h3 style={s.cardTitle}>Automatic Fall Detection</h3>
                            <p style={{ color: '#666', fontSize: '14px', margin: '8px 0 0 0' }}>
                                Your device will automatically detect falls and send alerts to emergency contacts
                            </p>
                        </div>
                        <label style={s.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={fallDetectionEnabled}
                                onChange={(e) => setFallDetectionEnabled(e.target.checked)}
                                style={{ display: 'none' }}
                            />
                            <div style={{ ...s.toggle, background: fallDetectionEnabled ? '#10B981' : '#D1D5DB' }}></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Emergency Contacts */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>👥 Emergency Contact List</h2>
                <div style={s.card}>
                    <div style={s.inputGrid}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Contact Name</label>
                            <input
                                type="text"
                                style={s.input}
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                placeholder="e.g., John (Son)"
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Phone Number</label>
                            <input
                                type="tel"
                                style={s.input}
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Relation</label>
                            <input
                                type="text"
                                style={s.input}
                                value={newContact.relation}
                                onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                                placeholder="e.g., Son/Daughter/Spouse"
                            />
                        </div>
                    </div>
                    <button style={s.addBtn} onClick={addContact}>+ Add Contact</button>
                </div>

                <div style={s.listContainer}>
                    {contacts.length > 0 && contacts.map(contact => (
                        <div key={contact.id} style={s.contactItem}>
                            <div style={s.contactInfo}>
                                <strong style={{ fontSize: '15px' }}>{contact.name}</strong>
                                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>{contact.phone}</p>
                                <p style={{ margin: '2px 0', fontSize: '12px', color: '#999' }}>{contact.relation}</p>
                            </div>
                            <div style={s.contactActions}>
                                <button style={s.callBtn} onClick={() => alert(`Calling ${contact.phone}`)}>📞</button>
                                <button style={s.smsBtn} onClick={() => alert(`SMS sent to ${contact.phone}`)}>💬</button>
                                <button style={s.deleteBtn} onClick={() => removeContact(contact.id)}>✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Emergency Services */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>☎️ Emergency Services</h2>
                <div style={s.servicesGrid}>
                    <div style={s.serviceCard}>
                        <div style={s.serviceNumber}>911</div>
                        <p style={s.serviceLabel}>Emergency Services</p>
                    </div>
                    <div style={s.serviceCard}>
                        <div style={s.serviceNumber}>988</div>
                        <p style={s.serviceLabel}>Suicide Prevention</p>
                    </div>
                    <div style={s.serviceCard}>
                        <div style={s.serviceNumber}>1-800-222-1222</div>
                        <p style={s.serviceLabel}>Poison Control</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

const s = {
    container: { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'slideUp 0.5s ease' },
    sosSection: { marginBottom: '24px' },
    sosButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        padding: '32px',
        background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)',
        fontSize: '16px',
        fontWeight: 700,
    },
    sosIcon: { fontSize: '48px', display: 'flex', alignItems: 'center' },
    sosText: { textAlign: 'left' },
    sosNote: { marginTop: '12px', fontSize: '13px', color: '#666', fontStyle: 'italic' },
    section: { display: 'flex', flexDirection: 'column', gap: '16px' },
    sectionTitle: { fontSize: '20px', fontWeight: 700, color: '#1F2937', margin: 0, marginBottom: '8px' },
    quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' },
    card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' },
    cardIcon: { fontSize: '32px' },
    cardTitle: { fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 },
    cardDesc: { fontSize: '13px', color: '#666', margin: 0 },
    actionBtn: { padding: '8px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' },
    toggleContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    toggleSwitch: { cursor: 'pointer', display: 'flex', alignItems: 'center' },
    toggle: { width: '50px', height: '28px', borderRadius: '14px', transition: '0.3s' },
    inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '12px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
    input: { padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
    addBtn: { marginTop: '16px', padding: '10px 20px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    contactItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F9FAFB', borderRadius: '8px', borderLeft: '4px solid #DC2626' },
    contactInfo: { flex: 1 },
    contactActions: { display: 'flex', gap: '8px' },
    callBtn: { padding: '6px 12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    smsBtn: { padding: '6px 12px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    deleteBtn: { padding: '6px 12px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
    serviceCard: { background: '#FEE2E2', padding: '20px', borderRadius: '12px', textAlign: 'center', borderLeft: '4px solid #DC2626' },
    serviceNumber: { fontSize: '24px', fontWeight: 700, color: '#DC2626', marginBottom: '8px' },
    serviceLabel: { fontSize: '13px', color: '#666', margin: 0 },
}
