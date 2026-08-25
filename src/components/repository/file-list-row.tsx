import React from 'react';
import { FileItem } from '@/hooks/use-repository';
import { FileText, Image as ImageIcon, FileSpreadsheet, File, Download, Star, Trash2, History, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface FileListRowProps {
  file: FileItem;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onOpenVersions?: (file: FileItem) => void;
}

const getFileIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
    case 'docx':
    case 'doc': return <FileText className="h-5 w-5 text-blue-500" />;
    case 'xlsx':
    case 'xls': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'pptx':
    case 'ppt': return <File className="h-5 w-5 text-orange-500" />;
    case 'png':
    case 'jpg':
    case 'jpeg': return <ImageIcon className="h-5 w-5 text-purple-500" />;
    default: return <File className="h-5 w-5 text-gray-500" />;
  }
};

export function FileListRow({
  file,
  isSelected,
  onToggleSelection,
  onToggleFavorite,
  onDelete,
  onOpenVersions
}: FileListRowProps) {
  return (
    <div 
      className={cn(
        "group flex items-center gap-4 py-2.5 px-4 border-b hover:bg-muted/50 transition-colors cursor-pointer text-sm",
        isSelected ? "bg-muted font-medium" : "bg-card"
      )}
      onClick={() => onToggleSelection(file.id)}
    >
      <div className="w-5 flex items-center justify-center">
        <button 
          className={cn(
            "w-4 h-4 rounded flex items-center justify-center border transition-opacity",
            isSelected ? "bg-primary border-primary text-primary-foreground opacity-100" : "border-input opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection(file.id);
          }}
        >
          {isSelected && <Check className="h-3 w-3" />}
        </button>
      </div>

      <div className="w-5 flex items-center justify-center">
        <button
          className={cn(
            "transition-opacity",
            file.isFavorite ? "opacity-100 text-amber-500" : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-amber-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(file.id);
          }}
        >
          <Star className={cn("h-4 w-4", file.isFavorite && "fill-current")} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        {getFileIcon(file.type)}
        <span className="truncate font-medium" title={file.name}>{file.name}</span>
        <Badge variant="secondary" className="text-[10px] px-1 py-0 font-mono ml-1">
          v{file.currentVersion || 1}.0
        </Badge>
      </div>

      <div className="hidden md:block w-24 text-muted-foreground text-xs uppercase">
        {file.type}
      </div>

      <div className="hidden sm:block w-24 text-muted-foreground text-xs">
        {formatBytes(file.size)}
      </div>

      <div className="hidden lg:block w-36 text-muted-foreground text-xs">
        {format(new Date(file.dateModified), "dd/MM/yyyy, HH:mm", { locale: ptBR })}
      </div>

      <div className="w-28 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-1 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded"
          title="Histórico de Versões"
          onClick={(e) => {
            e.stopPropagation();
            onOpenVersions?.(file);
          }}
        >
          <History className="h-4 w-4" />
        </button>
        <button 
          className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
          title="Baixar"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-4 w-4" />
        </button>
        <button 
          className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
          title="Excluir"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
