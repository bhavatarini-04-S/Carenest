import React, { useState } from 'react'

export default function MentalWellness() {
    const [moodEntries, setMoodEntries] = useState([])
    const [selectedMood, setSelectedMood] = useState(null)
    const [moodNote, setMoodNote] = useState('')
    const [selectedActivity, setSelectedActivity] = useState(null)

    const moods = [
        { id: 1, emoji: '😊', label: 'Happy', color: '#FBBF24' },
        { id: 2, emoji: '😌', label: 'Calm', color: '#34D399' },
        { id: 3, emoji: '😐', label: 'Neutral', color: '#9CA3AF' },
        { id: 4, emoji: '😟', label: 'Anxious', color: '#F87171' },
        { id: 5, emoji: '😢', label: 'Sad', color: '#60A5FA' },
    ]

    const stressActivities = [
        {
            id: 1,
            name: 'Deep Breathing',
            icon: '🫁',
            duration: '5 min',
            desc: 'Quick breathing exercise to calm your mind',
            steps: ['1. Breathe in for 4 counts', '2. Hold for 4 counts', '3. Exhale for 4 counts', '4. Repeat 5 times']
        },
        {
            id: 2,
            name: 'Progressive Relaxation',
            icon: '🌊',
            duration: '10 min',
            desc: 'Relax muscles progressively',
            steps: ['1. Start with toes', '2. Tense for 5 seconds', '3. Release and relax', '4. Move upward through body']
        },
        {
            id: 3,
            name: 'Nature Walk',
            icon: '🌳',
            duration: '15 min',
            desc: 'Connect with nature and fresh air',
            steps: ['1. Find a peaceful outdoor space', '2. Walk slowly and mindfully', '3. Notice the surroundings', '4. Breathe deeply']
        },
        {
            id: 4,
            name: 'Creative Expression',
            icon: '🎨',
            duration: '20 min',
            desc: 'Express yourself through art or writing',
            steps: ['1. Choose a medium (drawing, writing, music)', '2. Let emotions guide you', '3. No judgment - just express', '4. Reflect on the process']
        },
    ]

    const memoryGames = [
        { id: 1, name: 'Pattern Memory', icon: '🧩', desc: 'Recall patterns and sequences', difficulty: 'Easy' },
        { id: 2, name: 'Number Series', icon: '🔢', desc: 'Complete number patterns', difficulty: 'Medium' },
        { id: 3, name: 'Word Association', icon: '📚', desc: 'Connect related words', difficulty: 'Easy' },
        { id: 4, name: 'Logical Puzzles', icon: '🧠', desc: 'Solve brain teasers', difficulty: 'Hard' },
    ]

    const quotes = [
        "The only way out is through. - Robert Frost",
        "Every day may not be good, but there is something good in every day.",
        "You are stronger than you think. - Unknown",
        "Progress, not perfection.",
        "Your mental health is a priority, not a luxury.",
        "Be kind to yourself. You're doing the best you can.",
        "It's okay to not be okay, but it's not okay to stay that way.",
        "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.",
    ]

    const relaxingMusic = [
        { id: 1, title: 'Ambient Waves', duration: '45 min', mood: 'Calming' },
        { id: 2, title: 'Forest Sounds', duration: '30 min', mood: 'Peaceful' },
        { id: 3, title: 'Piano Dreams', duration: '60 min', mood: 'Relaxing' },
        { id: 4, title: 'Meditation Bell', duration: '20 min', mood: 'Focusing' },
    ]

    const recordMood = () => {
        if (selectedMood) {
            const mood = moods.find(m => m.id === selectedMood)
            const entry = {
                id: Date.now(),
                mood: mood,
                note: moodNote,
                timestamp: new Date().toLocaleString()
            }
            setMoodEntries([entry, ...moodEntries])
            setSelectedMood(null)
            setMoodNote('')
        }
    }

    const deleteMoodEntry = (id) => {
        setMoodEntries(moodEntries.filter(e => e.id !== id))
    }

    return (
        <div style={s.container}>
            {/* Mood Tracking */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>😊 Mood Tracking</h2>
                <div style={s.card}>
                    <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>How are you feeling today?</p>
                    <div style={s.moodGrid}>
                        {moods.map(mood => (
                            <button
                                key={mood.id}
                                style={{
                                    ...s.moodBtn,
                                    borderColor: selectedMood === mood.id ? mood.color : 'transparent',
                                    borderWidth: selectedMood === mood.id ? '3px' : '2px'
                                }}
                                onClick={() => setSelectedMood(mood.id)}
                            >
                                <span style={s.moodEmoji}>{mood.emoji}</span>
                                <div style={s.moodLabel}>{mood.label}</div>
                            </button>
                        ))}
                    </div>

                    <div style={s.inputGroup}>
                        <label style={s.label}>Add a note (optional)</label>
                        <textarea
                            style={{ ...s.textarea, minHeight: '80px' }}
                            value={moodNote}
                            onChange={(e) => setMoodNote(e.target.value)}
                            placeholder="What triggered this mood? What helped? Anything to reflect on?"
                        />
                    </div>

                    <button
                        style={s.recordBtn}
                        onClick={recordMood}
                        disabled={!selectedMood}
                    >
                        📝 Record Mood
                    </button>
                </div>

                {/* Mood History */}
                {moodEntries.length > 0 && (
                    <div style={s.historyContainer}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Recent Mood History</h3>
                        {moodEntries.slice(0, 5).map(entry => (
                            <div key={entry.id} style={s.historyItem}>
                                <div style={s.historyContent}>
                                    <span style={{ fontSize: '24px', marginRight: '12px' }}>{entry.mood.emoji}</span>
                                    <div>
                                        <strong>{entry.mood.label}</strong>
                                        {entry.note && <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>{entry.note}</p>}
                                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#999' }}>{entry.timestamp}</p>
                                    </div>
                                </div>
                                <button style={s.deleteBtn} onClick={() => deleteMoodEntry(entry.id)}>✕</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Stress Management */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🌿 Stress Management Activities</h2>
                <div style={s.activitiesGrid}>
                    {stressActivities.map(activity => (
                        <div
                            key={activity.id}
                            style={s.activityCard}
                            onClick={() => setSelectedActivity(activity)}
                        >
                            <div style={s.activityIcon}>{activity.icon}</div>
                            <h3 style={s.activityName}>{activity.name}</h3>
                            <p style={s.activityDuration}>{activity.duration}</p>
                            <p style={s.activityDesc}>{activity.desc}</p>
                            <button style={s.startBtn} onClick={(e) => {
                                e.stopPropagation()
                                setSelectedActivity(activity)
                            }}>Start</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Memory Games */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🧠 Memory Improvement Games</h2>
                <div style={s.gamesGrid}>
                    {memoryGames.map(game => (
                        <div key={game.id} style={s.gameCard}>
                            <div style={s.gameIcon}>{game.icon}</div>
                            <h3 style={s.gameName}>{game.name}</h3>
                            <p style={s.gameDesc}>{game.desc}</p>
                            <div style={s.difficultyBadge}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: game.difficulty === 'Easy' ? '#10B981' : game.difficulty === 'Medium' ? '#F59E0B' : '#EF4444' }}>
                                    {game.difficulty}
                                </span>
                            </div>
                            <button style={s.playBtn} onClick={() => alert(`Starting ${game.name}...`)}>▶️ Play</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Motivational Quotes */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>💭 Motivational Quotes</h2>
                <div style={s.quotesContainer}>
                    {quotes.map((quote, idx) => (
                        <div key={idx} style={s.quoteCard}>
                            <p style={s.quoteText}>"{quote}"</p>
                            <button style={s.shareBtn}>📤 Share</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Relaxing Music & Audio Therapy */}
            <section style={s.section}>
                <h2 style={s.sectionTitle}>🎵 Relaxing Music & Audio Therapy</h2>
                <div style={s.musicGrid}>
                    {relaxingMusic.map(music => (
                        <div key={music.id} style={s.musicCard}>
                            <div style={s.musicIcon}>🎵</div>
                            <h3 style={s.musicTitle}>{music.title}</h3>
                            <p style={s.musicMood}>{music.mood}</p>
                            <p style={s.musicDuration}>{music.duration}</p>
                            <button style={s.playMusicBtn} onClick={() => alert(`Now playing: ${music.title}`)}>▶️ Play</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Activity Detail Modal */}
            {selectedActivity && (
                <div style={s.modal} onClick={() => setSelectedActivity(null)}>
                    <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={s.closeBtn} onClick={() => setSelectedActivity(null)}>✕</button>
                        <div style={s.modalIcon}>{selectedActivity.icon}</div>
                        <h2 style={s.modalTitle}>{selectedActivity.name}</h2>
                        <p style={s.modalDesc}>{selectedActivity.desc}</p>
                        <p style={s.modalDuration}>⏱️ {selectedActivity.duration}</p>

                        <div style={s.stepsContainer}>
                            <h3 style={s.stepsTitle}>Steps:</h3>
                            {selectedActivity.steps.map((step, idx) => (
                                <div key={idx} style={s.stepItem}>
                                    {step}
                                </div>
                            ))}
                        </div>

                        <button
                            style={s.beginBtn}
                            onClick={() => alert(`Starting ${selectedActivity.name}. Take your time and breathe.`)}
                        >
                            ▶️ Begin Activity
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
    moodGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '16px' },
    moodBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', background: '#F9FAFB', border: '2px solid transparent', borderRadius: '12px', cursor: 'pointer', transition: '0.3s' },
    moodEmoji: { fontSize: '32px' },
    moodLabel: { fontSize: '12px', fontWeight: 600, color: '#374151' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '16px' },
    label: { fontSize: '13px', fontWeight: 600, color: '#374151' },
    textarea: { padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', resize: 'vertical' },
    recordBtn: { marginTop: '16px', padding: '10px 20px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
    historyContainer: { background: 'white', padding: '20px', borderRadius: '12px' },
    historyItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px', background: '#F9FAFB', borderRadius: '8px', marginBottom: '8px', borderLeft: '4px solid #8B5CF6' },
    historyContent: { display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 },
    deleteBtn: { background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontWeight: 600 },
    activitiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
    activityCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: '0.3s', border: '2px solid transparent' },
    activityIcon: { fontSize: '32px' },
    activityName: { fontSize: '16px', fontWeight: 600, color: '#1F2937', margin: 0 },
    activityDuration: { fontSize: '12px', color: '#999', margin: 0 },
    activityDesc: { fontSize: '13px', color: '#666', margin: 0, flex: 1 },
    startBtn: { padding: '8px 16px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    gamesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    gameCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' },
    gameIcon: { fontSize: '32px' },
    gameName: { fontSize: '15px', fontWeight: 600, color: '#1F2937', margin: 0 },
    gameDesc: { fontSize: '13px', color: '#666', margin: 0 },
    difficultyBadge: { fontSize: '12px', fontWeight: 600 },
    playBtn: { padding: '8px 16px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    quotesContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' },
    quoteCard: { background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', color: 'white', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' },
    quoteText: { fontSize: '15px', fontStyle: 'italic', margin: '0 0 12px 0', lineHeight: 1.6 },
    shareBtn: { alignSelf: 'flex-start', padding: '6px 12px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' },
    musicGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
    musicCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' },
    musicIcon: { fontSize: '32px' },
    musicTitle: { fontSize: '15px', fontWeight: 600, color: '#1F2937', margin: 0 },
    musicMood: { fontSize: '12px', color: '#999', margin: 0 },
    musicDuration: { fontSize: '12px', color: '#666', margin: 0 },
    playMusicBtn: { padding: '8px 16px', background: '#EC4899', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '450px', width: '90%', position: 'relative', maxHeight: '80vh', overflowY: 'auto' },
    closeBtn: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
    modalIcon: { fontSize: '48px', marginBottom: '16px', textAlign: 'center' },
    modalTitle: { fontSize: '24px', fontWeight: 700, color: '#1F2937', margin: '0 0 12px 0', textAlign: 'center' },
    modalDesc: { fontSize: '14px', color: '#666', margin: '0 0 8px 0', textAlign: 'center' },
    modalDuration: { fontSize: '13px', color: '#999', textAlign: 'center', marginBottom: '16px' },
    stepsContainer: { background: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
    stepsTitle: { fontSize: '14px', fontWeight: 600, color: '#1F2937', margin: '0 0 12px 0' },
    stepItem: { fontSize: '13px', color: '#374151', padding: '8px 0', borderBottom: '1px solid #E5E7EB' },
    beginBtn: { width: '100%', padding: '12px 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '16px' },
}
