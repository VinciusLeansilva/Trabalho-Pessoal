'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePresentation } from '@/hooks/use-presentation';
import { SlideThumbnail } from '@/components/presentations/slide-thumbnail';
import { SlideEditor } from '@/components/presentations/slide-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Save, Plus, LayoutTemplate, Type, Sigma } from 'lucide-react';

export default function PresentationEditPage() {
  const params = useParams();
  const { 
    presentation, 
    currentSlide, 
    currentSlideIndex, 
    goToSlide, 
    addSlide, 
    removeSlide, 
    duplicateSlide,
    updateSlide,
    save
  } = usePresentation(params.id as string);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      {/* Topbar */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/presentations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold text-sm">{presentation.title}</h1>
            <span className="text-xs text-muted-foreground">Autosalvo há 2 minutos</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={save} className="gap-2">
            <Save className="h-4 w-4" /> Salvar
          </Button>
          <Link href={`/presentations/${presentation.id}/present`}>
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4" /> Apresentar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Slide List */}
        <aside className="w-64 border-r bg-muted/30 flex flex-col shrink-0">
          <div className="p-4 border-b">
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => addSlide('CONTENT')} className="text-xs h-8">
                <Type className="h-3 w-3 mr-1" /> Texto
              </Button>
              <Button size="sm" variant="outline" onClick={() => addSlide('FORMULA')} className="text-xs h-8">
                <Sigma className="h-3 w-3 mr-1" /> Fórm.
              </Button>
              <Button size="sm" variant="outline" onClick={() => addSlide('EXERCISE')} className="text-xs h-8">
                <LayoutTemplate className="h-3 w-3 mr-1" /> Exerc.
              </Button>
              <Button size="sm" variant="outline" onClick={() => addSlide('SUMMARY')} className="text-xs h-8">
                <Plus className="h-3 w-3 mr-1" /> Outro
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {presentation.slides.map((slide, index) => (
              <SlideThumbnail 
                key={slide.id}
                slide={slide}
                index={index}
                isActive={index === currentSlideIndex}
                onClick={() => goToSlide(index)}
                onDuplicate={duplicateSlide}
                onDelete={removeSlide}
              />
            ))}
          </div>
        </aside>

        {/* Center - Editor Canvas & Props */}
        <main className="flex-1 flex flex-col min-w-0">
          <SlideEditor 
            slide={currentSlide} 
            onUpdate={updateSlide} 
          />
        </main>
      </div>
    </div>
  );
}
