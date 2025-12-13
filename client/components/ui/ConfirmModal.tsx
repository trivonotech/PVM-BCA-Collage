import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    loading = false
}: ConfirmModalProps) {

    const colors = {
        danger: {
            icon: 'text-red-600',
            bg: 'bg-red-50',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            icon: 'text-yellow-600',
            bg: 'bg-yellow-50',
            button: 'bg-yellow-600 hover:bg-yellow-700'
        },
        info: {
            icon: 'text-blue-600',
            bg: 'bg-blue-50',
            button: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const color = colors[type];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="sm">
            <div className="text-center">
                <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <AlertTriangle className={`w-8 h-8 ${color.icon}`} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-8">{message}</p>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-colors shadow-lg ${color.button} ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
