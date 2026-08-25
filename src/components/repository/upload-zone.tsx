import React, { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils';

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    setIsUploading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setFiles([]);
          setProgress(0);
        }, 500);
      }
    }, 200);
  };

  if (files.length === 0) {
    return (
      <div 
        className={cn(
          "w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50 hover:border-primary/50"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          className="hidden" 
          onChange={onFileInput}
        />
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Upload de Arquivos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Arraste e solte arquivos aqui, ou clique para selecionar
        </p>
        <div className="text-xs text-muted-foreground">
          Suporta PDF, DOCX, XLSX, PPTX, Imagens (Max 50MB)
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Arquivos selecionados ({files.length})</h3>
        {!isUploading && (
          <button 
            onClick={() => setFiles([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar tudo
          </button>
        )}
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-4">
        {files.map((file, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
            <span className="truncate flex-1 mr-4">{file.name}</span>
            <span className="text-muted-foreground text-xs mr-2">{formatBytes(file.size)}</span>
            {!isUploading && (
              <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {isUploading ? (
        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Enviando...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-200" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <button 
            className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
            onClick={() => setFiles([])}
          >
            Cancelar
          </button>
          <button 
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
            onClick={handleUpload}
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Iniciar Upload
          </button>
        </div>
      )}
    </div>
  );
}
