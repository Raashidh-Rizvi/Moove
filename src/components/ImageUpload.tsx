import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Move, Star } from 'lucide-react';
import { PropertyImage } from '../types/booking';

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 10,
  maxFileSize = 2
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    return null;
  };

  const handleFiles = (files: FileList) => {
    setError('');
    const newImages = [...images];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if we've reached the limit
      if (newImages.length >= maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        break;
      }

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      // Check for duplicates
      const isDuplicate = newImages.some(img => 
        img.name === file.name && img.size === file.size
      );
      
      if (!isDuplicate) {
        newImages.push(file);
      }
    }

    onChange(newImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  const setMainImage = (index: number) => {
    if (index === 0) return; // Already main image
    const newImages = [...images];
    const [mainImage] = newImages.splice(index, 1);
    newImages.unshift(mainImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Property Images
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <div className="text-sm text-gray-500">
          <p>• Maximum {maxImages} images</p>
          <p>• JPEG, PNG, WebP formats only</p>
          <p>• Maximum {maxFileSize}MB per image</p>
          <p>• First image will be the main property image</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Uploaded Images ({images.length}/{maxImages})
            </h4>
            <p className="text-sm text-gray-600">
              Drag to reorder • First image is the main photo
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="relative group bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString());
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  if (fromIndex !== index) {
                    moveImage(fromIndex, index);
                  }
                }}
              >
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Main</span>
                    </div>
                  </div>
                )}

                {/* Image */}
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-32 object-cover"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {/* Set as Main */}
                    {index !== 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMainImage(index);
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                        title="Set as main image"
                      >
                        <Star className="w-4 h-4 text-gray-600" />
                      </button>
                    )}

                    {/* Move Handle */}
                    <button
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-move"
                      title="Drag to reorder"
                    >
                      <Move className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(image.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload More Button */}
      {images.length > 0 && images.length < maxImages && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full btn-secondary py-3 flex items-center justify-center space-x-2"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Add More Images ({images.length}/{maxImages})</span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;