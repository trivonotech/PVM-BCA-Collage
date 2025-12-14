import AdminLayout from '@/components/admin/AdminLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
    title: string;
    description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
    return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-blue-50 p-6 rounded-full mb-6">
                    <Construction className="w-16 h-16 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                <p className="text-gray-600 max-w-md mb-8 text-lg">
                    {description || 'This module is currently under development. Please check back later.'}
                </p>
                <div className="animate-pulse bg-gray-200 h-2 w-32 rounded-full mx-auto"></div>
            </div>
        </AdminLayout>
    );
}
