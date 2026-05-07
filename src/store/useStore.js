import { create } from 'zustand'

const useStore = create((set) => ({
    user: null,
    isAnonymous: false,
    ageCategory: null,
    professions: [],
    mood: null,
    burnoutHistory: [],
    language: 'en', // Default to English

    setUser: (user) => set({ user }),
    setAnonymous: (val) => set({ isAnonymous: val }),
    setAgeCategory: (age) => set({ ageCategory: age }),
    setProfessions: (profs) => set({ professions: profs }),
    setMood: (mood) => set({ mood }),
    setLanguage: (lang) => set({ language: lang }),
    addBurnoutScore: (score) => set((s) => ({ burnoutHistory: [...s.burnoutHistory, score] })),

    toggleProfession: (prof) =>
        set((state) => ({
            professions: state.professions.includes(prof)
                ? state.professions.filter((p) => p !== prof)
                : [...state.professions, prof],
        })),
}))

export default useStore