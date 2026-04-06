import React, { useState, useRef, useEffect } from 'react'

export default function CalmEnvironment() {
    const [playing, setPlaying] = useState({})
    const [selectedEnvironment, setSelectedEnvironment] = useState(null)
    const [timerMinutes, setTimerMinutes] = useState(5)
    const [timerSeconds, setTimerSeconds] = useState(0)
    const [timerActive, setTimerActive] = useState(false)
    const [timerRunning, setTimerRunning] = useState(false)
    const [masterVolume, setMasterVolume] = useState(0.5)
    const audioContextRef = useRef(null)
    const gainNodesRef = useRef({})
    const oscillatorsRef = useRef({})
    const timerIntervalRef = useRef(null)
    const timerStartTimeRef = useRef(null)

    const environments = [
        {
            id: 'ocean',
            emoji: '🌊',
            name: 'Ocean Waves',
            desc: 'Soothing ocean sounds for deep relaxation and stress relief.',
            color: '#4A90E2',
            lightColor: '#EEF2FF',
            // Use Web Audio API only - no external files
            audioUrl: null,
        },
        {
            id: 'rain',
            emoji: '🌧️',
            name: 'Rain Sounds',
            desc: 'Gentle rainfall to calm your mind and improve focus.',
            color: '#6B7280',
            lightColor: '#F3F4F6',
            // Use Web Audio API only - no external files
            audioUrl: null,
        },
        {
            id: 'focus',
            emoji: '🎧',
            name: 'Focus Music',
            desc: 'Ambient focus music to boost concentration and productivity.',
            color: '#8B5CF6',
            lightColor: '#F3E8FF',
            // Use Web Audio API only - no external files
            audioUrl: null,
        },
    ]

    // Create sophisticated ambient sounds using Web Audio API
    function createAmbientSound(id) {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
                console.log('AudioContext created')
            }
            const ctx = audioContextRef.current

            // Resume context if suspended (required by browser autoplay policy)
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    console.log('AudioContext resumed')
                    createAmbientSoundNodes(id, ctx)
                }).catch(err => {
                    console.error('Failed to resume AudioContext:', err)
                })
            } else {
                createAmbientSoundNodes(id, ctx)
            }
        } catch (err) {
            console.error('Web Audio creation error:', err)
        }
    }

    function createAmbientSoundNodes(id, ctx) {
        // Stop existing oscillator COMPLETELY
        if (oscillatorsRef.current[id] && Array.isArray(oscillatorsRef.current[id])) {
            oscillatorsRef.current[id].forEach(node => {
                try {
                    if (node && node.stop && node.context && node.context.state !== 'closed') {
                        node.stop(0)
                        if (node.disconnect) {
                            node.disconnect()
                        }
                    }
                } catch (e) {}
            })
        }
        
        // Initialize fresh array
        oscillatorsRef.current[id] = []
        const nodes = oscillatorsRef.current[id]

        // Create master gain node for this sound environment
        const masterGain = ctx.createGain()
        masterGain.gain.value = masterVolume
        masterGain.connect(ctx.destination)
        gainNodesRef.current[id] = masterGain

        const now = ctx.currentTime

        if (id === 'ocean') {
            // Ocean: Layered low-frequency oscillators with modulation
            for (let i = 0; i < 3; i++) {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                const lfo = ctx.createOscillator()
                const lfoGain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.value = 50 + i * 15
                lfo.frequency.value = 0.5 + i * 0.1
                lfoGain.gain.value = 20

                lfo.connect(lfoGain)
                lfoGain.connect(osc.frequency)
                gain.gain.setValueAtTime(0.25, now)
                osc.connect(gain)
                gain.connect(masterGain)

                osc.start()
                lfo.start()
                nodes.push(osc, lfo)
            }
            console.log('🌊 Ocean soundscape activated - Volume:', (masterVolume * 100).toFixed(0) + '%')
        } else if (id === 'rain') {
            // Rain: Multiple pitched oscillators at different frequencies
            const frequencies = [60, 75, 85, 95, 110, 125]
            frequencies.forEach((freq, idx) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                osc.type = 'triangle'
                osc.frequency.value = freq
                gain.gain.setValueAtTime(0.15, now)

                osc.connect(gain)
                gain.connect(masterGain)
                osc.start()
                nodes.push(osc)
            })
            console.log('🌧️ Rain soundscape activated - Volume:', (masterVolume * 100).toFixed(0) + '%')
        } else if (id === 'focus') {
            // Focus Music: Harmonic layers with gentle modulation
            const baseFreq = 110 // A2
            const harmonics = [1, 2, 3, 5] // Pentatonic-like harmonies
            
            harmonics.forEach((harmonic, idx) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                const lfo = ctx.createOscillator()
                const lfoGain = ctx.createGain()

                osc.type = 'sine'
                osc.frequency.value = baseFreq * harmonic
                lfo.frequency.value = 0.3 + idx * 0.05
                lfoGain.gain.value = 5

                lfo.connect(lfoGain)
                lfoGain.connect(osc.frequency)
                gain.gain.setValueAtTime(0.12 / harmonic, now)
                osc.connect(gain)
                gain.connect(masterGain)

                osc.start()
                lfo.start()
                nodes.push(osc, lfo)
            })
            console.log('🎧 Focus music activated - Volume:', (masterVolume * 100).toFixed(0) + '%')
        }
    }

    function stopAmbientSound(id) {
        if (oscillatorsRef.current[id] && Array.isArray(oscillatorsRef.current[id])) {
            oscillatorsRef.current[id].forEach(node => {
                try {
                    if (node && node.stop && node.context && node.context.state !== 'closed') {
                        node.stop(0) // Stop immediately
                        // Disconnect from destination to free resources
                        if (node.disconnect) {
                            node.disconnect()
                        }
                    }
                } catch (e) {
                    console.log(`Error stopping node for ${id}:`, e.message)
                }
            })
            oscillatorsRef.current[id] = []
        }
        
        // Clean up master gain node
        if (gainNodesRef.current[id]) {
            try {
                gainNodesRef.current[id].disconnect()
            } catch (e) {}
            delete gainNodesRef.current[id]
        }
        
        console.log(`🔇 ${id} sound stopped`)
    }

    function updateVolume(newVolume) {
        setMasterVolume(newVolume)
        // Update all active gain nodes
        Object.keys(gainNodesRef.current).forEach(id => {
            if (gainNodesRef.current[id] && gainNodesRef.current[id].gain) {
                gainNodesRef.current[id].gain.value = newVolume
            }
        })
        console.log(`🔊 Volume updated to ${(newVolume * 100).toFixed(0)}%`)
    }

    function handleEnvironmentToggle(id) {
        if (playing[id]) {
            setSelectedEnvironment(null)
        } else {
            setSelectedEnvironment(id)
        }
        togglePlay(id)
    }

    function togglePlay(id) {
        if (playing[id]) {
            // STOP - completely halt ALL audio for this environment
            console.log(`Stopping ${id}`)
            
            // Stop Web Audio oscillators
            stopAmbientSound(id)
            
            // Update state - remove this environment from playing
            setPlaying((prev) => {
                const newState = { ...prev }
                delete newState[id]
                return newState
            })
            
            console.log(`✅ ${id} completely stopped`)
        } else {
            // START
            console.log(`Starting ${id}`)
            
            // Stop ALL other environments first (not just playing ones)
            Object.keys(playing).forEach((key) => {
                if (key !== id) {
                    stopAmbientSound(key)
                }
            })
            
            // Update state - only this environment playing
            setPlaying((prev) => {
                const newState = {}
                Object.keys(prev).forEach(key => {
                    newState[key] = false
                })
                newState[id] = true
                return newState
            })

            // START WEB AUDIO IMMEDIATELY (no external files)
            setTimeout(() => {
                console.log(`Creating sound for ${id}`)
                createAmbientSound(id)
            }, 0)
        }
    }



    // Timer management
    function startTimer() {
        if (timerMinutes === 0 && timerSeconds === 0) {
            alert('Please set a timer duration')
            return
        }
        
        if (selectedEnvironment && !playing[selectedEnvironment]) {
            console.log(`Timer started - auto-starting selected sound: ${selectedEnvironment}`)
            togglePlay(selectedEnvironment)
        }
        
        setTimerActive(true)
        setTimerRunning(true)
        timerStartTimeRef.current = Date.now()
        const totalMs = timerMinutes * 60000 + timerSeconds * 1000
        
        timerIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - timerStartTimeRef.current
            const remaining = Math.max(0, totalMs - elapsed)
            
            const mins = Math.floor(remaining / 60000)
            const secs = Math.floor((remaining % 60000) / 1000)
            
            setTimerMinutes(mins)
            setTimerSeconds(secs)
            
            // Timer finished
            if (remaining === 0) {
                clearInterval(timerIntervalRef.current)
                stopAllSounds()
                setTimerRunning(false)
                setTimerActive(false)
            }
        }, 100)
    }

    function pauseTimer() {
        clearInterval(timerIntervalRef.current)
        setTimerRunning(false)
    }

    function resumeTimer() {
        if (timerMinutes === 0 && timerSeconds === 0) {
            setTimerActive(false)
            return
        }
        
        setTimerRunning(true)
        timerStartTimeRef.current = Date.now()
        const totalMs = timerMinutes * 60000 + timerSeconds * 1000
        
        timerIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - timerStartTimeRef.current
            const remaining = Math.max(0, totalMs - elapsed)
            
            const mins = Math.floor(remaining / 60000)
            const secs = Math.floor((remaining % 60000) / 1000)
            
            setTimerMinutes(mins)
            setTimerSeconds(secs)
            
            if (remaining === 0) {
                clearInterval(timerIntervalRef.current)
                stopAllSounds()
                setTimerRunning(false)
                setTimerActive(false)
            }
        }, 100)
    }

    function resetTimer() {
        clearInterval(timerIntervalRef.current)
        setTimerMinutes(5)
        setTimerSeconds(0)
        setTimerRunning(false)
        setTimerActive(false)
    }

    function stopAllSounds() {
        console.log('🛑 Stopping ALL sounds...')
        
        // Stop ALL Web Audio oscillators
        Object.keys(oscillatorsRef.current).forEach((id) => {
            stopAmbientSound(id)
        })
        
        // Clear all playing state
        setPlaying({})
        console.log('✅ All sounds completely stopped')
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            console.log('🧹 Cleaning up CalmEnvironment...')
            clearInterval(timerIntervalRef.current)
            stopAllSounds()
            
            // Close audio context if possible
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                try {
                    audioContextRef.current.close()
                } catch (e) {
                    console.log('Error closing audio context:', e.message)
                }
            }
        }
    }, [])

    return (
        <div style={styles.root}>
            <style>{`
                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                    border: none;
                }
            `}</style>
            <div style={styles.intro}>
                <div style={styles.introText}>
                    Take a moment to breathe. Choose an environment to calm your mind and reduce stress.
                </div>
            </div>

            {/* Timer Section */}
            <div style={styles.timerSection}>
                <div style={styles.timerTitle}>⏱️ Session Timer</div>
                <div style={styles.timerContainer}>
                    <div style={styles.timerDisplay}>
                        <div style={styles.timerValue}>
                            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                        </div>
                        <div style={styles.timerLabel}>minutes : seconds</div>
                    </div>
                    
                    <div style={styles.timerInputs}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Minutes</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                value={timerMinutes}
                                onChange={(e) => {
                                    if (!timerActive) {
                                        setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))
                                    }
                                }}
                                style={{ ...styles.input, opacity: timerActive ? 0.6 : 1 }}
                                disabled={timerActive}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Seconds</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={timerSeconds}
                                onChange={(e) => {
                                    if (!timerActive) {
                                        let val = parseInt(e.target.value) || 0
                                        if (val > 59) val = 59
                                        setTimerSeconds(Math.max(0, val))
                                    }
                                }}
                                style={{ ...styles.input, opacity: timerActive ? 0.6 : 1 }}
                                disabled={timerActive}
                            />
                        </div>
                    </div>

                    <div style={styles.timerButtons}>
                        {!timerActive ? (
                            <button style={styles.timerBtn} onClick={startTimer}>
                                ▶ Start Timer
                            </button>
                        ) : (
                            <>
                                {!timerRunning ? (
                                    <button style={styles.timerBtn} onClick={resumeTimer}>
                                        ▶ Resume
                                    </button>
                                ) : (
                                    <button style={styles.timerBtn} onClick={pauseTimer}>
                                        ⏸ Pause
                                    </button>
                                )}
                                <button style={styles.timerBtnReset} onClick={resetTimer}>
                                    🔄 Reset
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Volume Control Section */}
            <div style={styles.volumeSection}>
                <div style={styles.volumeLabel}>
                    <span>🔊 Master Volume</span>
                    <span style={styles.volumePercent}>{(masterVolume * 100).toFixed(0)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={masterVolume * 100}
                    onChange={(e) => updateVolume(parseInt(e.target.value) / 100)}
                    style={styles.volumeSlider}
                />
            </div>

            <div style={styles.grid}>
                {environments.map((env) => (
                    <div key={env.id} style={{ ...styles.card, background: env.lightColor, borderColor: env.color }}>
                        <div style={styles.emoji}>{env.emoji}</div>
                        <div style={styles.envName}>{env.name}</div>
                        <div style={styles.envDesc}>{env.desc}</div>

                        <button
                            style={{
                                ...styles.playBtn,
                                background: playing[env.id] ? env.color : '#E5E7EB',
                                color: playing[env.id] ? 'white' : env.color,
                            }}
                            onClick={() => handleEnvironmentToggle(env.id)}
                        >
                            {playing[env.id] ? '⏸ Now Playing' : '▶ Play'}
                        </button>
                    </div>
                ))}
            </div>

            <div style={styles.tips}>
                <div style={styles.tipsTitle}>Calm Environment Tips</div>
                <ul style={styles.tipsList}>
                    <li>Use headphones for best immersive experience</li>
                    <li>Choose a quiet, comfortable space</li>
                    <li>Combine with guided breathing or meditation</li>
                    <li>Set a timer for 5–20 minute sessions</li>
                    <li>Use before difficult conversations or tasks</li>
                </ul>
            </div>
        </div>
    )
}

const styles = {
    root: { padding: '20px', maxWidth: 900, margin: '0 auto' },
    intro: { textAlign: 'center', marginBottom: 30 },
    introText: { fontSize: 16, color: '#4B5563', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' },
    
    // Timer styles
    timerSection: { background: 'white', borderRadius: 24, padding: 28, marginBottom: 40, boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    timerTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 20 },
    timerContainer: { display: 'flex', flexDirection: 'column', gap: 20 },
    timerDisplay: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 16, padding: 20, textAlign: 'center' },
    timerValue: { fontSize: 56, fontWeight: 700, color: 'white', fontFamily: 'monospace', letterSpacing: 4, margin: 0 },
    timerLabel: { fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
    timerInputs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
    label: { fontSize: 12, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 0.5 },
    input: { padding: 12, borderRadius: 12, border: '2px solid #E5E7EB', fontSize: 16, fontWeight: 600, textAlign: 'center', fontFamily: 'monospace' },
    timerButtons: { display: 'flex', gap: 12 },
    timerBtn: { flex: 1, padding: '14px 24px', background: '#10B981', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: '.2s' },
    timerBtnReset: { padding: '14px 24px', background: '#F3F4F6', color: '#374151', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: '.2s' },
    
    volumeSection: { background: 'white', borderRadius: 24, padding: 28, marginBottom: 40, boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    volumeLabel: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    volumePercent: { fontSize: 14, color: '#6B7280', fontWeight: 600 },
    volumeSlider: { 
        width: '100%', 
        height: 8, 
        borderRadius: 4, 
        background: 'linear-gradient(to right, #E5E7EB, #D1D5DB)', 
        outline: 'none', 
        cursor: 'pointer', 
        appearance: 'none',
        WebkitAppearance: 'none',
        WebkitSliderThumb: {
            appearance: 'none',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#667eea',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
        }
    },
    
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 },
    card: { borderRadius: 24, padding: 28, border: '2px solid', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, background: 'white', boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    emoji: { fontSize: 56 },
    envName: { fontSize: 18, fontWeight: 700, color: '#0F172A' },
    envDesc: { fontSize: 13, color: '#6B7280', lineHeight: 1.6 },
    playBtn: { padding: '14px 28px', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: '.3s ease' },

    tips: { background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)' },
    tipsTitle: { fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
    tipsList: { fontSize: 13, color: '#475569', lineHeight: 2, paddingLeft: 20, margin: 0 },
}
