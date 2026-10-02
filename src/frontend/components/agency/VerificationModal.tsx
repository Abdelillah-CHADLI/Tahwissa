import { Dialog } from '../ui';
import { useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import api from "../../services/api";
import { getCurrentProfileType } from "../../utils/session";
import { getContextText } from "../../utils/userContext";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    agencyId: string;
    onSuccess: () => void;
    profileType?: 'agency' | 'guide';
}

export function VerificationModal({ isOpen, onClose, agencyId, onSuccess, profileType }: VerificationModalProps) {
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
            const accountType = profileType || getCurrentProfileType() || 'agency';
            const formData = new FormData();
            formData.append('file', file);
            formData.append('acc_type', accountType);
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
        <Dialog open={isOpen} onClose={onClose} busy={loading} title="Apply for verification" description={getContextText('Upload an official document to verify your agency.', 'Upload an official document to verify your guide profile.')}>
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
                            <div className="border border-dashed border-line rounded-lg p-5 text-center focus-within:ring-2 focus-within:ring-brand">
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    {file ? (
                                        <>
                                            <FileText className="w-8 h-8 text-green-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-700">
                                                Choose a document
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF, JPG, PNG (max 5MB)
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="bg-brand-soft border border-line rounded-lg p-4">
                            <p className="text-sm text-brand-ink">
                                Your document is private and available to the Tahwissa review team. Check your dashboard for your verification status.
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
                                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50"
                                disabled={loading || !file}
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
        </Dialog>
    );
}
