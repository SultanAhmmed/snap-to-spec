import React, { useRef, useState } from 'react';
import { Upload, Camera, Loader2 } from './Icons';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    
    // Simple compression/resize logic could go here, but strictly sticking to guidelines:
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix for API
      const base64 = result.split(',')[1];
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}
          ${isProcessing ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-6 p-4 bg-indigo-500/10 rounded-full text-indigo-400 animate-pulse-slow">
            {isProcessing ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : (
              <Camera className="w-12 h-12" />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            {isProcessing ? "Analyzing structural damage..." : "Snap or Upload a Photo"}
          </h3>
          
          <p className="text-slate-400 mb-8 max-w-xs mx-auto">
            {isProcessing 
              ? "Identifying the object and generating repair steps."
              : "Drag & drop an image here, or click to select from your device."
            }
          </p>

          {!isProcessing && (
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Photo
              </button>
            </div>
          )}
        </div>
      </div>
      
      {!isProcessing && (
        <p className="text-center text-slate-500 text-sm mt-4">
          Supports JPG, PNG, WEBP. Max 20MB.
        </p>
      )}
    </div>
  );
};