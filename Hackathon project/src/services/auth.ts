export interface User {
    id: string;
    email: string;
    password: string; // In real app, this would be hashed
    role: 'student' | 'employer' | 'university';
    name: string;
    isVerified: boolean;
}

export interface LoginAttempt {
    email: string;
    timestamp: Date;
    ip: string;
    userAgent: string;
    success: boolean;
}

// Mock user database
const MOCK_USERS: User[] = [
    {
        id: '1',
        email: 'student@university.edu',
        password: 'password123',
        role: 'student',
        name: 'John Doe',
        isVerified: true
    },
    {
        id: '2',
        email: 'hr@company.com',
        password: 'password123',
        role: 'employer',
        name: 'Jane Smith',
        isVerified: true
    },
    {
        id: '3',
        email: 'admin@university.edu',
        password: 'password123',
        role: 'university',
        name: 'Dr. Admin',
        isVerified: true
    }
];

export interface ActiveSession {
    email: string;
    sessionId: string;
    loginTime: Date;
    ip: string;
    userAgent: string;
}

export const authenticateUser = (email: string, password: string): { user: User | null, message: string, requiresVerification?: boolean, sessionConflict?: boolean } => {
    const user = MOCK_USERS.find(u => u.email === email);

    if (!user) {
        logLoginAttempt(email, false);
        return { user: null, message: 'Invalid email or password' };
    }

    if (user.password !== password) {
        logLoginAttempt(email, false);
        sendSecurityAlert(user.email, 'Failed login attempt detected');
        return { user: null, message: 'Invalid email or password' };
    }

    // Check for existing active session
    const activeSessions = getActiveSessions();
    const existingSession = activeSessions.find(session => session.email === email);

    if (existingSession) {
        // User already has an active session
        sendSecurityAlert(user.email, 'New login attempt detected - another device may be trying to access your account');
        return {
            user: null,
            message: 'Account already logged in from another location. Please log out from other devices first.',
            sessionConflict: true
        };
    }

    // Check for suspicious activity
    const isSuspicious = checkForSuspiciousLogin(user);
    logLoginAttempt(email, true);

    if (isSuspicious) {
        sendSecurityAlert(user.email, 'Unusual login detected - verification required');
        return {
            user: null,
            message: 'Security verification required. Check your email for login confirmation.',
            requiresVerification: true
        };
    }

    // Create new session
    createSession(user);
    sendLoginNotification(user.email, 'New login to your account');
    return { user, message: 'Login successful' };
};

export const logLoginAttempt = (email: string, success: boolean) => {
    // Use different IP for suspicious simulation
    const isSimulatingSuspicious = navigator.userAgent.includes('Chrome/120.0.0.0');
    const ip = isSimulatingSuspicious ? '203.0.113.1' : '192.168.1.100'; // Mock IPs

    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
    const attempt: LoginAttempt = {
        email,
        timestamp: new Date(),
        ip,
        userAgent: navigator.userAgent,
        success
    };
    attempts.push(attempt);
    localStorage.setItem('loginAttempts', JSON.stringify(attempts));
};

export const sendSecurityAlert = (email: string, message: string) => {
    // In a real app, this would send an actual email
    // For this prototype, we'll show an alert and log to console
    console.log(`SECURITY ALERT sent to ${email}: ${message}`);

    // Mock email notification
    alert(`🔒 Security Alert Sent!\n\nAn email notification has been sent to ${email} about suspicious login activity.\n\nMessage: ${message}`);

    // Store in localStorage for demo purposes
    const alerts = JSON.parse(localStorage.getItem('securityAlerts') || '[]');
    alerts.push({
        email,
        message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('securityAlerts', JSON.stringify(alerts));
};

export const checkForSuspiciousLogin = (user: User): boolean => {
    const attempts = getRecentLoginAttempts(user.email);
    const recentAttempts = attempts.filter(a => a.success).slice(-3); // Last 3 successful logins

    if (recentAttempts.length === 0) {
        // First login ever - not suspicious
        return false;
    }

    // Check for different IP addresses
    const currentIP = '192.168.1.100'; // Mock current IP
    const knownIPs = [...new Set(recentAttempts.map(a => a.ip))];

    if (!knownIPs.includes(currentIP)) {
        return true; // New IP address detected
    }

    // Check for different user agents (devices)
    const currentUA = navigator.userAgent;
    const knownUAs = recentAttempts.map(a => a.userAgent);

    // Simple check - if user agent doesn't match any recent ones
    const isKnownDevice = knownUAs.some(ua => ua === currentUA);
    if (!isKnownDevice) {
        return true; // New device detected
    }

    return false; // Login appears normal
};

export const sendLoginNotification = (email: string, message: string) => {
    // Send notification for successful logins
    console.log(`LOGIN NOTIFICATION sent to ${email}: ${message}`);

    // Mock email notification
    alert(`📧 Login Notification!\n\nA login to your account was detected.\n\nEmail: ${email}\nMessage: ${message}\n\nIf this wasn't you, please secure your account immediately.`);

    // Store in localStorage for demo purposes
    const notifications = JSON.parse(localStorage.getItem('loginNotifications') || '[]');
    notifications.push({
        email,
        message,
        timestamp: new Date().toISOString(),
        type: 'login'
    });
    localStorage.setItem('loginNotifications', JSON.stringify(notifications));
};

export const getRecentLoginAttempts = (email: string): LoginAttempt[] => {
    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
    return attempts.filter((a: LoginAttempt) => a.email === email).slice(-5); // Last 5 attempts
};

// Function to simulate different devices/IPs for testing
export const simulateSuspiciousLogin = () => {
    // Temporarily change the mock IP and user agent to simulate suspicious activity
    const originalIP = '192.168.1.100';
    const originalUA = navigator.userAgent;

    // Mock different IP and device
    Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        configurable: true
    });

    // Store original values for restoration
    (window as any).originalIP = originalIP;
    (window as any).originalUA = originalUA;

    return { originalIP, originalUA };
};

export const restoreNormalLogin = () => {
    if ((window as any).originalUA) {
        Object.defineProperty(navigator, 'userAgent', {
            value: (window as any).originalUA,
            configurable: true
        });
    }
};

// Session management functions
export const createSession = (user: User): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ActiveSession = {
        email: user.email,
        sessionId,
        loginTime: new Date(),
        ip: '192.168.1.100', // Mock IP
        userAgent: navigator.userAgent
    };

    const sessions = getActiveSessions();
    sessions.push(session);
    localStorage.setItem('activeSessions', JSON.stringify(sessions));

    return sessionId;
};

export const getActiveSessions = (): ActiveSession[] => {
    return JSON.parse(localStorage.getItem('activeSessions') || '[]');
};

export const terminateSession = (email: string): void => {
    const sessions = getActiveSessions();
    const updatedSessions = sessions.filter(session => session.email !== email);
    localStorage.setItem('activeSessions', JSON.stringify(updatedSessions));
};

export const getCurrentSession = (email: string): ActiveSession | null => {
    const sessions = getActiveSessions();
    return sessions.find(session => session.email === email) || null;
};

// Debug function to clear all sessions (for testing)
export const clearAllSessions = (): void => {
    localStorage.removeItem('activeSessions');
    console.log('All active sessions cleared');
};

// Debug function to view all sessions
export const debugSessions = (): void => {
    const sessions = getActiveSessions();
    const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '[]');
    const notifications = JSON.parse(localStorage.getItem('loginNotifications') || '[]');
    const alerts = JSON.parse(localStorage.getItem('securityAlerts') || '[]');

    console.log('=== DEBUG INFORMATION ===');
    console.log('Active sessions:', sessions);
    console.log('Recent login attempts:', attempts.slice(-5));
    console.log('Login notifications:', notifications.slice(-3));
    console.log('Security alerts:', alerts.slice(-3));
    console.log('Current user agent:', navigator.userAgent);
    console.log('========================');
};