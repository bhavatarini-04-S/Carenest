-- Create user_sessions table to track login/logout activity
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT CHECK (session_type IN ('login', 'logout', 'signup', 'anonymous')),
    ip_address TEXT,
    user_agent TEXT,
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
    ON public.user_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
    ON public.user_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON public.user_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_type ON public.user_sessions(session_type);
