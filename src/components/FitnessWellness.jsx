import React, { useState } from 'react'

export default function FitnessWellness() {
    const [steps, setSteps] = useState(0)
    const [waterIntake, setWaterIntake] = useState(0)
    const [sleepHours, setSleepHours] = useState('')
    const [dietPlan, setDietPlan] = useState('balanced')
    const [selectedWorkout, setSelectedWorkout] = useState(null)

    const yogaRoutines = [
        { id: 1, name: 'Morning Stretch', duration: '15 min', level: 'Easy', desc: 'Gentle stretches to start your day' },
        { id: 2, name: 'Energy Boost', duration: '20 min', level: 'Moderate', desc: 'Energizing flow for vitality' },
        { id: 3, name: 'Evening Relaxation', duration: '25 min', level: 'Easy', desc: 'Calming poses for evening' },
        { id: 4, name: 'Balance & Strength', duration: '30 min', level: 'Moderate', desc: 'Build strength and balance' },
    ]

    const meditations = [
        { id: 1, name: 'Guided Relaxation', duration: '10 min', focus: 'Stress Relief' },
        { id: 2, name: 'Mindfulness Meditation', duration: '15 min', focus: 'Present Moment' },
        { id: 3, name: 'Sleep Meditation', duration: '20 min', focus: 'Better Sleep' },
        { id: 4, name: 'Body Scan', duration: '12 min', focus: 'Body Awareness' },
    ]

    const dietPlans = {
        balanced: {
            name: 'Balanced Diet',
            meals: ['Oatmeal with berries', 'Grilled chicken with vegetables', 'Fish with whole grain rice', 'Salad with olive oil']
        },
        highProtein: {
            name: 'High Protein',
            meals: ['Eggs with whole wheat toast', 'Protein smoothie', 'Lean meat with greens', 'Beans and lentils']
        },
        lowSodium: {
            name: 'Low Sodium',
            meals: ['Fresh fruits', 'Unsalted vegetables', 'Herbs for flavor', 'Home-cooked meals']
        },
        diabetic: {
            name: 'Diabetic Friendly',
            meals: ['Whole grain cereals', 'Lean proteins', 'Low glycemic vegetables', 'Nuts and seeds']
        }
    }

    const addWater = () => {
        setWaterIntake(waterIntake + 1)
    }

    const addSteps = () => {
        setSteps(steps + 1000)
    }

    return (
        <div style={s.container}>
            {/* Daily Activity Tracking */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>📈 Daily Activity Tracking</h2>

                {/* Steps */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>👟 Walking Tracker</h3>
                    <div style={s.trackerContent}>
                        <div style={s.trackerVisual}>
                            <div style={s.stepCounter}>{steps.toLocaleString()}</div>
                            <div style={s.stepLabel}>Steps</div>
                            <div style={s.stepGoal}>Goal: 10,000 steps</div>
                            <div style={s.progressBar}>
                                <div style={{ ...s.progress, width: `${Math.min((steps / 10000) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <button style={s.addBtn} onClick={addSteps}>+ Add 1000 Steps</button>
                    </div>
                </div>

                {/* Water Intake */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>💧 Water Intake Reminder</h3>
                    <div style={s.trackerContent}>
                        <div style={s.waterDisplay}>
                            <div style={s.waterCount}>{waterIntake}</div>
                            <div style={s.waterLabel}>Glasses of Water</div>
                            <div style={s.waterGoal}>Goal: 8 glasses/day</div>
                            <div style={s.waterGrid}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} style={{ ...s.waterGlass, opacity: i < waterIntake ? 1 : 0.3 }}>💧</div>
                                ))}
                            </div>
                        </div>
                        <button style={s.addBtn} onClick={addWater}>+ Log Water</button>
                    </div>
                </div>

                {/* Sleep Tracking */}
                <div style={s.card}>
                    <h3 style={s.cardTitle}>😴 Sleep Tracking</h3>
                    <div style={s.inputGroup}>
                        <label style={s.label}>Hours of Sleep</label>
                        <input
                            type="number"
                            style={s.input}
                            value={sleepHours}
                            onChange={(e) => setSleepHours(e.target.value)}
                            placeholder="e.g., 7"
                            min="0"
                            max="24"
                        />
                    </div>
                    {sleepHours && (
                        <div style={{ ...s.result, background: sleepHours >= 7 ? '#DCFCE7' : '#FEF3C7' }}>
                            <strong>{sleepHours} hours of sleep logged</strong>
                            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>
                                {sleepHours >= 7 ? '✓ Good sleep! Keep up the routine.' : '⚠️ Try to get 7-9 hours of sleep daily.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Yoga & Stretching */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🧘 Yoga & Stretching Routines</h2>
                <div style={s.routinesGrid}>
                    {yogaRoutines.map(routine => (
                        <div key={routine.id} style={s.routineCard}>
                            <h4 style={s.routineName}>{routine.name}</h4>
                            <p style={s.routineDetail}>{routine.duration} • {routine.level}</p>
                            <p style={s.routineDesc}>{routine.desc}</p>
                            <button
                                style={s.routineBtn}
                                onClick={() => setSelectedWorkout(routine)}
                            >
                                Start Routine
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Meditation */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🧘‍♀️ Meditation Sessions</h2>
                <div style={s.meditationGrid}>
                    {meditations.map(med => (
                        <div key={med.id} style={s.medCard}>
                            <div style={s.medIcon}>🎵</div>
                            <h4 style={s.medName}>{med.name}</h4>
                            <p style={s.medFocus}>{med.focus}</p>
                            <p style={s.medDuration}>{med.duration}</p>
                            <button style={s.playBtn}>▶️ Play</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Personalized Diet Plans */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🍽️ Personalized Diet Plans</h2>
                <div style={s.card}>
                    <label style={s.label}>Select Your Diet Plan</label>
                    <div style={s.dietSelect}>
                        {Object.entries(dietPlans).map(([key, plan]) => (
                            <button
                                key={key}
                                style={{ ...s.dietOption, ...(dietPlan === key ? s.dietOptionActive : {}) }}
                                onClick={() => setDietPlan(key)}
                            >
                                {plan.name}
                            </button>
                        ))}
                    </div>

                    {/* Meal Plan Display */}
                    <div style={s.mealContainer}>
                        <h3 style={s.cardTitle} style={{ marginTop: '20px' }}>Today's Meals</h3>
                        <div style={s.mealsGrid}>
                            {dietPlans[dietPlan].meals.map((meal, idx) => (
                                <div key={idx} style={s.mealCard}>
                                    <div style={s.mealNumber}>{idx + 1}</div>
                                    <p style={s.mealName}>{meal}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Currently Selected Workout Modal */}
            {selectedWorkout && (
                <div style={s.modal} onClick={() => setSelectedWorkout(null)}>
                    <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={s.closeBtn} onClick={() => setSelectedWorkout(null)}>✕</button>
                        <h2 style={s.modalTitle}>{selectedWorkout.name}</h2>
                        <p style={s.modalDesc}>{selectedWorkout.desc}</p>
                        <div style={s.modalDetails}>
                            <div style={s.detail}>⏱️ {selectedWorkout.duration}</div>
                            <div style={s.detail}>📊 {selectedWorkout.level}</div>
                        </div>
                        <button style={s.startBtn} onClick={() => alert(`Starting ${selectedWorkout.name}...`)}>
                            ▶️ Start Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

const s = {
    container: { display: 'flex', flexDirection: 'column', gap: '32px', animation: 'slideUp 0.5s ease' },
    section: { display: 'flex', flexDirection: 'column', gap: '16px' },
    sectionTitle: { fontSize: '20px', fontWeight: 700, color: '#1F2937', margin: 0, marginBottom: '8px' },
    card: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    cardTitle: { fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: '0 0 16px 0' },
    trackerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' },
    trackerVisual: { flex: 1, textAlign: 'center' },
    stepCounter: { fontSize: '48px', fontWeight: 700, color: '#10B981' },
    stepLabel: { fontSize: '14px', color: '#666', marginTop: '8px' },
    stepGoal: { fontSize: '12px', color: '#999', marginTop: '4px' },
    progressBar: { width: '100%', height: '8px', background: '#E5E7EB', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' },
    progress: { height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)', transition: '0.3s' },
    waterDisplay: { flex: 1, textAlign: 'center' },
    waterCount: { fontSize: '42px', fontWeight: 700, color: '#3B82F6' },
    waterLabel: { fontSize: '14px', color: '#666', marginTop: '8px' },
    waterGoal: { fontSize: '12px', color: '#999', marginTop: '4px' },
    waterGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '12px' },
    waterGlass: { fontSize: '24px', transition: '0.3s' },
    addBtn: { padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
    input: { padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' },
    result: { marginTop: '12px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' },
    routinesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
    routineCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' },
    routineName: { fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 },
    routineDetail: { fontSize: '12px', color: '#999', margin: 0 },
    routineDesc: { fontSize: '13px', color: '#666', margin: 0, flex: 1 },
    routineBtn: { padding: '8px 16px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    meditationGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    medCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' },
    medIcon: { fontSize: '32px' },
    medName: { fontSize: '15px', fontWeight: 600, color: '#1F2937', margin: 0 },
    medFocus: { fontSize: '12px', color: '#666', margin: 0 },
    medDuration: { fontSize: '12px', color: '#999', margin: 0 },
    playBtn: { padding: '8px 16px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    dietSelect: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' },
    dietOption: { padding: '12px 16px', background: '#F3F4F6', border: '2px solid transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: '0.2s' },
    dietOptionActive: { background: '#DBEAFE', border: '2px solid #3B82F6', color: '#1E40AF' },
    mealContainer: { marginTop: '20px' },
    mealsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px' },
    mealCard: { background: '#F9FAFB', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #10B981', display: 'flex', alignItems: 'center', gap: '12px' },
    mealNumber: { fontSize: '20px', fontWeight: 700, color: '#10B981', minWidth: '30px' },
    mealName: { fontSize: '14px', color: '#374151', margin: 0 },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%', position: 'relative' },
    closeBtn: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
    modalTitle: { fontSize: '24px', fontWeight: 700, color: '#1F2937', margin: '0 0 12px 0' },
    modalDesc: { fontSize: '14px', color: '#666', margin: '0 0 16px 0' },
    modalDetails: { display: 'flex', gap: '16px', marginBottom: '16px' },
    detail: { fontSize: '13px', padding: '8px 12px', background: '#F3F4F6', borderRadius: '6px' },
    startBtn: { width: '100%', padding: '12px 24px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '16px' },
}
