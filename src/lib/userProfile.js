import { supabase } from './supabase'

/**
 * Create or update user profile
 * @param {Object} profileData - User profile data
 * @param {string} profileData.name - User's name
 * @param {string} profileData.age_group - Age group: '18-24', '25-35', '35-45', '45+'
 * @param {string} profileData.profession - User's profession
 * @param {boolean} profileData.is_anonymous - Whether user is anonymous
 */
export async function saveUserProfile(profileData) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('No authenticated user found')
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({
                id: user.id,
                email: user.email,
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error saving user profile:', error)
        return { data: null, error }
    }
}

/**
 * Get current user's profile
 */
export async function getUserProfile() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('No authenticated user found')
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return { data: null, error }
    }
}

/**
 * Track user session (login, logout, signup)
 * @param {string} sessionType - Type: 'login', 'logout', 'signup', 'anonymous'
 * @param {Object} metadata - Additional session metadata
 */
export async function trackUserSession(sessionType, metadata = {}) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('No authenticated user found')
        }

        const { data, error } = await supabase
            .from('user_sessions')
            .insert({
                user_id: user.id,
                session_type: sessionType,
                user_agent: navigator.userAgent,
                device_info: {
                    platform: navigator.platform,
                    language: navigator.language,
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height
                    },
                    ...metadata
                }
            })
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error tracking session:', error)
        return { data: null, error }
    }
}

/**
 * Get user's session history
 * @param {number} limit - Number of sessions to retrieve (default: 10)
 */
export async function getUserSessions(limit = 10) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('No authenticated user found')
        }

        const { data, error } = await supabase
            .from('user_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error fetching user sessions:', error)
        return { data: null, error }
    }
}

/**
 * Update user profile field
 * @param {string} field - Field name to update
 * @param {any} value - New value
 */
export async function updateProfileField(field, value) {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            throw new Error('No authenticated user found')
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .update({ [field]: value, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .select()
            .single()

        if (error) throw error
        return { data, error: null }
    } catch (error) {
        console.error('Error updating profile field:', error)
        return { data: null, error }
    }
}
