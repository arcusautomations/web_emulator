'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, AlertCircle, CheckCircle, FileUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectSystemFromExtension, validateROM, hashROM } from '@/lib/utils/rom-utils';
import { set } from 'idb-keyval';
import { createClient } from '@/lib/supabase/client';

export function ROMUploader() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'validating' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setStatus('validating');
    setError(null);
    setProgress(0);

    // Detect system
    const system = detectSystemFromExtension(file.name);
    if (!system) {
      setStatus('error');
      setError('Unsupported file type. Use .gb, .gbc, .gba, or .nes files.');
      return;
    }

    // Validate ROM
    const validation = await validateROM(file, system);
    if (!validation.valid) {
      setStatus('error');
      setError(validation.error ?? 'Invalid ROM file.');
      return;
    }

    setStatus('uploading');
    setProgress(30);

    // Hash ROM
    const hash = await hashROM(file);
    setProgress(50);

    // Store ROM in IndexedDB
    const romBuffer = await file.arrayBuffer();
    await set(`arcadium:rom:${hash}`, romBuffer);
    setProgress(70);

    // Create metadata in Supabase
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setStatus('error');
      setError('Not authenticated.');
      return;
    }

    const { error: dbError } = await supabase.from('games').insert({
      user_id: user.id,
      title: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
      system,
      file_hash: hash,
      file_size_bytes: file.size,
      source: 'uploaded',
    });

    if (dbError) {
      if (dbError.code === '23505') { // unique violation
        setStatus('error');
        setError('This ROM is already in your library.');
      } else {
        setStatus('error');
        setError('Failed to save game metadata.');
      }
      return;
    }

    setProgress(100);
    setStatus('success');
    router.refresh();

    // Reset after 2s
    setTimeout(() => {
      setStatus('idle');
      setProgress(0);
    }, 2000);
  }, [router]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-neon-cyan bg-cyan-dim/10 shadow-glow-md-cyan'
          : 'border-surface-3 hover:border-magenta-dim hover:bg-surface-1/50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".gb,.gbc,.gba,.nes"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Upload size={32} className="mx-auto mb-3 text-text-tertiary" />
            <p className="font-pixel text-h4 text-text-secondary">DROP ROM HERE</p>
            <p className="text-text-tertiary text-caption mt-2">.gb .gbc .gba .nes — Max 32MB</p>
          </motion.div>
        )}

        {status === 'validating' && (
          <motion.div key="validating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FileUp size={32} className="mx-auto mb-3 text-neon-cyan animate-pulse" />
            <p className="font-pixel text-h4 text-neon-cyan">VALIDATING...</p>
          </motion.div>
        )}

        {status === 'uploading' && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
            <FileUp size={32} className="mx-auto mb-3 text-neon-cyan" />
            <p className="font-pixel text-h4 text-neon-cyan mb-3">LOADING CARTRIDGE...</p>
            <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <CheckCircle size={32} className="mx-auto mb-3 text-success" />
            <p className="font-pixel text-h4 text-success">CARTRIDGE LOADED!</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <AlertCircle size={32} className="mx-auto mb-3 text-error" />
            <p className="font-pixel text-h4 text-error mb-2">LOAD FAILED</p>
            <p className="text-error-light text-caption">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
