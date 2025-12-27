import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Search, Trash2, Mail, CheckCircle, Archive, Phone, Calendar, Clock, FileDown, Eye, X } from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

type Inquiry = {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'archived';
    createdAt: unknown;
};

export default function InquiriesManager() {
    const { toast } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');

    // View Modal State
    const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

    // Confirm Modal State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        inquiryId: string | null;
        action: 'delete' | 'archive' | null;
    }>({
        isOpen: false,
        inquiryId: null,
        action: null,
    });

    useEffect(() => {
        const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Inquiry[];
            setInquiries(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: Inquiry['status']) => {
        try {
            await updateDoc(doc(db, 'inquiries', id), {
                status: newStatus
            });
            toast({
                title: "Status Updated",
                description: `Inquiry marked as ${newStatus}.`,
                className: "bg-blue-500 text-white border-none",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive",
            });
        }
    };

    const confirmAction = (id: string, action: 'delete' | 'archive') => {
        setConfirmState({ isOpen: true, inquiryId: id, action });
    };

    const executeAction = async () => {
        if (!confirmState.inquiryId || !confirmState.action) return;

        try {
            if (confirmState.action === 'delete') {
                await deleteDoc(doc(db, 'inquiries', confirmState.inquiryId));
                toast({
                    title: "Deleted",
                    description: "Inquiry has been permanently deleted.",
                    variant: "destructive",
                });
            } else if (confirmState.action === 'archive') {
                await handleStatusUpdate(confirmState.inquiryId, 'archived');
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Action failed.", variant: "destructive" });
        } finally {
            setConfirmState({ isOpen: false, inquiryId: null, action: null });
        }
    };

    // Helper for Safe Date Formatting
    const formatDateSafe = (seconds: number | undefined, formatStr: string) => {
        if (!seconds) return 'Just now';
        try {
            return format(new Date(seconds * 1000), formatStr);
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const exportToExcel = () => {
        const headers = ["Name", "Email", "Phone", "Subject", "Message", "Status", "Date"];
        const csvRows = [headers.join(',')];

        filteredInquiries.forEach(inq => {
            const dateStr = formatDateSafe((inq.createdAt as any)?.seconds, 'yyyy-MM-dd HH:mm:ss');
            // Escape quotes and commas for CSV format
            const clean = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

            const row = [
                clean(inq.name),
                clean(inq.email),
                clean(inq.phone),
                clean(inq.subject),
                clean(inq.message),
                clean(inq.status),
                clean(dateStr)
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inquiries_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredInquiries = inquiries.filter(inq => {
        const name = inq.name || '';
        const email = inq.email || '';
        const subject = inq.subject || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'read': return 'bg-green-100 text-green-700 border-green-200';
            case 'archived': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                        <p className="text-gray-600 mt-1">Manage and export contact form submissions</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            {(['all', 'new', 'read', 'archived'] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${statusFilter === status
                                        ? 'bg-[#0B0B3B] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        } capitalize`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
                        >
                            <FileDown className="w-4 h-4" />
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Inquiries List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading inquiries...</div>
                    ) : filteredInquiries.length === 0 ? (
                        <div className="text-center py-20">
                            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No Inquiries Found</h3>
                            <p className="text-gray-500">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View: Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                            <TableHead className="w-[200px] font-semibold text-[#0B0B3B]">Student / User</TableHead>
                                            <TableHead className="font-semibold text-[#0B0B3B]">Subject</TableHead>
                                            <TableHead className="font-semibold text-[#0B0B3B]">Status</TableHead>
                                            <TableHead className="font-semibold text-[#0B0B3B]">Date</TableHead>
                                            <TableHead className="text-right font-semibold text-[#0B0B3B]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInquiries.map((inq) => (
                                            <TableRow key={inq.id} className="hover:bg-blue-50/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-900">{inq.name}</span>
                                                        <span className="text-xs text-gray-500">{inq.email}</span>
                                                        {inq.phone && <span className="text-xs text-gray-400">{inq.phone}</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        <div className="font-medium text-gray-900 truncate" title={inq.subject}>
                                                            {inq.subject}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate" title={inq.message}>
                                                            {inq.message}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(inq.status)}`}>
                                                        {inq.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDateSafe((inq.createdAt as any)?.seconds, 'MMM d, yyyy')}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDateSafe((inq.createdAt as any)?.seconds, 'h:mm a')}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setViewInquiry(inq)}
                                                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {inq.status !== 'read' && inq.status !== 'archived' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(inq.id, 'read')}
                                                                className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                                                title="Mark as Read"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {inq.status !== 'archived' && (
                                                            <button
                                                                onClick={() => confirmAction(inq.id, 'archive')}
                                                                className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                                title="Archive"
                                                            >
                                                                <Archive className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => confirmAction(inq.id, 'delete')}
                                                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile View: Cards */}
                            <div className="md:hidden divide-y divide-gray-100 px-4">
                                {filteredInquiries.map((inq) => (
                                    <div key={inq.id} className="py-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="min-w-0 flex-1 pr-4">
                                                <h4 className="font-bold text-gray-900 break-words leading-tight">{inq.name}</h4>
                                                <div className="flex flex-col mt-0.5">
                                                    <p className="text-xs text-blue-600 truncate">{inq.email}</p>
                                                    {inq.phone && <p className="text-[10px] text-gray-400 font-medium">{inq.phone}</p>}
                                                </div>
                                            </div>
                                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(inq.status)}`}>
                                                {inq.status}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <p className="text-xs font-bold text-[#0B0B3B] uppercase mb-1">Subject & Message</p>
                                            <p className="text-sm text-gray-800 font-bold line-clamp-1 leading-relaxed">{inq.subject}</p>
                                            <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">{inq.message}</p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 pt-1">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDateSafe((inq.createdAt as any)?.seconds, 'MMM d, yyyy')}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDateSafe((inq.createdAt as any)?.seconds, 'h:mm a')}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setViewInquiry(inq)}
                                                    className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors ring-1 ring-blue-100"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {inq.status !== 'read' && inq.status !== 'archived' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(inq.id, 'read')}
                                                        className="p-2.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors ring-1 ring-green-100"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => confirmAction(inq.id, 'delete')}
                                                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors ring-1 ring-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* View Details Dialog */}
                <Dialog open={!!viewInquiry} onOpenChange={(open) => !open && setViewInquiry(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                                <span>Inquiry Details</span>
                            </DialogTitle>
                            <DialogDescription>
                                Received on {formatDateSafe((viewInquiry?.createdAt as any)?.seconds, 'MMMM d, yyyy')} at {formatDateSafe((viewInquiry?.createdAt as any)?.seconds, 'h:mm a')}
                            </DialogDescription>
                        </DialogHeader>

                        {viewInquiry && (
                            <div className="space-y-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">From</label>
                                        <div className="font-semibold text-lg text-gray-900">{viewInquiry.name}</div>
                                        <div className="text-blue-600">{viewInquiry.email}</div>
                                        <div className="text-gray-600 text-sm">{viewInquiry.phone}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(viewInquiry.status)}`}>
                                                {viewInquiry.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Subject</label>
                                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 font-medium text-gray-900">
                                        {viewInquiry.subject}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 leading-relaxed min-h-[150px] whitespace-pre-wrap">
                                        {viewInquiry.message}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <div className="flex gap-2 w-full justify-end">
                                <button
                                    onClick={() => setViewInquiry(null)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                {viewInquiry?.status !== 'read' && (
                                    <button
                                        onClick={() => {
                                            if (viewInquiry) {
                                                handleStatusUpdate(viewInquiry.id, 'read');
                                                setViewInquiry(null);
                                            }
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Confirm Delete/Archive Modal */}
                <ConfirmModal
                    isOpen={confirmState.isOpen}
                    onClose={() => setConfirmState({ isOpen: false, inquiryId: null, action: null })}
                    onConfirm={executeAction}
                    title={confirmState.action === 'delete' ? "Delete Inquiry" : "Archive Inquiry"}
                    message={confirmState.action === 'delete'
                        ? "Are you sure you want to permanently delete this inquiry? This action cannot be undone."
                        : "Are you sure you want to archive this inquiry?"}
                    confirmText={confirmState.action === 'delete' ? "Delete" : "Archive"}
                    type={confirmState.action === 'delete' ? "danger" : "warning"}
                />
            </div>
        </AdminLayout>
    );
}
