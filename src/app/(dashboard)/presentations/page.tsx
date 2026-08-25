"use client";

import React from 'react';
import Link from 'next/link';
import { SAMPLE_PRESENTATIONS } from '@/data/presentation-seed-data';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreVertical, Edit2, Play, Copy, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PresentationsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Apresentações</h1>
          <p className="text-muted-foreground mt-1">Gerencie e crie materiais didáticos interativos.</p>
        </div>
        <Link href="/presentations/1/edit">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" /> Nova Apresentação
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar apresentações..." 
            className="w-full pl-9 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {SAMPLE_PRESENTATIONS.map(presentation => (
          <div key={presentation.id} className="border rounded-xl bg-card overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <div 
              className="h-32 p-4 relative flex items-end justify-start"
              style={{ backgroundColor: presentation.slides[0]?.background || '#3B82F6' }}
            >
              <div className="absolute top-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {presentation.slides.length} slides
              </div>
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">
                {presentation.title}
              </h3>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {presentation.subject}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(presentation.lastModified).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex gap-1 flex-wrap mt-auto pt-4 mb-4">
                {presentation.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t pt-4">
                <Link href={`/presentations/${presentation.id}/edit`} className="flex-1">
                  <Button variant="secondary" className="w-full gap-2 h-8 text-xs">
                    <Edit2 className="h-3 w-3" /> Editar
                  </Button>
                </Link>
                <Link href={`/presentations/${presentation.id}/present`}>
                  <Button className="h-8 px-3 gap-1 bg-green-600 hover:bg-green-700 text-xs">
                    <Play className="h-3 w-3" />
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 p-2 hover:bg-muted-foreground/10 rounded-full transition-colors" onClick={e => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" /> Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
