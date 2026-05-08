import React, { useState } from 'react'

export default function HealthMonitoring() {
    const [healthData, setHealthData] = useState({
        bloodPressure: { systolic: '', diastolic: '' },
        sugarLevel: '',
        heartRate: '',
        bmi: { weight: '', height: '' },
    })

    const [medicines, setMedicines] = useState([])
    const [appointments, setAppointments] = useState([])
    const [newMedicine, setNewMedicine] = useState({ name: '', time: '', dosage: '' })
    const [newAppointment, setNewAppointment] = useState({ doctor: '', date: '', time: '', notes: '' })

    const calculateBMI = () => {
        if (healthData.bmi.weight && healthData.bmi.height) {
            const height = healthData.bmi.height / 100
            const bmi = (healthData.bmi.weight / (height * height)).toFixed(1)
            return bmi
        }
        return null
    }

    const addMedicine = () => {
        if (newMedicine.name && newMedicine.time) {
            setMedicines([...medicines, { ...newMedicine, id: Date.now() }])
            setNewMedicine({ name: '', time: '', dosage: '' })
        }
    }

    const addAppointment = () => {
        if (newAppointment.doctor && newAppointment.date) {
            setAppointments([...appointments, { ...newAppointment, id: Date.now() }])
            setNewAppointment({ doctor: '', date: '', time: '', notes: '' })
        }
    }

    const removeMedicine = (id) => {
        setMedicines(medicines.filter(m => m.id !== id))
    }

    const removeAppointment = (id) => {
        setAppointments(appointments.filter(a => a.id !== id))
    }

    return (
        <div style={s.container}>
            {/* Daily Health Check */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>📊 Daily Health Check</h2>
                
                {/* Blood Pressure */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>💓 Blood Pressure Monitoring</h3>
                    <div style={s.inputGrid}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Systolic (mmHg)</label>
                            <input
                                type="number"
                                style={s.input}
                                value={healthData.bloodPressure.systolic}
                                onChange={(e) => setHealthData({
                                    ...healthData,
                                    bloodPressure: { ...healthData.bloodPressure, systolic: e.target.value }
                                })}
                                placeholder="e.g., 120"
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Diastolic (mmHg)</label>
                            <input
                                type="number"
                                style={s.input}
                                value={healthData.bloodPressure.diastolic}
                                onChange={(e) => setHealthData({
                                    ...healthData,
                                    bloodPressure: { ...healthData.bloodPressure, diastolic: e.target.value }
                                })}
                                placeholder="e.g., 80"
                            />
                        </div>
                    </div>
                </div>

                {/* Sugar Level */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>🍬 Sugar Level Tracking</h3>
                    <div style={s.inputGroup}>
                        <label style={s.label}>Blood Sugar (mg/dL)</label>
                        <input
                            type="number"
                            style={s.input}
                            value={healthData.sugarLevel}
                            onChange={(e) => setHealthData({ ...healthData, sugarLevel: e.target.value })}
                            placeholder="e.g., 120"
                        />
                    </div>
                </div>

                {/* Heart Rate */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>❤️ Heart Rate Monitoring</h3>
                    <div style={s.inputGroup}>
                        <label style={s.label}>Heart Rate (bpm)</label>
                        <input
                            type="number"
                            style={s.input}
                            value={healthData.heartRate}
                            onChange={(e) => setHealthData({ ...healthData, heartRate: e.target.value })}
                            placeholder="e.g., 72"
                        />
                    </div>
                </div>

                {/* BMI Calculator */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>⚖️ BMI Calculator</h3>
                    <div style={s.inputGrid}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Weight (kg)</label>
                            <input
                                type="number"
                                style={s.input}
                                value={healthData.bmi.weight}
                                onChange={(e) => setHealthData({
                                    ...healthData,
                                    bmi: { ...healthData.bmi, weight: e.target.value }
                                })}
                                placeholder="e.g., 70"
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Height (cm)</label>
                            <input
                                type="number"
                                style={s.input}
                                value={healthData.bmi.height}
                                onChange={(e) => setHealthData({
                                    ...healthData,
                                    bmi: { ...healthData.bmi, height: e.target.value }
                                })}
                                placeholder="e.g., 175"
                            />
                        </div>
                    </div>
                    {calculateBMI() && (
                        <div style={{ ...s.result, background: calculateBMI() > 25 ? '#FEE2E2' : '#DCFCE7' }}>
                            <strong>Your BMI: {calculateBMI()}</strong>
                            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                                {calculateBMI() < 18.5 ? 'Underweight' : calculateBMI() < 25 ? 'Normal weight' : calculateBMI() < 30 ? 'Overweight' : 'Obese'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Medicine Reminders */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>💊 Medicine Reminder System</h2>
                <div style={s.card}>
                    <div style={s.inputGrid}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Medicine Name</label>
                            <input
                                type="text"
                                style={s.input}
                                value={newMedicine.name}
                                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                                placeholder="e.g., Aspirin"
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Time</label>
                            <input
                                type="time"
                                style={s.input}
                                value={newMedicine.time}
                                onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Dosage</label>
                            <input
                                type="text"
                                style={s.input}
                                value={newMedicine.dosage}
                                onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                                placeholder="e.g., 1 tablet"
                            />
                        </div>
                    </div>
                    <button style={s.addBtn} onClick={addMedicine}>+ Add Medicine</button>
                </div>

                <div style={s.listContainer}>
                    {medicines.length > 0 && medicines.map(med => (
                        <div key={med.id} style={s.listItem}>
                            <div>
                                <strong>{med.name}</strong>
                                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                                    {med.time} • {med.dosage}
                                </p>
                            </div>
                            <button style={s.deleteBtn} onClick={() => removeMedicine(med.id)}>✕</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Doctor Appointments */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>📅 Doctor Appointment Reminders</h2>
                <div style={s.card}>
                    <div style={s.inputGrid}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Doctor Name</label>
                            <input
                                type="text"
                                style={s.input}
                                value={newAppointment.doctor}
                                onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                                placeholder="e.g., Dr. Smith"
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Date</label>
                            <input
                                type="date"
                                style={s.input}
                                value={newAppointment.date}
                                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                            />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Time</label>
                            <input
                                type="time"
                                style={s.input}
                                value={newAppointment.time}
                                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                            />
                        </div>
                    </div>
                    <div style={s.inputGroup}>
                        <label style={s.label}>Notes</label>
                        <textarea
                            style={{ ...s.input, resize: 'vertical', minHeight: '80px' }}
                            value={newAppointment.notes}
                            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                            placeholder="e.g., Follow-up checkup"
                        />
                    </div>
                    <button style={s.addBtn} onClick={addAppointment}>+ Add Appointment</button>
                </div>

                <div style={s.listContainer}>
                    {appointments.length > 0 && appointments.map(apt => (
                        <div key={apt.id} style={s.listItem}>
                            <div>
                                <strong>{apt.doctor}</strong>
                                <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                                    {apt.date} at {apt.time}
                                </p>
                                {apt.notes && <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>{apt.notes}</p>}
                            </div>
                            <button style={s.deleteBtn} onClick={() => removeAppointment(apt.id)}>✕</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Health Reports */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>📄 Health Report Storage</h2>
                <div style={s.card}>
                    <p style={{ color: '#666', marginBottom: '16px' }}>Upload and store your health reports, test results, and medical documents.</p>
                    <input
                        type="file"
                        style={{ ...s.input, padding: '12px' }}
                        accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <button style={s.addBtn}>📤 Upload Report</button>
                </div>
            </section>
        </div>
    )
}

const s = {
    container: { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'slideUp 0.5s ease' },
    section: { display: 'flex', flexDirection: 'column', gap: '16px' },
    sectionTitle: { fontSize: '20px', fontWeight: 700, color: '#1F2937', margin: 0, marginBottom: '8px' },
    card: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardTitle: { fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0, marginBottom: '16px' },
    inputGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '12px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
    input: { padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', transition: '0.2s' },
    result: { marginTop: '12px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' },
    addBtn: { marginTop: '16px', padding: '10px 20px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F9FAFB', borderRadius: '8px', borderLeft: '4px solid #10B981' },
    deleteBtn: { background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' },
}
