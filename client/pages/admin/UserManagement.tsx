import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
    Users,
    UserPlus,
    Edit,
    Trash2,
    Shield,
    Lock,
    X,
    Check,
    Search,
    Plus,
    Key
} from 'lucide-react';
import { db, firebaseConfig } from '@/lib/firebase';
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getCurrentUserRole } from '@/lib/authUtils';
import { CONFIG } from '@/lib/config';
import { useToast } from "@/components/ui/use-toast";
interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: 'super_admin' | 'child_admin';
    permissions: string[];
    createdAt: any; // Changed from string to any (Firestore Timestamp)
    lastLogin?: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'child_admin' as 'super_admin' | 'child_admin',
        permissions: [] as string[],
    });
    const { toast } = useToast();

    // Get current logged-in user's role for security checks
    const currentUserRole = getCurrentUserRole();
    const isSuperAdmin = currentUserRole === CONFIG.ROLES.SUPER_ADMIN;

    // Real-time Users Sync
    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AdminUser[];
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const availablePermissions = [
        { key: 'dashboard', label: 'Dashboard', icon: '📊' },
        { key: 'events', label: 'Events Management', icon: '📅' },
        { key: 'students', label: 'Students Management', icon: '👨‍🎓' },
        { key: 'sports', label: 'Sports Management', icon: '⚽' },
        { key: 'workshops', label: 'Workshops Management', icon: '🎓' },
        { key: 'news', label: 'News Management', icon: '📰' },
        { key: 'faculty', label: 'Faculty Management', icon: '👩‍🏫' },
        { key: 'achievements', label: 'Achievements Management', icon: '🏆' },
        { key: 'placements', label: 'Placements Management', icon: '💼' },
        { key: 'courses', label: 'Courses Management', icon: '📚' },
        { key: 'visibility', label: 'Section Visibility', icon: '👁️' },
        { key: 'settings', label: 'Site Settings', icon: '⚙️' },
        // user_management removed - only Super Admin can access User Management
    ];

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'child_admin',
            permissions: [],
        });
    };

    const handleAddNew = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            alert("Please fill in all required fields: Username, Email, and Password.");
            return;
        }

        try {
            // 1. Create Auth User using Secondary App (to avoid logging out current admin)
            const secondaryApp = initializeApp(firebaseConfig, "Secondary");
            const secondaryAuth = getAuth(secondaryApp);
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
            const user = userCredential.user;
            const uid = user.uid;

            // 1.1 Send Verification Email to the new user
            await sendEmailVerification(user);

            // 2. Create Firestore Record
            await setDoc(doc(db, "users", uid), {
                username: formData.username,
                email: formData.email,
                role: formData.role,
                permissions: formData.role === 'super_admin' ? ['all'] : formData.permissions,
                createdAt: serverTimestamp(),
                createdBy: JSON.parse(localStorage.getItem('user') || '{}').email || 'unknown'
            });

            // Cleanup secondary app
            // Note: In a real prod app, deleteApp(secondaryApp) should be called, but it's async and sometimes buggy in hot-reload.
            // Leaving it to garbage collect or manual cleanup is okay for admin panel.

            resetForm();
            setShowModal(false);
            toast({
                title: "Success",
                description: "Admin user created successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error: any) {
            console.error("Error creating user:", error);
            toast({
                title: "Error",
                description: "Error creating user: " + error.message,
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleEdit = (user: AdminUser) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '', // Password not editable directly here for security
            role: user.role,
            permissions: user.permissions,
        });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;

        try {
            await setDoc(doc(db, "users", editingUser.id), {
                username: formData.username, // Allow updating username
                role: formData.role,
                permissions: formData.role === 'super_admin' ? ['all'] : formData.permissions
            }, { merge: true });

            resetForm();
            setShowModal(false);
            toast({
                title: "Success",
                description: "Admin user updated successfully!",
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast({
                title: "Error",
                description: "Error updating user: " + error.message,
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            try {
                // Delete from Firestore
                await deleteDoc(doc(db, "users", id));
                // Note: Auth user deletion requires Admin SDK (Backend).
                // For client-side only valid logic: We delete the Firestore doc.
                // Since Login checks for Firestore doc existence, the user is effectively banned.
                toast({
                    title: "Success",
                    description: "Admin user deleted successfully!",
                    className: "bg-green-500 text-white border-none",
                    duration: 3000,
                });
            } catch (error: any) {
                console.error("Error deleting user:", error);
                toast({
                    title: "Error",
                    description: "Error deleting user: " + error.message,
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            handleUpdate();
        } else {
            handleAddNew();
        }
    };

    const togglePermission = (permission: string) => {
        if (formData.permissions.includes(permission)) {
            setFormData({
                ...formData,
                permissions: formData.permissions.filter((p) => p !== permission),
            });
        } else {
            setFormData({
                ...formData,
                permissions: [...formData.permissions, permission],
            });
        }
    };

    const selectAllPermissions = () => {
        setFormData({
            ...formData,
            permissions: availablePermissions.map((p) => p.key),
        });
    };

    const deselectAllPermissions = () => {
        setFormData({
            ...formData,
            permissions: [],
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">
                            Manage admin users and their permissions
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Admin
                    </button>
                </div>

                {/* Stats Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Admins</p>
                                <p className="text-4xl font-bold mt-1">{users.length}</p>
                            </div>
                            <Users className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Super Admins</p>
                                <p className="text-4xl font-bold mt-1">
                                    {users.filter((u) => u.role === 'super_admin').length}
                                </p>
                            </div>
                            <Shield className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Child Admins</p>
                                <p className="text-4xl font-bold mt-1">
                                    {users.filter((u) => u.role === 'child_admin').length}
                                </p>
                            </div>
                            <Key className="w-12 h-12 opacity-30" />
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Username</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Permissions</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Created</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        {user.username[0].toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-gray-900">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'super_admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {user.role === 'super_admin' ? 'Super Admin' : 'Child Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {user.permissions.includes('all')
                                                    ? 'All Permissions'
                                                    : `${user.permissions.length} permissions`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                {user.role !== 'super_admin' && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
                        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingUser ? 'Edit Admin User' : 'Add New Admin User'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-gray-900">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Username *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="Enter username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="admin@example.com"
                                            />
                                        </div>
                                    </div>
                                    {!editingUser && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                required={!editingUser}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-gray-900">Role</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setFormData({ ...formData, role: 'super_admin', permissions: ['all'] })}
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.role === 'super_admin'
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Shield className={`w-6 h-6 ${formData.role === 'super_admin' ? 'text-purple-600' : 'text-gray-400'}`} />
                                                <div>
                                                    <div className="font-bold text-gray-900">Super Admin</div>
                                                    <div className="text-xs text-gray-600">Full access to everything</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, role: 'child_admin', permissions: [] })}
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.role === 'child_admin'
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Key className={`w-6 h-6 ${formData.role === 'child_admin' ? 'text-green-600' : 'text-gray-400'}`} />
                                                <div>
                                                    <div className="font-bold text-gray-900">Child Admin</div>
                                                    <div className="text-xs text-gray-600">Limited permissions</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Permissions */}
                                {formData.role === 'child_admin' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-gray-900">Permissions</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={selectAllPermissions}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                                                >
                                                    Select All
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    type="button"
                                                    onClick={deselectAllPermissions}
                                                    className="text-sm text-red-600 hover:text-red-700 font-semibold"
                                                >
                                                    Deselect All
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {availablePermissions.map((permission) => {
                                                const isSelected = formData.permissions.includes(permission.key);
                                                return (
                                                    <div
                                                        key={permission.key}
                                                        onClick={() => togglePermission(permission.key)}
                                                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${isSelected
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-2xl">{permission.icon}</span>
                                                                <span className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                                                                    {permission.label}
                                                                </span>
                                                            </div>
                                                            {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                                    >
                                        {editingUser ? 'Update Admin' : 'Create Admin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
