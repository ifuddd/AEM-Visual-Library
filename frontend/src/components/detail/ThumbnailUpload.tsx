'use client';

import { useRef, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ComponentImage } from '@/components/common/ComponentImage';

interface ThumbnailUploadProps {
  thumbnailUrl: string | null;
  onThumbnailChange: (base64OrUrl: string | null) => void;
}

export function ThumbnailUpload({ thumbnailUrl, onThumbnailChange }: ThumbnailUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('File size must be less than 5MB.');
      return;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onThumbnailChange(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onThumbnailChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {thumbnailUrl ? (
        <div className="relative w-full max-w-sm">
          <ComponentImage
            src={thumbnailUrl}
            alt="Component thumbnail"
            aspectRatio="16/9"
            className="rounded-lg border-2 border-gray-300"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 shadow-md z-10"
            title="Remove thumbnail"
            aria-label="Remove thumbnail"
          >
            <XMarkIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-full max-w-sm aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-colors"
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600 mt-2">Click to upload</p>
          </div>
        </div>
      )}

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload/Change Button */}
      <div>
        <button
          onClick={handleClick}
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {thumbnailUrl ? 'Change Thumbnail' : 'Upload Thumbnail'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        JPG, PNG, or WebP. Max size: 5MB. Recommended: 800x450px (16:9)
      </p>
    </div>
  );
}
