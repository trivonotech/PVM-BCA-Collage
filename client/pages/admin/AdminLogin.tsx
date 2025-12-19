import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [honeypot, setHoneypot] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();

    // Removed handleCreateSuperAdmin as per user request (Login page should only be for logging in)
    // The Super Admin account (pvm.bca.college01@gmail.com) is presumed to exist or be created via console if needed.

    const handleForgotPassword = async () => {
        if (!username) {
            // Replaced setError with toast for validation
            toast({
                title: "Validation Error",
                description: "Please enter your username or email to reset password.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        try {
            setLoading(true);
            const { sendPasswordResetEmail } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase');

            const emailToReset = username.toLowerCase() === 'admin' ? 'pvm.bca.college01@gmail.com' : username;
            await sendPasswordResetEmail(auth, emailToReset);

            // Replaced alert with toast
            toast({
                title: "Email Sent",
                description: `Password reset link sent to ${emailToReset}. Check your inbox.`,
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
            setError(''); // Clear any previous error message
        } catch (err: any) {
            console.error('Reset Password Error:', err);
            setError('Failed to send reset link: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const triggerSystemLock = (reason: string) => {
        // Trigger the Global Security Monitor
        const duration = 60 * 60 * 1000; // 1 Hour
        localStorage.setItem('security_block', JSON.stringify({
            expiresAt: Date.now() + duration,
            reason: reason
        }));
        window.location.reload(); // Reload to activate shield
    };

    // Handle Email Link Sign-in landing
    useEffect(() => {
        const checkEmailLink = async () => {
            const { isSignInWithEmailLink, signInWithEmailLink } = await import('firebase/auth');
            const { auth, db } = await import('@/lib/firebase');
            const { doc, getDoc } = await import('firebase/firestore');

            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }

                if (!email) return;

                setLoading(true);
                try {
                    const result = await signInWithEmailLink(auth, email, window.location.href);
                    window.localStorage.removeItem('emailForSignIn');

                    // Fetch User Data & Redirect (Logic duplicated for robustness)
                    const user = result.user;
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('user', JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                            role: userData.role || 'child_admin',
                            permissions: userData.permissions || []
                        }));
                        navigate('/admin/dashboard');
                    } else {
                        setError('User profile not found. Contact Super Admin.');
                    }
                } catch (error: any) {
                    console.error("Error signing in with email link", error);
                    setError('Invalid or expired login link. Please try again.');
                    // If error, likely link expired or invalid
                } finally {
                    setLoading(false);
                }
            }
        }
        checkEmailLink();
    }, [navigate]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Security Check 1: Honeypot
        if (honeypot) {
            triggerSystemLock("Automated Bot / Malicious Script Detected");
            return;
        }

        try {
            const { signInWithEmailAndPassword, sendSignInLinkToEmail } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase');

            // 1. Validate Credentials First (Identity Check)
            const email = username.toLowerCase() === 'admin' ? 'pvm.bca.college01@gmail.com' : username;

            try {
                // Check if password is correct
                await signInWithEmailAndPassword(auth, email, password);

                // If successful, immediately sign out to enforce link verification
                await auth.signOut();

                // 2. Send Magic Link (Access Check)
                const actionCodeSettings = {
                    url: window.location.href, // Redirect back to this page
                    handleCodeInApp: true,
                };

                await sendSignInLinkToEmail(auth, email, actionCodeSettings);
                window.localStorage.setItem('emailForSignIn', email);

                setLinkSent(true);
                setError('');

            } catch (loginErr: any) {
                // Wrong password or user
                const pendingFailures = parseInt(localStorage.getItem('login_failures') || '0') + 1;
                localStorage.setItem('login_failures', pendingFailures.toString());

                if (pendingFailures >= 5) {
                    triggerSystemLock("Multiple Failed Admin Access Attempts");
                    return;
                }

                if (loginErr.code === 'auth/invalid-credential') {
                    setError('Invalid email or password.');
                } else if (loginErr.code === 'auth/too-many-requests') {
                    setError('Too many failed attempts. Please try again later.');
                } else {
                    setError('Failed to login. Please check your connection.');
                }
            }

        } catch (err: any) {
            console.error('Login error:', err);
            setError('System error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B0B3B] to-[#1a1a5e] flex items-center justify-center p-4">
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full mb-4">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">PVM BCA College</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Honeypot Field (Hidden) - Bots will fill this */}
                    <input
                        type="text"
                        name="security_check"
                        tabIndex={-1}
                        autoComplete="off"
                        className="opacity-0 absolute h-0 w-0 pointer-events-none"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                    />

                    {linkSent ? (
                        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-6 rounded-xl text-center">
                            <h3 className="text-xl font-bold mb-2">Check Your Email</h3>
                            <p className="mb-4">We've sent a secure login link to your inbox.</p>
                            <p className="text-sm font-semibold">Click the link in the email to access the admin panel.</p>
                            <button
                                type="button"
                                onClick={() => setLinkSent(false)}
                                className="mt-6 text-green-700 hover:text-green-800 text-sm underline"
                            >
                                Use a different email
                            </button>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Username / Email
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 accent-blue-600" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <button type="button" onClick={handleForgotPassword} className="text-blue-600 hover:text-blue-700 font-medium">
                                    Forgot password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Logging in...</span>
                                    </div>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </>
                    )}
                </form>


            </div>
        </div>
    );
}
