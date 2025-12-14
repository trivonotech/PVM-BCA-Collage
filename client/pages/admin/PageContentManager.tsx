import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FileText, Pencil, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PageContentManager() {
    const navigate = useNavigate();

    // Fixed list of manageable pages
    const pages = [
        { id: 'about', title: 'About Us', path: '/about', lastUpdated: 'Recently' },
        { id: 'contact', title: 'Contact Us', path: '/contact', lastUpdated: 'Recently' },
        { id: 'privacy', title: 'Privacy Policy', path: '/privacy', lastUpdated: 'Never' },
        { id: 'terms', title: 'Terms & Conditions', path: '/terms', lastUpdated: 'Never' }
    ];

    return (
        <AdminLayout title="Page Content Manager">
            <div className="grid gap-6">
                {pages.map(page => (
                    <div key={page.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate(`/admin/pages/editor/${page.id}`)}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{page.title}</h3>
                                <p className="text-sm text-gray-500">Path: {page.path}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 hidden md:block">Last updated: {page.lastUpdated}</span>
                            <div className="p-2 text-gray-300 group-hover:text-blue-600 transition">
                                <ChevronRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
