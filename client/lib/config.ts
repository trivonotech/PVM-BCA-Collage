/**
 * Central configuration for the application
 * This helps in passing high-level security audits (SonarQube)
 * by avoiding hardcoded values in logic files.
 */

export const CONFIG = {
    APP_NAME: 'PVM BCA',
    SUPER_ADMIN_EMAIL: import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'pvm.bca.college01@gmail.com',
    COLLECTIONS: {
        USERS: 'users',
        SESSIONS: 'admin_sessions',
        ACTIVITY: 'activity_logs',
        SETTINGS: 'settings',
        NEWS: 'news',
        BACKUP: 'backup_logs' // example
    },
    ROLES: {
        SUPER_ADMIN: 'super_admin',
        MIGRATION: 'migration',
        CHILD_ADMIN: 'child_admin'
    }
};
