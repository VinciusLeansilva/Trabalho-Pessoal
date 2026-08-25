import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, MoreVertical, Edit2, Move, Trash2 } from 'lucide-react';
import { FolderNode } from '@/hooks/use-repository';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FolderTreeProps {
  nodes: FolderNode[];
  currentFolder: FolderNode | null;
  onSelect: (folder: FolderNode) => void;
  level?: number;
}

export function FolderTree({ nodes, currentFolder, onSelect, level = 0 }: FolderTreeProps) {
  return (
    <div className="w-full">
      {nodes.map(node => (
        <FolderTreeItem
          key={node.id}
          node={node}
          currentFolder={currentFolder}
          onSelect={onSelect}
          level={level}
        />
      ))}
    </div>
  );
}

interface FolderTreeItemProps {
  node: FolderNode;
  currentFolder: FolderNode | null;
  onSelect: (folder: FolderNode) => void;
  level: number;
}

function FolderTreeItem({ node, currentFolder, onSelect, level }: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0 || currentFolder?.id === node.id);
  const isActive = currentFolder?.id === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    onSelect(node);
    if (!isExpanded && hasChildren) {
      setIsExpanded(true);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center group px-2 py-1.5 cursor-pointer rounded-md text-sm transition-colors",
          isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleSelect}
      >
        <button
          onClick={handleToggle}
          className="w-5 h-5 flex items-center justify-center mr-1 text-muted-foreground hover:text-foreground"
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>
        <Folder className={cn("h-4 w-4 mr-2", isActive ? "fill-primary/20" : "")} />
        <span className="truncate flex-1">{node.name}</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted-foreground/10 rounded" onClick={e => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <Edit2 className="h-4 w-4 mr-2" /> Renomear
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              <Move className="h-4 w-4 mr-2" /> Mover
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="mt-0.5">
          <FolderTree
            nodes={node.children}
            currentFolder={currentFolder}
            onSelect={onSelect}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
}
