import React, { useState, useRef, useEffect, useCallback } from 'react'

export default function QuickRelaxationToolkit() {
    const [selectedExercise, setSelectedExercise] = useState('breathing')
    const [isActive, setIsActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)
    const [sessionTime, setSessionTime] = useState(5) // 5-10 mins
    const timerRef = useRef(null)
    const audioContextRef = useRef(null)

    // Wall push-up workout timer state
    const [pushupStep, setPushupStep] = useState(0)            // 0-2 current step index
    const [pushupStepTime, setPushupStepTime] = useState(5)    // seconds left in current step
    const [pushupWorkoutLeft, setPushupWorkoutLeft] = useState(0) // total workout seconds remaining
    const [pushupWorkoutMin, setPushupWorkoutMin] = useState(3)   // user-chosen workout minutes
    const [pushupCustomMin, setPushupCustomMin] = useState('')    // custom input string
    const [pushupRunning, setPushupRunning] = useState(false)
    const [pushupDone, setPushupDone] = useState(false)
    const pushupTimerRef = useRef(null)
    const pushupStepRef = useRef(0)
    const pushupStepTimeRef = useRef(5)
    const pushupWorkoutRef = useRef(0)

    const exercises = [
        {
            id: 'squats',
            title: '🏋️‍♂️ Bodyweight Squats',
            description: 'Strengthen legs and core with proper squat form',
            duration: 6,
            steps: [
                '🔵 Stand with feet hip-width apart and toes slightly turned out',
                '🔵 Keep chest lifted and core engaged',
                '🔵 Sit back into your hips as if lowering onto a chair',
                '🔵 Keep knees aligned with toes and weight in your heels',
                '🔵 Pause briefly at the bottom',
                '🔵 Press back up through heels to standing',
                '🔵 Repeat for 12–15 reps at a steady rhythm',
            ],
        },
        {
            id: 'breathing',
            title: '🫁 4-7-8 Breathing',
            description: 'Calm your nervous system with this breathing technique',
            duration: 5,
            steps: [
                '🔵 Sit comfortably with straight spine',
                '🔵 Close your eyes and relax your shoulders',
                '🔵 Inhale through your nose for 4 counts',
                '🔵 Hold the breath gently for 7 counts',
                '🔵 Exhale slowly through your mouth for 8 counts',
                '🔵 Repeat this cycle 4–5 times',
            ],
        },
        {
            id: 'yoga',
            title: '🧘 Gentle Yoga Flow',
            description: 'Stretch and restore with beginner-friendly yoga poses',
            duration: 8,
            steps: [
                '🔵 Begin in mountain pose with even breath',
                '🔵 Inhale arms overhead, lengthen the spine',
                '🔵 Exhale into forward fold, soft knees',
                '🔵 Inhale to half lift with a long spine',
                '🔵 Step back into plank, lower with control',
                '🔵 Inhale to cobra or upward dog',
                '🔵 Exhale back to child’s pose and breathe deeply',
            ],
        },
        {
            id: 'pushups',
            title: '💪 Wall Push-ups',
            description: 'Build upper body strength with modified push-ups',
            duration: 7,
            steps: [
                '🔵 Stand facing a wall, feet shoulder-width apart',
                '🔵 Place hands on wall at shoulder height and width',
                '🔵 Step back so body forms a diagonal line',
                '🔵 Bend elbows to lower chest toward wall',
                '🔵 Keep core engaged and body straight',
                '🔵 Push back to starting position',
                '🔵 Complete 8–12 reps, rest and repeat',
            ],
        },
        {
            id: 'stretching',
            title: '🤸‍♀️ Full Body Stretch',
            description: 'Release tension with a complete stretching routine',
            duration: 9,
            steps: [
                '🔵 Start with neck rolls: 5 each direction',
                '🔵 Shoulder rolls: forward and backward circles',
                '🔵 Arm circles: small to large, both directions',
                '🔵 Seated forward fold for hamstrings',
                '🔵 Figure-four stretch for hips, each side',
                '🔵 Child\'s pose for back release',
                '🔵 Cat-cow stretches for spine mobility',
                '🔵 Finish with deep breathing in relaxation pose',
            ],
        },
    ]

    const currentExercise = exercises.find((e) => e.id === selectedExercise)

    // Wall push-up steps data
    const wallPushupSteps = [
        {
            image: '/wall-push-up1.jpg',
            alt: 'Wall push-up step 1: stand upright facing wall, arm extended with hand flat on wall',
            label: 'Stand facing the wall. Place both hands flat on the wall at shoulder height with arms fully extended.',
            stepNo: 1,
            stepSeconds: 5,
        },
        {
            image: '/wall-push-up2.jpg',
            alt: 'Wall push-up step 2: lean chest toward wall by bending elbows, body in a diagonal line',
            label: 'Bend your elbows and lean your chest slowly toward the wall, keeping your body straight and core tight.',
            stepNo: 2,
            stepSeconds: 5,
        },
        {
            image: '/wall-push-up1.jpg',
            alt: 'Wall push-up step 3: push back to starting position with arms straight',
            label: 'Push through your palms to straighten your arms and return to the starting position. Repeat 8–12 reps.',
            stepNo: 3,
            stepSeconds: 5,
        },
    ]

    // Keep refs in sync for safe use in setTimeout callbacks
    useEffect(() => { pushupStepRef.current = pushupStep }, [pushupStep])
    useEffect(() => { pushupStepTimeRef.current = pushupStepTime }, [pushupStepTime])
    useEffect(() => { pushupWorkoutRef.current = pushupWorkoutLeft }, [pushupWorkoutLeft])

    // Master tick: drives both workout countdown and step cycling
    useEffect(() => {
        if (!pushupRunning || pushupDone) return
        pushupTimerRef.current = setTimeout(() => {
            // Decrement workout total
            const newWorkout = pushupWorkoutRef.current - 1
            if (newWorkout <= 0) {
                // Workout finished
                setPushupWorkoutLeft(0)
                setPushupRunning(false)
                setPushupDone(true)
                return
            }
            setPushupWorkoutLeft(newWorkout)

            // Decrement per-step time; cycle step when it hits 0
            const newStepTime = pushupStepTimeRef.current - 1
            if (newStepTime <= 0) {
                const nextStep = (pushupStepRef.current + 1) % wallPushupSteps.length
                setPushupStep(nextStep)
                setPushupStepTime(wallPushupSteps[nextStep].stepSeconds)
            } else {
                setPushupStepTime(newStepTime)
            }
        }, 1000)
        return () => clearTimeout(pushupTimerRef.current)
    }, [pushupRunning, pushupWorkoutLeft, pushupStepTime, pushupDone])

    function startPushupWorkout() {
        const mins = Number(pushupWorkoutMin)
        if (!mins || mins <= 0) return
        setPushupStep(0)
        setPushupStepTime(wallPushupSteps[0].stepSeconds)
        setPushupWorkoutLeft(mins * 60)
        setPushupDone(false)
        setPushupRunning(true)
    }

    function pausePushupWorkout() {
        setPushupRunning(r => !r)
    }

    function resetPushupWorkout() {
        clearTimeout(pushupTimerRef.current)
        setPushupRunning(false)
        setPushupStep(0)
        setPushupStepTime(wallPushupSteps[0].stepSeconds)
        setPushupWorkoutLeft(0)
        setPushupDone(false)
        setPushupCustomMin('')
    }

    const exerciseVisuals = {
        squats: (
            <div style={s.visual_stage}>
                <div style={s.visual_caption}>Bodyweight Squats - Step by Step</div>
                <div style={s.steps_container}>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop&crop=center"
                            alt="Man standing tall with feet shoulder-width apart, arms at sides"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>1. Stand with feet shoulder-width apart, toes slightly out</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=300&fit=crop&crop=center"
                            alt="Man lowering into squat with hips back, chest up, knees tracking over toes"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>2. Push hips back and bend knees, lowering until thighs are parallel to ground</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1434608519344-49d77bba6f3a?w=200&h=300&fit=crop&crop=center"
                            alt="Man pushing through heels to stand back up, squeezing glutes at top"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>3. Drive through heels to stand, squeezing glutes at the top</div>
                    </div>
                </div>
                <div style={s.visual_label}>Keep chest up, weight in heels, knees tracking over toes</div>
            </div>
        ),
        breathing: (
            <div style={s.visual_stage}>
                <div style={s.visual_caption}>4-7-8 Breathing Exercise - Step by Step</div>
                <div style={s.steps_container}>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop&crop=center"
                            alt="Person sitting comfortably with straight spine, hands resting on lap"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>1. Sit comfortably with straight spine, place tongue tip behind front teeth</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=200&h=300&fit=crop&crop=center"
                            alt="Person inhaling quietly through nose for 4 counts, chest expanding"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>2. Inhale quietly through nose for 4 seconds, filling lungs completely</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=300&fit=crop&crop=center"
                            alt="Person holding breath for 7 counts without straining"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>3. Hold breath for 7 seconds, keeping lungs full but relaxed</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop&crop=center"
                            alt="Person exhaling completely through mouth for 8 counts with whoosh sound"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>4. Exhale completely through mouth for 8 seconds making 'whoosh' sound</div>
                    </div>
                </div>
                <div style={s.visual_label}>Repeat 4 cycles. Inhale peace, exhale tension.</div>
            </div>
        ),
        yoga: (
            <div style={s.visual_stage}>
                <div style={s.visual_caption}>Gentle Yoga Flow - Step by Step</div>
                <div style={s.steps_container}>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=300&fit=crop&crop=center"
                            alt="Person standing tall in mountain pose with feet together, arms at sides"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>1. Mountain Pose: Stand tall with feet together, arms at sides, breathe deeply</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?w=200&h=300&fit=crop&crop=center"
                            alt="Person folding forward from hips, hands reaching toward ground"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>2. Forward Fold: Hinge at hips, fold forward, let hands reach toward ground</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop&crop=center"
                            alt="Person in downward facing dog with hips lifted, forming inverted V shape"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>3. Downward Dog: Walk feet back, lift hips up forming inverted V, press heels down</div>
                    </div>
                </div>
                <div style={s.visual_label}>Flow with breath: Inhale to lengthen, exhale to fold deeper</div>
            </div>
        ),
        pushups: (() => {
            const step = wallPushupSteps[pushupStep]
            const STEP_SECS = wallPushupSteps[0].stepSeconds  // 5s per step
            const stepProgress = pushupDone ? 100 : Math.max(0, ((STEP_SECS - pushupStepTime) / STEP_SECS) * 100)
            const totalSecs = pushupWorkoutMin * 60
            const workoutProgress = totalSecs > 0 ? Math.max(0, ((totalSecs - pushupWorkoutLeft) / totalSecs) * 100) : 0
            const wMin = Math.floor(pushupWorkoutLeft / 60)
            const wSec = pushupWorkoutLeft % 60
            const repsCompleted = totalSecs > 0
                ? Math.floor((totalSecs - pushupWorkoutLeft) / STEP_SECS)
                : 0
            return (
                <div style={s.visual_stage}>
                    <div style={s.visual_caption}>💪 Wall Push-ups — Workout Timer Mode</div>

                    {pushupDone ? (
                        /* ── Completion screen ── */
                        <div style={s.pushup_done_box}>
                            <div style={s.pushup_done_icon}>🎉</div>
                            <div style={s.pushup_done_title}>Workout Complete!</div>
                            <div style={s.pushup_done_sub}>
                                You finished your {pushupWorkoutMin}-minute wall push-up session!<br/>
                                <strong>{repsCompleted} step-cycles</strong> completed.
                            </div>
                            <button style={s.pushup_restart_btn} onClick={resetPushupWorkout}>↺ New Workout</button>
                        </div>
                    ) : pushupWorkoutLeft === 0 && !pushupRunning ? (
                        /* ── Setup screen (before start) ── */
                        <div style={s.pushup_setup_box}>
                            <div style={s.pushup_setup_title}>⏱ Set Your Workout Duration</div>
                            <div style={s.pushup_setup_sub}>Steps will loop automatically until your time is up</div>

                            {/* Preset buttons */}
                            <div style={s.pushup_preset_row}>
                                {[1, 3, 5, 10].map(m => (
                                    <button
                                        key={m}
                                        style={{
                                            ...s.pushup_preset_btn,
                                            ...(pushupWorkoutMin === m && !pushupCustomMin ? s.pushup_preset_active : {})
                                        }}
                                        onClick={() => { setPushupWorkoutMin(m); setPushupCustomMin('') }}
                                    >{m} min</button>
                                ))}
                            </div>

                            {/* Custom input */}
                            <div style={s.pushup_custom_row}>
                                <input
                                    type="number"
                                    min="1" max="60"
                                    placeholder="Custom (mins)"
                                    value={pushupCustomMin}
                                    style={s.pushup_custom_input}
                                    onChange={e => {
                                        setPushupCustomMin(e.target.value)
                                        if (e.target.value) setPushupWorkoutMin(Number(e.target.value))
                                    }}
                                />
                            </div>

                            <button
                                style={s.pushup_start_big_btn}
                                onClick={startPushupWorkout}
                                disabled={!pushupWorkoutMin || pushupWorkoutMin <= 0}
                            >
                                ▶ Start {pushupWorkoutMin ? `${pushupWorkoutMin}-min` : ''} Workout
                            </button>
                        </div>
                    ) : (
                        /* ── Active / paused workout ── */
                        <>
                            {/* Overall workout countdown */}
                            <div style={s.pushup_workout_clock}>
                                <div style={s.pushup_clock_label}>Workout Time Left</div>
                                <div style={s.pushup_clock_value}>
                                    {String(wMin).padStart(2,'0')}:{String(wSec).padStart(2,'0')}
                                </div>
                                {/* Overall progress bar */}
                                <div style={s.pushup_workout_track}>
                                    <div style={{ ...s.pushup_workout_fill, width: `${workoutProgress}%` }} />
                                </div>
                            </div>

                            {/* Step dots (cycling indicator) */}
                            <div style={s.pushup_dots}>
                                {wallPushupSteps.map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            ...s.pushup_dot,
                                            ...(i === pushupStep ? s.pushup_dot_active : {}),
                                        }}
                                        title={`Step ${i + 1}`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Main image */}
                            <div style={s.pushup_slide_wrapper}>
                                <div style={s.pushup_step_badge}>Step {step.stepNo} / {wallPushupSteps.length}</div>
                                <img
                                    key={pushupStep}
                                    src={step.image}
                                    alt={step.alt}
                                    style={s.pushup_slide_img}
                                />
                                {/* Step countdown badge */}
                                <div style={s.pushup_timer_badge}>
                                    <span style={s.pushup_timer_num}>{pushupStepTime}s</span>
                                </div>
                                {/* Paused overlay */}
                                {!pushupRunning && (
                                    <div style={s.pushup_paused_overlay}>⏸ Paused</div>
                                )}
                            </div>

                            {/* Per-step progress bar */}
                            <div style={s.pushup_progress_track}>
                                <div style={{ ...s.pushup_progress_fill, width: `${stepProgress}%` }} />
                            </div>

                            {/* Step label */}
                            <div style={s.pushup_step_label}>{step.label}</div>

                            {/* Controls */}
                            <div style={s.pushup_controls}>
                                <button style={s.pushup_reset_btn} onClick={resetPushupWorkout}>↺ Reset</button>
                                {!pushupRunning ? (
                                    <button style={s.pushup_play_btn} onClick={pausePushupWorkout}>▶ Resume</button>
                                ) : (
                                    <button style={s.pushup_pause_btn} onClick={pausePushupWorkout}>⏸ Pause</button>
                                )}
                            </div>
                        </>
                    )}

                    <div style={s.visual_label}>Steps loop automatically · each step = 5 seconds · keep going! 💪</div>
                </div>
            )
        })(),
        stretching: (
            <div style={s.visual_stage}>
                <div style={s.visual_caption}>Full Body Stretching Routine - Step by Step</div>
                <div style={s.steps_container}>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop&crop=center"
                            alt="Person standing with arms reaching overhead for full body stretch"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>1. Standing Reach: Stand tall, interlace fingers, reach arms overhead, stretch entire body</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=300&fit=crop&crop=center"
                            alt="Person doing standing side bend stretch, one arm overhead"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>2. Side Bend: Keep feet together, reach one arm overhead, lean to opposite side, stretch obliques</div>
                    </div>
                    <div style={s.step_arrow}>→</div>
                    <div style={s.step_image}>
                        <img
                            src="https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?w=200&h=300&fit=crop&crop=center"
                            alt="Person in seated forward fold, reaching toward toes"
                            style={s.exercise_image}
                        />
                        <div style={s.step_label}>3. Seated Forward Fold: Sit with legs extended, hinge at hips, reach toward toes, stretch hamstrings</div>
                    </div>
                </div>
                <div style={s.visual_label}>Hold each stretch for 20-30 seconds, breathe deeply, never force the stretch</div>
            </div>
        ),
    }

    const currentVisual = exerciseVisuals[selectedExercise]

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false)
            playCompletionSound()
        }

        return () => clearTimeout(timerRef.current)
    }, [isActive, timeLeft])

    function startSession() {
        setIsActive(true)
        setTimeLeft(sessionTime * 60) // Convert to seconds
    }

    function pauseSession() {
        setIsActive(false)
    }

    function resetSession() {
        setIsActive(false)
        setTimeLeft(0)
    }

    function playCompletionSound() {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
            }
            const ctx = audioContextRef.current
            const now = ctx.currentTime
            
            // Play a pleasant chime
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            
            osc.frequency.setValueAtTime(528, now) // Love frequency
            gain.gain.setValueAtTime(0.08, now)
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
            
            osc.start(now)
            osc.stop(now + 0.5)
        } catch (error) {
            console.log('Completion sound: ', error.message)
        }
    }

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60

    return (
        <div style={s.root}>
            <div style={s.grid}>
                {/* Exercise Selection */}
                <div style={s.colMain}>
                    <div style={s.card}>
                        <div style={s.card_title}>Choose Your Exercise Corner Exercise</div>
                        <div style={s.card_subtitle}>
                            Choose from 5 guided exercises with step-by-step pictures and step-by-step instructions
                        </div>

                        <div style={s.exercises_list}>
                            {exercises.map((ex) => (
                                <button
                                    key={ex.id}
                                    style={{
                                        ...s.exercise_card,
                                        ...(selectedExercise === ex.id ? s.exercise_card_active : {}),
                                    }}
                                    onClick={() => {
                                        setSelectedExercise(ex.id)
                                        setSessionTime(ex.duration)
                                        resetSession()
                                    }}
                                >
                                    <div style={s.ex_title}>{ex.title}</div>
                                    <div style={s.ex_desc}>{ex.description}</div>
                                    <div style={s.ex_duration}>{ex.duration} minutes</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div style={s.card}>
                        <div style={s.card_title}>Step-by-Step Pictures</div>
                        <div style={s.visual_card}>
                            {currentVisual}
                        </div>
                    </div>

                    <div style={s.card}>
                        <div style={s.card_title}>Steps to Follow</div>
                        <ol style={s.steps_list}>
                            {currentExercise?.steps.map((step, i) => (
                                <li key={i} style={{...s.step_item, ...(isActive && i > 0 ? { opacity: 0.6 } : {})}}>
                                    <span style={s.step_text}>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* Timer & Controls */}
                <div style={s.colSide}>
                    <div style={s.card}>
                        <div style={s.timer_container}>
                            <div style={s.timer_display}>
                                <div style={s.timer_label}>Time Remaining</div>
                                <div style={s.timer_value}>
                                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                                </div>
                                {!isActive && timeLeft > 0 && (
                                    <div style={s.timer_session}>
                                        {sessionTime}-minute session
                                    </div>
                                )}
                            </div>

                            <div style={s.duration_selector}>
                                <label style={s.duration_label}>Session Duration</label>
                                <div style={s.duration_buttons}>
                                    {[5, 7, 10].map((min) => (
                                        <button
                                            key={min}
                                            style={{
                                                ...s.duration_btn,
                                                ...(sessionTime === min ? s.duration_btn_active : {}),
                                            }}
                                            onClick={() => {
                                                if (!isActive) {
                                                    setSessionTime(min)
                                                    setTimeLeft(0)
                                                }
                                            }}
                                            disabled={isActive}
                                        >
                                            {min} min
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={s.controls}>
                                {!isActive ? (
                                    <button style={s.start_btn} onClick={startSession}>
                                        ▶ Start Session
                                    </button>
                                ) : (
                                    <>
                                        <button style={s.pause_btn} onClick={pauseSession}>
                                            ⏸ Pause
                                        </button>
                                        <button style={s.reset_btn} onClick={resetSession}>
                                            ↻ Reset
                                        </button>
                                    </>
                                )}
                            </div>

                            {isActive && (
                                <div style={s.in_progress}>
                                    <span style={s.pulse}>●</span> Session in progress
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div style={s.card}>
                        <div style={s.card_title}>Expected Benefits</div>
                        <ul style={s.benefits_list}>
                            <li style={s.benefit_item}>😌 Reduced anxiety & stress</li>
                            <li style={s.benefit_item}>🧠 Improved mental clarity</li>
                            <li style={s.benefit_item}>💪 Relieved tension</li>
                            <li style={s.benefit_item}>⚡ Renewed energy</li>
                        </ul>
                        <div style={s.benefits_note}>
                            💡 Best practiced consistently. Even one session works wonders.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const s = {
    root: { display: 'flex', flexDirection: 'column', gap: 24, padding: '0' },
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 },
    colMain: { display: 'flex', flexDirection: 'column', gap: 24 },
    colSide: { display: 'flex', flexDirection: 'column', gap: 24 },

    card: { background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 10px 30px rgba(15,23,42,.06)', border: '1px solid var(--cream-dark)' },

    card_title: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
    card_subtitle: { fontSize: 14, color: '#475569', lineHeight: 1.6, marginBottom: 24 },

    exercises_list: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
    exercise_card: { padding: 20, background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 16, cursor: 'pointer', textAlign: 'left', transition: '.2s', fontFamily: 'DM Sans, sans-serif' },
    exercise_card_active: { background: '#E0E5F8', borderColor: '#4A57A0', boxShadow: '0 8px 20px rgba(74, 87, 160, .15)' },

    ex_title: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
    ex_desc: { fontSize: 13, color: '#6B7280', marginBottom: 8, lineHeight: 1.5 },
    ex_duration: { fontSize: 12, fontWeight: 600, color: '#7B8EC8' },

    steps_list: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 },
    step_item: { fontSize: 13, color: '#475569', padding: '12px 16px', background: '#F3F4F6', borderRadius: 12, borderLeft: '4px solid #4A57A0', transition: '.2s', lineHeight: 1.6 },
    step_text: {},

    timer_container: { display: 'flex', flexDirection: 'column', gap: 20 },

    timer_display: { textAlign: 'center', padding: '32px 20px', background: 'linear-gradient(135deg, #E0E5F8, #EEF2FF)', borderRadius: 18, border: '2px solid #4A57A0' },
    timer_label: { fontSize: 12, fontWeight: 600, color: '#7B8EC8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 },
    timer_value: { fontFamily: 'DM Mono, monospace', fontSize: 48, fontWeight: 700, color: '#4A57A0', lineHeight: 1, marginBottom: 8 },
    timer_session: { fontSize: 12, color: '#7B8EC8', fontStyle: 'italic' },

    duration_selector: {},
    duration_label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em' },
    duration_buttons: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },
    duration_btn: { padding: '10px 12px', background: '#F3F4F6', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569', transition: '.2s' },
    duration_btn_active: { background: '#4A57A0', borderColor: '#4A57A0', color: 'white' },

    controls: { display: 'flex', gap: 12, flexDirection: 'column' },
    start_btn: { width: '100%', padding: '14px 20px', background: 'linear-gradient(135deg, #1A5E38, #0F5B2C)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: '.2s' },
    pause_btn: { width: '100%', padding: '14px 20px', background: '#FFA726', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: '.2s' },
    reset_btn: { width: '100%', padding: '14px 20px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: '.2s' },

    in_progress: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#DCFCE7', color: '#166534', borderRadius: 10, fontSize: 12, fontWeight: 600, marginTop: 12 },
    pulse: { fontSize: 14, animation: 'pulse 1.5s ease-in-out infinite' },

    benefits_list: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
    benefit_item: { fontSize: 13, color: '#475569', padding: '10px 0', borderBottom: '1px solid #E5E7EB', lineHeight: 1.6 },

    benefits_note: { fontSize: 12, color: '#6B7280', padding: '16px', background: '#FEF5E8', borderRadius: 12, marginTop: 12, lineHeight: 1.6 },

    visual_card: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240, padding: 24, background: '#F8FAFC', borderRadius: 20, border: '1px solid #E5E7EB' },
    visual_stage: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' },
    visual_caption: { fontSize: 13, fontWeight: 700, color: '#0F172A' },
    steps_container: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', width: '100%' },
    step_image: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 8, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #CBD5E1', minWidth: 120 },
    exercise_image: { width: '120px', height: '160px', objectFit: 'cover', borderRadius: '4px' },
    step_arrow: { fontSize: 18, fontWeight: 'bold', color: '#64748B', margin: '0 4px' },
    step_label: { fontSize: 11, fontWeight: 600, color: '#475569', textAlign: 'center', lineHeight: 1.3 },
    visual_label: { fontSize: 12, color: '#6B7280', fontStyle: 'italic', textAlign: 'center' },

    // --- Wall push-up workout timer styles ---
    // Step dots (loop indicator, not clickable during workout)
    pushup_dots: { display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' },
    pushup_dot: { width: 32, height: 32, borderRadius: '50%', border: '2px solid #CBD5E1', background: '#F3F4F6', fontSize: 12, fontWeight: 700, color: '#64748B', transition: 'all .25s', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none' },
    pushup_dot_active: { background: '#4A57A0', borderColor: '#4A57A0', color: 'white', transform: 'scale(1.25)', boxShadow: '0 4px 12px rgba(74,87,160,.4)' },

    // Image slide
    pushup_slide_wrapper: { position: 'relative', display: 'inline-block', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 30px rgba(74,87,160,.18)', border: '3px solid #4A57A0' },
    pushup_slide_img: { width: '220px', height: '280px', objectFit: 'cover', display: 'block' },
    pushup_step_badge: { position: 'absolute', top: 10, left: 10, background: 'rgba(74,87,160,.88)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '.04em' },
    pushup_timer_badge: { position: 'absolute', bottom: 10, right: 10, background: 'rgba(15,23,42,.75)', color: 'white', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,.3)' },
    pushup_timer_num: { fontSize: 15, fontWeight: 800, fontFamily: 'DM Mono, monospace' },
    pushup_paused_overlay: { position: 'absolute', inset: 0, background: 'rgba(15,23,42,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', letterSpacing: '.06em' },

    // Per-step progress bar
    pushup_progress_track: { width: '100%', height: 6, background: '#E5E7EB', borderRadius: 99, overflow: 'hidden' },
    pushup_progress_fill: { height: '100%', background: 'linear-gradient(90deg, #4A57A0, #7B8EC8)', borderRadius: 99, transition: 'width 1s linear' },

    pushup_step_label: { fontSize: 13, fontWeight: 600, color: '#334155', textAlign: 'center', lineHeight: 1.6, maxWidth: 360, padding: '0 8px' },

    // Workout total countdown clock
    pushup_workout_clock: { textAlign: 'center', padding: '14px 24px', background: 'linear-gradient(135deg, #E0E5F8, #EEF2FF)', borderRadius: 16, border: '2px solid #4A57A0', width: '100%' },
    pushup_clock_label: { fontSize: 10, fontWeight: 700, color: '#7B8EC8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 },
    pushup_clock_value: { fontFamily: 'DM Mono, monospace', fontSize: 40, fontWeight: 800, color: '#4A57A0', lineHeight: 1, marginBottom: 8 },
    pushup_workout_track: { height: 6, background: '#C7D0F0', borderRadius: 99, overflow: 'hidden' },
    pushup_workout_fill: { height: '100%', background: 'linear-gradient(90deg, #4A57A0, #A78BFA)', borderRadius: 99, transition: 'width 1s linear' },

    // Controls
    pushup_controls: { display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
    pushup_play_btn: { padding: '11px 28px', background: 'linear-gradient(135deg, #1A5E38, #0F5B2C)', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .2s', boxShadow: '0 4px 12px rgba(26,94,56,.3)' },
    pushup_pause_btn: { padding: '11px 28px', background: '#FFA726', color: 'white', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .2s' },
    pushup_reset_btn: { padding: '11px 20px', background: '#F3F4F6', border: '1.5px solid #CBD5E1', borderRadius: 12, fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer', transition: 'all .2s' },

    // Setup screen
    pushup_setup_box: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '24px 16px', background: 'linear-gradient(135deg, #F0F4FF, #EEF2FF)', borderRadius: 20, width: '100%', border: '2px dashed #A5B4FC' },
    pushup_setup_title: { fontSize: 16, fontWeight: 800, color: '#0F172A' },
    pushup_setup_sub: { fontSize: 12, color: '#64748B', textAlign: 'center' },
    pushup_preset_row: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
    pushup_preset_btn: { padding: '9px 18px', background: 'white', border: '2px solid #CBD5E1', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer', transition: 'all .2s' },
    pushup_preset_active: { background: '#4A57A0', borderColor: '#4A57A0', color: 'white', boxShadow: '0 4px 12px rgba(74,87,160,.3)' },
    pushup_custom_row: { display: 'flex', gap: 8, alignItems: 'center' },
    pushup_custom_input: { padding: '9px 14px', border: '2px solid #CBD5E1', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#0F172A', width: 140, outline: 'none', background: 'white' },
    pushup_start_big_btn: { padding: '13px 36px', background: 'linear-gradient(135deg, #4A57A0, #3B4690)', color: 'white', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 20px rgba(74,87,160,.35)', transition: 'all .2s', marginTop: 4 },

    // Completion screen
    pushup_done_box: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '32px 20px', background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', borderRadius: 20, width: '100%', border: '2px solid #16A34A' },
    pushup_done_icon: { fontSize: 48 },
    pushup_done_title: { fontSize: 20, fontWeight: 800, color: '#14532D' },
    pushup_done_sub: { fontSize: 13, color: '#166534', textAlign: 'center', lineHeight: 1.7 },
    pushup_restart_btn: { marginTop: 8, padding: '10px 28px', background: '#4A57A0', color: 'white', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer' },
}
