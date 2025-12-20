import { ShieldAlert, LogOut } from 'lucide-react';

interface SessionExpiredModalProps {
    isOpen: boolean;
    onConfirm: () => void;
}

export default function SessionExpiredModal({ isOpen, onConfirm }: SessionExpiredModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 animate-in zoom-in-95 duration-300 border-2 border-red-100">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-red-50">
                        <ShieldAlert className="w-10 h-10 text-red-600" />
                    </div>

                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Session Expired</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        This session has been terminated remotely by an administrator. Please log in again to continue.
                    </p>

                    <button
                        onClick={onConfirm}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-red-200 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Return to Login
                    </button>
                </div>
                <div className="bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-400 font-mono">PVM Secure Access Control</p>
                </div>
            </div>
        </div>
    );
}
