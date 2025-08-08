import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { adminAPI } from '../utilfunctions/api';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  placeholder = "Enter image URL or upload an image", 
  required = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await adminAPI.uploadImage(token, file);
      console.log('Upload response:', response); // Debug log
      
      if (response.success) {
        // Delete old image if it was server-hosted
        if (value && value.includes('/uploads/')) {
          try {
            await adminAPI.deleteImage(token, value);
          } catch (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
        
        // Access the nested data structure from the API wrapper
        const imageUrl = response.data.data?.url || response.data.url;
        console.log('Image URL:', imageUrl); // Debug log
        onChange(imageUrl);
      } else {
        setError(response.message || 'Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!value) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (token && value.includes('/uploads/')) {
        // Only delete if it's a server-hosted image
        await adminAPI.deleteImage(token, value);
      }
      onChange('');
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Still remove from UI even if deletion failed
      onChange('');
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.imageUpload}>
      <label className={styles.label}>
        {label} {required && '*'}
      </label>
      
      <div className={styles.uploadContainer}>
        {/* URL Input */}
        <div className={styles.urlInput}>
          <input
            type="url"
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className={styles.input}
          />
        </div>

        {/* Upload Button */}
        <div className={styles.uploadActions}>
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={uploading}
            className={styles.uploadButton}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          
          {value && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className={styles.removeButton}
            >
              Remove
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Error Message */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Image Preview */}
      {value && (
        <div className={styles.preview}>
          <div className={styles.previewLabel}>Preview:</div>
          <div className={styles.imageContainer}>
            <Image
              src={value}
              alt="Preview"
              width={200}
              height={150}
              style={{ objectFit: 'cover' }}
              className={styles.previewImage}
              onError={() => setError('Failed to load image preview')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
