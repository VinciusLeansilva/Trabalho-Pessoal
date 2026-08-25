'use client';

import React from 'react';
import { Slide } from '@/data/presentation-seed-data';
import { PresentationSlide } from './presentation-slide';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (id: string, updates: Partial<Slide>) => void;
}

export function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const handleChange = <K extends keyof Slide>(field: K, value: Slide[K]) => {
    onUpdate(slide.id, { [field]: value });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Visual Editor (Preview) */}
      <div className="flex-1 bg-muted p-8 flex items-center justify-center overflow-auto">
        <div className="w-[960px] h-[540px] shadow-2xl rounded-lg overflow-hidden shrink-0">
          <PresentationSlide slide={slide} size="full" />
        </div>
      </div>

      {/* Editor Controls */}
      <div className="h-64 border-t bg-background p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">{slide.type}</span>
          Editar Conteúdo
        </h3>
        
        <div className="grid gap-4 max-w-3xl">
          <div className="grid gap-2">
            <Label>Título</Label>
            <Input 
              value={slide.title || ''} 
              onChange={e => handleChange('title', e.target.value)} 
              placeholder="Título do slide"
            />
          </div>

          {slide.type === 'TITLE' && (
            <>
              <div className="grid gap-2">
                <Label>Subtítulo</Label>
                <Input 
                  value={slide.subtitle || ''} 
                  onChange={e => handleChange('subtitle', e.target.value)} 
                />
              </div>
              <div className="grid gap-2">
                <Label>Cor de Fundo</Label>
                <div className="flex gap-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#1E293B'].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 ${slide.background === color ? 'border-foreground shadow-md' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleChange('background', color)}
                    />
                  ))}
                  <Input 
                    type="color" 
                    value={slide.background || '#3B82F6'} 
                    onChange={e => handleChange('background', e.target.value)}
                    className="w-8 h-8 p-0 border-0"
                  />
                </div>
              </div>
            </>
          )}

          {(slide.type === 'CONTENT' || slide.type === 'EXAMPLE') && (
            <div className="grid gap-2">
              <Label>Conteúdo de Texto</Label>
              <Textarea 
                value={slide.content || ''} 
                onChange={e => handleChange('content', e.target.value)} 
                rows={5}
              />
            </div>
          )}

          {slide.type === 'FORMULA' && (
            <>
              <div className="grid gap-2">
                <Label>Fórmula (LaTeX/KaTeX)</Label>
                <Input 
                  value={slide.formula || ''} 
                  onChange={e => handleChange('formula', e.target.value)} 
                  className="font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição / Legenda</Label>
                <Input 
                  value={slide.description || ''} 
                  onChange={e => handleChange('description', e.target.value)} 
                />
              </div>
            </>
          )}
          
          {slide.type === 'EXERCISE' && (
            <div className="grid gap-2">
              <Label>Problema</Label>
              <Textarea 
                value={slide.problem || ''} 
                onChange={e => handleChange('problem', e.target.value)} 
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
