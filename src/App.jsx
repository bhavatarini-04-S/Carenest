import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import AgeSelect from './pages/AgeSelect'
import ProfessionSelect from './pages/ProfessionSelect'
import Dashboard from './pages/Dashboard'
import SeniorDashboard45Plus from './pages/SeniorDashboard45Plus'
import Chat from './pages/Chat'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding/age" element={<AgeSelect />} />
                <Route path="/onboarding/profession" element={<ProfessionSelect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/senior" element={<SeniorDashboard45Plus />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}