import React from 'react';
import { FileItem } from '@/hooks/use-repository';
import { FileText, Image as ImageIcon, FileSpreadsheet, File, Download, Star, Trash2, History, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FileCardProps {
  file: FileItem;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenVersions?: (file: FileItem) => void;
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf': return <FileText className="h-10 w-10 text-red-500" />;
    case 'docx':
    case 'doc': return <FileText className="h-10 w-10 text-blue-500" />;
    case 'xlsx':
    case 'xls': return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
    case 'pptx':
    case 'ppt': return <File className="h-10 w-10 text-orange-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg': return <ImageIcon className="h-10 w-10 text-purple-500" />;
    default: return <File className="h-10 w-10 text-gray-500" />;
  }
};

export function FileCard({
  file,
  isSelected,
  onToggleSelection,
  onToggleFavorite,
  onDelete,
  onOpenVersions
}: FileCardProps) {
  return (
    <div 
      className={cn(
        "group relative flex flex-col items-center p-4 border rounded-xl bg-card text-card-foreground transition-all hover:shadow-md cursor-pointer",
        isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"
      )}
      onClick={() => onToggleSelection(file.id)}
    >
      <button 
        className={cn(
          "absolute top-2 left-2 z-10 w-5 h-5 rounded flex items-center justify-center transition-opacity border",
          isSelected ? "bg-primary border-primary text-primary-foreground opacity-100" : "bg-background border-input opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelection(file.id);
        }}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </button>

      <button
        className={cn(
          "absolute top-2 right-2 z-10 transition-opacity",
          file.isFavorite ? "opacity-100 text-amber-500" : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-amber-500"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(file.id);
        }}
      >
        <Star className={cn("h-4 w-4", file.isFavorite && "fill-current")} />
      </button>

      <div className="mt-3 mb-2 flex items-center justify-center w-full h-14">
        {getFileIcon(file.type)}
      </div>

      <div className="w-full text-center space-y-1">
        <h3 className="font-medium text-xs truncate max-w-full px-1" title={file.name}>{file.name}</h3>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{formatBytes(file.size)}</span>
          <span>•</span>
          <Badge variant="secondary" className="h-4 px-1 text-[10px] font-mono">
            v{file.currentVersion || 1}.0
          </Badge>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-background/90 backdrop-blur-sm border-t p-1.5 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
        <button 
          className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
          title="Histórico de Versões"
          onClick={(e) => {
            e.stopPropagation();
            onOpenVersions?.(file);
          }}
        >
          <History className="h-3.5 w-3.5" />
        </button>
        <button 
          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
          title="Baixar"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-3.5 w-3.5" />
        </button>
        <button 
          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          title="Excluir"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
