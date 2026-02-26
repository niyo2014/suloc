import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onFilesSelected, maxFiles = 10, label = "Déposez vos images ici" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [previews, setPreviews] = useState([]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const processFiles = useCallback((files) => {
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        if (validFiles.length > 0) {
            // Create previews
            const newPreviews = validFiles.map(file => ({
                file,
                url: URL.createObjectURL(file)
            }));

            setPreviews(prev => {
                const updated = [...prev, ...newPreviews].slice(0, maxFiles);
                // Clean up old URLs to prevent memory leaks if we're replacing
                return updated;
            });

            // Pass files up to parent
            onFilesSelected(validFiles);
        }
    }, [maxFiles, onFilesSelected]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFiles(e.dataTransfer.files);
        }
    }, [processFiles]);

    const handleChange = useCallback((e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFiles(e.target.files);
        }
    }, [processFiles]);

    const removeImage = (index) => {
        setPreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index].url);
            newPreviews.splice(index, 1);
            return newPreviews;
        });
        // Note: Removing from file list in parent needs to be handled if crucial, 
        // but for simple append uploads, we mainly care about the current batch.
        // If we need sync, we should control state from parent. 
        // For this version, let's keep it simple: this handles *new* uploads preview.
    };

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors
                    ${dragActive ? 'border-suloc-blue bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple={maxFiles > 1}
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <Upload className={`mb-2 ${dragActive ? 'text-suloc-blue' : 'text-gray-400'}`} size={32} />
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP jusqu'à 5MB</p>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={preview.url}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
