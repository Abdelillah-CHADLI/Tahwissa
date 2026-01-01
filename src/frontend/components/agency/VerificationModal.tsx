import { useState } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import api from "../../services/api";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    agencyId: string;
    onSuccess: () => void;
}

export function VerificationModal({ isOpen, onClose, agencyId, onSuccess }: VerificationModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Validate file type (PDF, images)
            const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Please upload a PDF or image file (JPG, PNG)');
                return;
            }
            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('acc_type', 'agency');
            formData.append('id', agencyId);

            await api.post('/verification/verify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit verification request';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Apply for Verification</h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Upload official documents to verify your agency
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Required Documents</h3>
                            <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                <li>• Business registration certificate</li>
                                <li>• Tourism license or permit</li>
                                <li>• Tax identification document</li>
                                <li>• Insurance certificate (if applicable)</li>
                            </ul>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Upload Document</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    {file ? (
                                        <>
                                            <FileText className="w-12 h-12 text-green-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF, JPG, PNG (max 5MB)
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Verification typically takes 1-3 business days.
                                You'll be notified once your application is reviewed.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                disabled={loading || !file}
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
