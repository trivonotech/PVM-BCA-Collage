import { CONFIG } from './config';

interface UserData {
    uid: string;
    email: string;
    role: string;
    username: string;
    permissions: string[];
}

/**
 * Safely retrieves current admin user data from localStorage
 */
export const getCurrentUser = (): UserData | null => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr) as UserData;
        }
    } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
    }
    return null;
};

/**
 * Returns the email of the current admin, or a fallback.
 */
export const getCurrentAdminEmail = (fallback: string = 'admin'): string => {
    const user = getCurrentUser();
    return user?.email || fallback;
};

/**
 * Returns the role of the current admin, or a fallback.
 */
export const getCurrentUserRole = (fallback: string = CONFIG.ROLES.CHILD_ADMIN): string => {
    const user = getCurrentUser();
    return user?.role || fallback;
};

/**
 * Checks if the current admin has a specific permission or is a Super Admin.
 */
export const hasPermission = (permission: string): boolean => {
    const user = getCurrentUser();
    if (!user) return false;

    if (user.role === CONFIG.ROLES.SUPER_ADMIN) return true;
    if (user.permissions.includes('all')) return true;

    return user.permissions.includes(permission);
};

/**
 * Convenient alias for getCurrentAdminEmail
 */
export const getCurrentAdmin = (): string => getCurrentAdminEmail();
