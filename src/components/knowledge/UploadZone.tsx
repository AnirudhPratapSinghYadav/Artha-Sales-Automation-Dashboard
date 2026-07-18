'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadKnowledgeDocument } from '@/lib/n8n';
import clsx from 'clsx';

export function UploadZone() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('Product Doc');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    // Validate file type (MIME type and file extension fallback)
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const fileName = selectedFile.name.toLowerCase();
    const hasValidExt = fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.txt');
    
    if (!validTypes.includes(selectedFile.type) && !hasValidExt) {
      setStatus('error');
      setMessage('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Validate file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxFileSize) {
      setStatus('error');
      setMessage('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }
    
    setFile(selectedFile);
    setStatus('idle');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    try {
      const result = await uploadKnowledgeDocument(file, category);
      if (result.success) {
        setStatus('success');
        setMessage('✅ Added to knowledge base. Maya is now aware of this context.');
        setFile(null);
      } else {
        setStatus('error');
        setMessage(`❌ Failed: ${result.message}`);
      }
    } catch (err) {
      setStatus('error');
      setMessage('❌ Failed to upload document.');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 border border-gray-200 dark:border-zinc-800 rounded-xl mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-4">Upload New Knowledge</h3>
      
      <div 
        className={clsx(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors relative",
          dragActive ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-300 dark:border-zinc-700 hover:border-primary-400 dark:hover:border-primary-500"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => status !== 'uploading' && inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef}
          onChange={handleChange}
          className="hidden" 
          accept=".pdf,.docx,.txt"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
          <UploadCloud className={clsx("w-10 h-10", dragActive ? "text-primary-600" : "text-gray-400 dark:text-zinc-500")} />
          
          {file ? (
            <p className="text-gray-900 dark:text-zinc-100 font-medium">{file.name} <span className="text-sm text-gray-500 dark:text-zinc-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span></p>
          ) : (
            <>
              <p className="text-gray-900 dark:text-zinc-100 font-medium">Drop your document here, or click to browse</p>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Accepts PDF, DOCX, TXT</p>
            </>
          )}
        </div>
      </div>

      {file && status !== 'success' && (
        <div className="mt-4 flex items-center gap-4 bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-gray-100 dark:border-zinc-800">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Document Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={status === 'uploading'}
            >
              <option value="Product Doc">Product Documentation</option>
              <option value="Case Study">Case Study</option>
              <option value="Competitor Intel">Competitor Intelligence</option>
              <option value="Sales Tactic">Sales Script/Tactic</option>
            </select>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); handleUpload(); }}
            disabled={status === 'uploading'}
            className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 flex items-center transition-colors"
          >
            {status === 'uploading' ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Processing...</>
            ) : 'Upload & Process'}
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900/50 flex items-center text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
          {message}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50 flex items-center text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
          {message}
        </div>
      )}
    </div>
  );
}
