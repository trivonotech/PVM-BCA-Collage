import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Database, Download, AlertTriangle, CheckCircle, FileJson, Loader2, Upload, BookOpen, Copy, ShieldAlert } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

export default function BackupManager() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        toast({
            title: "Copied to clipboard",
            className: "bg-green-500 text-white border-none h-12",
            duration: 2000,
        });
        setTimeout(() => setCopied(null), 2000);
    };

    const collectionsToBackup = [
        'users',
        'events',
        'event_categories',
        'top_students',
        'admissions_content',
        'page_content',
        'inquiries',
        'subscribers',
        'settings',
        'activity_logs',
        'admin_sessions',
        'news',
        'workshops',
        'placements',
        'courses',
        'system_logs',
        'analytics'
    ];

    const [restoreLoading, setRestoreLoading] = useState(false);
    const [restoreProgress, setRestoreProgress] = useState('');

    // Security Toggle Logic
    const [isMigrationMode, setIsMigrationMode] = useState(false);

    // Initial Fetch of Security State
    const toggleSecurityMode = async () => {
        const newMode = !isMigrationMode;
        setIsMigrationMode(newMode);

        try {
            await setDoc(doc(db, 'settings', 'security'), { migrationMode: newMode }, { merge: true });

            toast({
                title: newMode ? "Migration Mode Enabled" : "Strict Security Enabled",
                description: newMode ? "Security checks relaxed for data restore." : "System is now fully secured.",
                className: newMode ? "bg-yellow-500 text-black border-none" : "bg-green-500 text-white border-none",
            });
        } catch (error) {
            console.error("Failed to toggle security:", error);
            setIsMigrationMode(!isMigrationMode); // Revert on fail
            toast({
                title: "Error",
                description: "Failed to update security settings.",
                variant: "destructive"
            });
        }
    };

    // Listen to real-time security settings
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'security'), (snap: any) => {
            if (snap.exists()) {
                setIsMigrationMode(snap.data().migrationMode === true);
            }
        });
        return () => unsub();
    }, []);

    const handleBackup = async () => {
        setLoading(true);
        setStats(null);
        try {
            const backupData: any = {
                metadata: {
                    timestamp: new Date().toISOString(),
                    exportedBy: JSON.parse(localStorage.getItem('user') || '{}').email || 'Unknown',
                    userAgent: navigator.userAgent,
                },
                collections: {}
            };

            const collectionStats: any = {};

            for (const collectionName of collectionsToBackup) {
                const querySnapshot = await getDocs(collection(db, collectionName));
                const docs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                backupData.collections[collectionName] = docs;
                collectionStats[collectionName] = docs.length;
            }

            // Create Blob and Download
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pvm-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setStats(collectionStats);
            toast({
                title: "Backup Successful",
                description: "Data exported and downloaded successfully.",
                className: "bg-green-500 text-white border-none",
                duration: 5000,
            });

        } catch (error) {
            console.error("Backup failed:", error);
            toast({
                title: "Backup Failed",
                description: "Could not export data. Check console for details.",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setRestoreLoading(true);
        setRestoreProgress('Reading file...');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;
                const backupData = JSON.parse(content);

                if (!backupData.collections) {
                    throw new Error("Invalid backup file format");
                }

                // Iterate and Restore
                const collections = Object.entries(backupData.collections);
                let totalRestored = 0;

                for (const [collectionName, docs] of collections) {
                    setRestoreProgress(`Restoring ${collectionName}...`);

                    // @ts-ignore
                    for (const docData of docs) {
                        const { id, ...data } = docData;
                        // Use setDoc to overwrite/create with specific ID
                        const { doc, setDoc } = await import('firebase/firestore');
                        await setDoc(doc(db, collectionName, id), data);
                        totalRestored++;
                    }
                }

                toast({
                    title: "Restore Complete",
                    description: `Successfully restored ${totalRestored} documents across ${collections.length} collections.`,
                    className: "bg-green-500 text-white border-none",
                    duration: 5000,
                });
                setRestoreProgress('');

            } catch (error) {
                console.error("Restore failed:", error);
                toast({
                    title: "Restore Failed",
                    description: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                    variant: "destructive",
                    duration: 10000,
                });
                setRestoreProgress('');
            } finally {
                setRestoreLoading(false);
                // Clear input
                event.target.value = '';
            }
        };

        reader.readAsText(file);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Database className="w-8 h-8 text-blue-600" />
                        Data Backup & Import
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Export your data or restore from a previous backup file.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Security Control Card (New) */}
                    <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl shadow-xl p-6 text-white border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <ShieldAlert className="w-6 h-6 text-yellow-400" />
                                    System Security Status
                                </h2>
                                <p className="text-gray-300 text-sm mt-1">
                                    Controls access rules for the Admin Panel.
                                </p>
                            </div>

                            {/* Real Security Toggle */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                                    <div className={`w-3 h-3 rounded-full ${!isMigrationMode ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                                    <span className="font-semibold text-sm">
                                        {!isMigrationMode ? 'Strict Security Active' : 'Migration Mode Active'}
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isMigrationMode}
                                        onChange={toggleSecurityMode}
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                                </label>
                            </div>
                        </div>
                        {isMigrationMode && (
                            <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 p-3 rounded-lg text-sm text-yellow-200 flex justify-between items-center">
                                <div>
                                    <strong>Migration Mode Active:</strong> Super Admin can bypass profile checks.
                                    <br />Turn this OFF once you have restored data to secure the panel.
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Full Database Export</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    This will generate a JSON file containing all data from <strong>{collectionsToBackup.length} collections</strong>.
                                    <br />
                                    Includes: Users, Events (with Photos), Students, Inquiries, Content, and Logs.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 flex gap-3">
                                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <strong>Yes, Photos Included!</strong> Since images are stored as encoded text in the database, they will also be included in this backup file.
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBackup}
                                disabled={loading || restoreLoading}
                                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-6 h-6" />
                                        Download Backup
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Stats Summary */}
                        {stats && (
                            <div className="mt-8 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Export Summary
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Object.entries(stats).map(([key, count]: [string, any]) => (
                                        <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
                                                {key.replace('_', ' ')}
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {count} <span className="text-xs text-gray-400 font-normal">items</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Import Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
                        {restoreLoading && (
                            <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">{restoreProgress}</h3>
                                <p className="text-gray-500 mt-2">Please do not close this window.</p>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Restore / Import Data</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Upload a request `.json` backup file to restore data.
                                    <br />
                                    <span className="text-red-500 font-semibold">Warning:</span> This will overwrite existing records if they have the same ID. Perfect for migrating to a new account.
                                </p>
                            </div>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleRestore}
                                    disabled={restoreLoading || loading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                />
                                <button
                                    disabled={restoreLoading || loading}
                                    className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all flex items-center gap-3 shadow-lg shadow-purple-200 disabled:opacity-70"
                                >
                                    <Upload className="w-6 h-6" />
                                    Upload & Restore
                                </button>
                            </div>
                        </div>
                        {/* Migration Guide Section */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <BookOpen className="w-6 h-6 text-gray-700" />
                                <h2 className="text-xl font-bold text-gray-900">Migration Guide & Security Rules</h2>
                            </div>

                            <div className="space-y-6 text-gray-600">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-2">How to Migrate to a New Firebase Account</h3>

                                    <div className="flex gap-2 mb-4 flex-wrap">
                                        <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold hover:bg-yellow-200 border border-yellow-200">
                                            Open Firebase Console
                                        </a>
                                        <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="px-3 py-1 bg-black text-white rounded text-xs font-bold hover:bg-gray-800 border border-black">
                                            Open Vercel Dashboard
                                        </a>
                                        <a href="https://app.netlify.com/" target="_blank" rel="noreferrer" className="px-3 py-1 bg-teal-100 text-teal-800 rounded text-xs font-bold hover:bg-teal-200 border border-teal-200">
                                            Open Netlify Dashboard
                                        </a>
                                    </div>

                                    <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                                        <li><strong>Export Data:</strong> Click "Download Backup" above to get your `pvm-backup.json` file.</li>
                                        <li><strong>Create New Project:</strong> Go to Firebase Console &rarr; Create Project &rarr; Enable Firestore & Auth.</li>
                                        <li><strong>Connect App:</strong> Open <code>client/lib/firebase.ts</code> and replace the config with your new keys:
                                            <div className="relative group">
                                                <pre className="bg-gray-100 p-3 mt-2 rounded-lg text-xs font-mono select-all pr-12 whitespace-pre leading-relaxed border border-gray-200">
                                                    {`const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "G-MEASUREMENT_ID"
};`}
                                                </pre>
                                                <button
                                                    onClick={() => handleCopy(`const firebaseConfig = {\n  apiKey: "PASTE_HERE",\n  authDomain: "PASTE_HERE",\n  projectId: "PASTE_HERE",\n  storageBucket: "PASTE_HERE",\n  messagingSenderId: "PASTE_HERE",\n  appId: "PASTE_HERE",\n  measurementId: "PASTE_HERE"\n};`, 'env')}
                                                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm border border-gray-200 transition-colors"
                                                    title="Copy Code Block"
                                                >
                                                    {copied === 'env' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            <span className="text-xs text-gray-500 block mt-1">
                                                <strong>Tip:</strong> Copy the entire <code>firebaseConfig</code> block from Firebase and paste it here replacing the old one. (1 Copy, 1 Paste).
                                            </span>
                                        </li>
                                        <li><strong>Create Admin User:</strong> In Firebase Console {'>'} Authentication, manually create your admin user.
                                            <ul className="list-disc list-inside ml-4 mt-1 text-xs text-red-600 font-semibold">
                                                <li>Use the SAME email: <code>pvm.bca.college01@gmail.com</code></li>
                                                <li>Enter your OLD password (or a new one). <em>Passwords are NOT copied from backup regarding security.</em></li>
                                            </ul>
                                        </li>
                                        <li><strong>Import Data:</strong> Log in to the new app, come to this page, and use "Upload & Restore".</li>
                                    </ol>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-2">Firestore Security Rules</h3>
                                    <p className="text-sm mb-3">Copy these rules to your new Firebase Console (Firestore Database {'>'} Rules) to secure the app:</p>
                                    <div className="relative group">
                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono">
                                            {`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. Users & Admin (Modified for Restore)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin needs to restore everyone's data
    }

    // 2. Forms & Analytics (Public Write)
    match /analytics/{docId} { allow read, update, create: if true; }
    match /system_logs/{logId} { allow create: if true; allow read, delete: if request.auth != null; }
    match /contacts/{contactId} { allow create: if true; allow read, delete: if request.auth != null; }
    match /inquiries/{docId} { allow create: if true; allow read, delete: if request.auth != null; }
    match /subscribers/{docId} { allow create: if true; allow read, delete: if request.auth != null; }

    // 3. General Content (Read Public, Write Admin)
    match /{collection}/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`}
                                        </pre>
                                        <button
                                            onClick={() => handleCopy(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 1. Users & Admin (Modified for Restore)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Admin needs to restore everyone's data
    }

    // 2. Forms & Analytics (Public Write)
    match /analytics/{docId} { allow read, update, create: if true; }
    match /system_logs/{logId} { allow create: if true; allow read, delete: if request.auth != null; }
    match /contacts/{contactId} { allow create: if true; allow read, delete: if request.auth != null; }
    match /inquiries/{docId} { allow create: if true; allow read, delete: if request.auth != null; }
    match /subscribers/{docId} { allow create: if true; allow read, delete: if request.auth != null; }

    // 3. General Content (Read Public, Write Admin)
    match /{collection}/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`, 'rules')}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white bg-gray-800 rounded shadow-sm border border-gray-700"
                                            title="Copy to clipboard"
                                        >
                                            {copied === 'rules' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

