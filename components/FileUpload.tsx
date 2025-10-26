import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if(disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
        onFileSelect(file);
    }
  };


  return (
    <div
      className={`relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer bg-white'}`}
      onClick={!disabled ? handleClick : undefined}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span className="mt-2 block text-sm font-medium text-gray-900">
        Drop invoice image or PDF here, or click to select
      </span>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp, application/pdf"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};

export default FileUpload;