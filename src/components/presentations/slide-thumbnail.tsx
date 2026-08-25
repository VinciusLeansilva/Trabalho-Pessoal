'use client';

import React from 'react';
import { Slide } from '@/data/presentation-seed-data';
import { PresentationSlide } from './presentation-slide';
import { cn } from '@/lib/utils';
import { GripVertical, Copy, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SlideThumbnail({ slide, index, isActive, onClick, onDuplicate, onDelete }: SlideThumbnailProps) {
  return (
    <div 
      className={cn(
        "group relative flex flex-col gap-2 p-2 rounded-lg cursor-pointer border-2 transition-all",
        isActive ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-1">
          <span className="font-mono">{index + 1}</span>
          <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing" />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted" onClick={e => e.stopPropagation()}>
              <MoreVertical className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(slide.id); }}>
              <Copy className="mr-2 h-4 w-4" />
              <span>Duplicar</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="aspect-video w-full rounded-md border shadow-sm overflow-hidden bg-white relative">
        <PresentationSlide slide={slide} size="preview" />
      </div>
      <div className="text-[10px] text-center truncate px-1 text-muted-foreground font-medium">
        {slide.type}
      </div>
    </div>
  );
}
