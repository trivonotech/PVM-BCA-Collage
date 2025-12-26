import { Check, X, Edit, Trash2 } from 'lucide-react';

interface NewsSubmission {
    id: string;
    title: string;
    content: string;
    category: string;
    imageUrl?: string;
    submittedBy: {
        name: string;
        email: string;
        rollNumber: string;
        role?: string;
        department?: string;
        designation?: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: any;
    approvedBy?: string;
    approvedAt?: any;
    rejectedBy?: string;
    rejectedAt?: any;
}

interface NewsItemCardProps {
    item: NewsSubmission;
    activeTab: 'pending' | 'approved' | 'rejected';
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (item: NewsSubmission) => void;
}

export default function NewsItemCard({
    item,
    activeTab,
    onApprove,
    onReject,
    onDelete,
    onEdit
}: NewsItemCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Image */}
                {item.imageUrl && (
                    <div className="flex-shrink-0">
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-48 md:w-48 md:h-32 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                {item.category}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{item.content}</p>

                    {/* Submitter Info */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600">
                            <strong>Submitted by:</strong> {item.submittedBy.name} ({item.submittedBy.rollNumber})
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Email:</strong> {item.submittedBy.email}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {item?.submittedAt?.toDate?.().toLocaleString() || 'N/A'}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        {activeTab === 'pending' && (
                            <>
                                <button
                                    onClick={() => onApprove(item.id)}
                                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                                >
                                    <Check className="w-4 h-4" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => onEdit(item)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => onReject(item.id)}
                                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    Reject
                                </button>
                            </>
                        )}
                        {(activeTab === 'approved' || activeTab === 'rejected') && (
                            <button
                                onClick={() => onDelete(item.id)}
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
