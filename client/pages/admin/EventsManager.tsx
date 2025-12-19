import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Eye, X, Upload, Calendar as CalendarIcon } from 'lucide-react';
import type { Event } from '@/../../shared/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useToast } from "@/components/ui/use-toast";

interface EventsManagerProps {
    pageTitle?: string;
    defaultCategory?: string;
}

export default function EventsManager({ pageTitle = 'Events Management', defaultCategory = '' }: EventsManagerProps) {
    const { toast } = useToast();
    const term = defaultCategory || 'Event';
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Firestore Reference
    const eventsCollection = collection(db, 'events');

    // Subscribe to Events
    useEffect(() => {
        const q = query(eventsCollection, orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Event[];
            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Confirmation Modal States
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [deleteType, setDeleteType] = useState<'event' | 'category' | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        category: 'Cultural' as Event['category'],
        image: '',
        description: '',
    });

    const [categories, setCategories] = useState<string[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categoryDocs, setCategoryDocs] = useState<{ id: string, name: string }[]>([]);

    // Subscribe to Categories
    useEffect(() => {
        const q = query(collection(db, 'event_categories'), orderBy('name'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            setCategoryDocs(docs);
            const cats = docs.map(d => d.name);
            setCategories(cats.length > 0 ? cats : ['Cultural', 'Sports', 'Workshop', 'Festival', 'Competition', 'Other']);
        });
        return () => unsubscribe();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            try {
                if (categories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
                    toast({
                        title: "Error",
                        description: "Category already exists",
                        variant: "destructive",
                        duration: 3000,
                    });
                    return;
                }
                await addDoc(collection(db, 'event_categories'), { name: newCategory.trim() });
                setNewCategory('');
                toast({
                    title: "Success",
                    description: "Category added successfully!",
                    className: "bg-green-500 text-white border-none",
                    duration: 3000,
                });
            } catch (error) {
                console.error("Error adding category: ", error);
                toast({
                    title: "Error",
                    description: "Failed to add category",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        }
    };

    const confirmDeleteCategory = (id: string) => {
        setItemToDelete(id);
        setDeleteType('category');
        setShowDeleteConfirm(true);
    };

    const confirmDeleteEvent = (id: string) => {
        setItemToDelete(id);
        setDeleteType('event');
        setShowDeleteConfirm(true);
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (deleteType === 'event') {
                await deleteDoc(doc(db, 'events', itemToDelete));
            } else if (deleteType === 'category') {
                await deleteDoc(doc(db, 'event_categories', itemToDelete));
            }
            setShowDeleteConfirm(false);
            setItemToDelete(null);
            setDeleteType(null);
            toast({
                title: "Success",
                description: `${deleteType === 'event' ? 'Event' : 'Category'} deleted successfully`,
                className: "bg-green-500 text-white border-none",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error deleting:", error);
            toast({
                title: "Error",
                description: "Failed to delete item",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingEvent) {
                // Update existing event
                const eventRef = doc(db, 'events', editingEvent.id);
                await updateDoc(eventRef, {
                    ...formData,
                    category: String(formData.category),
                    updatedAt: new Date().toISOString()
                });
                toast({
                    title: "Success",
                    description: "Event updated successfully!",
                    className: "bg-green-500 text-white border-none",
                    duration: 3000,
                });
            } else {
                // Add new event(s)
                if (selectedFiles.length > 0) {
                    // Bulk Upload
                    let processedCount = 0;
                    for (const file of selectedFiles) {
                        try {
                            const compressedBase64 = await compressImage(file);
                            await addDoc(eventsCollection, {
                                ...formData, // Reuse name, date, category, desc
                                image: compressedBase64,
                                category: String(formData.category),
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            });
                            processedCount++;
                        } catch (err) {
                            console.error("Failed to process file:", file.name, err);
                        }
                    }
                    toast({
                        title: "Bulk Upload Complete",
                        description: `Successfully created ${processedCount} events!`,
                        className: "bg-green-500 text-white border-none",
                        duration: 3000,
                    });
                } else {
                    // Single Upload (fallback if no file selected via new method but maybe via drag drop or something? 
                    // actually if selectedFiles is empty but formData.image is set, standard single add)
                    await addDoc(eventsCollection, {
                        ...formData,
                        category: String(formData.category),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    });
                    toast({
                        title: "Success",
                        description: "Event created successfully!",
                        className: "bg-green-500 text-white border-none",
                        duration: 3000,
                    });
                }
            }
            setShowModal(false);
        } catch (error) {
            console.error("Error saving event: ", error);
            toast({
                title: "Error",
                description: "Failed to save event",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const scaleSize = MAX_WIDTH / img.width;
                    const width = scaleSize < 1 ? MAX_WIDTH : img.width;
                    const height = scaleSize < 1 ? img.height * scaleSize : img.height;

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/webp', 0.8);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // If editing or only 1 file selected, standard behavior
        if (editingEvent || files.length === 1) {
            const file = files[0];
            try {
                const compressedBase64 = await compressImage(file);
                setImagePreview(compressedBase64);
                setFormData(prev => ({ ...prev, image: compressedBase64 }));
                setSelectedFiles([file]);
            } catch (err) {
                console.error("Compression error:", err);
                toast({
                    title: "Error",
                    description: "Failed to process image.",
                    variant: "destructive",
                });
            }
        } else {
            // Multiple files (New Event Mode)
            // Show preview of first, but store all
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);

            // Preview first one
            try {
                const compressedBase64 = await compressImage(fileArray[0]);
                setImagePreview(compressedBase64);
                // We don't set formData.image necessarily if we rely on selectedFiles, 
                // but setting it ensures the preview logic works
                setFormData(prev => ({ ...prev, image: compressedBase64 }));
            } catch (err) {
                console.error("Preview error:", err);
            }
        }
    };

    const handleAddNew = () => {
        setEditingEvent(null);
        setFormData({
            name: '',
            date: '',
            category: defaultCategory || categories[0] || '',
            description: '',
            image: '',
        });
        setImagePreview('');
        setSelectedFiles([]);
        setShowModal(true);
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            name: event.name,
            date: event.date,
            category: event.category,
            description: event.description || '',
            image: event.image || '',
        });
        setImagePreview(event.image || '');
        setSelectedFiles([]); // Clear multiple files in edit mode
        setShowModal(true);
    };

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = defaultCategory ? event.category === defaultCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
                        <p className="text-gray-600 mt-1">Manage {defaultCategory ? defaultCategory.toLowerCase() : 'festivals and cultural events'}</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-200 transition-colors shadow-lg"
                        >
                            Manage Categories
                        </button>
                        <button
                            onClick={handleAddNew}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add New {defaultCategory || 'Event'}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={`Search ${term.toLowerCase()}s by name...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="relative h-48">
                                <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3">
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    {event.date}
                                </p>
                                {event.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDeleteEvent(event.id)}
                                        className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No {term.toLowerCase()}s found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? 'Try a different search term' : `Get started by adding your first ${term.toLowerCase()}`}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleAddNew}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add First {term}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Category Modal */}
            <Modal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                title="Manage Categories"
                maxWidth="md"
            >
                <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                        className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">Add</button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categoryDocs.map((cat) => (
                        <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="font-medium text-gray-700">{cat.name}</span>
                            <button
                                type="button"
                                onClick={() => confirmDeleteCategory(cat.id)}
                                className="text-red-500 hover:text-red-700 p-1 bg-red-50 rounded-md hover:bg-red-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Event Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingEvent ? `Edit ${term}` : `Add New ${term}`}
                hideScrollbar={true}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {term} Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            placeholder="e.g., Annual Tech Fest 2024"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                            rows={4}
                            placeholder="Brief description of the event"
                        />
                    </div >

                    {/* Image Upload */}
                    < div >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Event Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-96 w-auto mx-auto rounded-lg object-contain shadow-sm"
                                    />
                                    {selectedFiles.length > 1 && (
                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            + {selectedFiles.length - 1} more photos
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview('');
                                            setFormData({ ...formData, image: '' });
                                            setSelectedFiles([]);
                                        }}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                    {!editingEvent && <p className="text-xs text-blue-600 mt-2 font-medium">You can select multiple photos to create bulk events</p>}
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple={!editingEvent} // Only allow multiple for new events
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            {!imagePreview && (
                                <label
                                    htmlFor="image-upload"
                                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                                >
                                    Choose File
                                </label>
                            )}
                        </div>
                    </div >

                    {/* Action Buttons */}
                    < div className="flex gap-4 pt-4" >
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? (selectedFiles.length > 1 ? 'Creating Bulk Events...' : 'Processing...')
                                : (editingEvent ? `Update ${term}` : (selectedFiles.length > 1 ? `Create ${selectedFiles.length} Events` : `Create ${term}`))
                            }
                        </button>
                    </div >
                </form >
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={executeDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to permanently delete this ${deleteType}?`}
                confirmText="Delete"
                type="danger"
            />
        </AdminLayout >
    );
}
