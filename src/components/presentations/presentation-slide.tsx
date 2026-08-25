'use client';

import React from 'react';
import { Slide } from '@/data/presentation-seed-data';
import { cn } from '@/lib/utils';
// Assuming KaTeX is available or using a simple fallback for demo purposes
// import 'katex/dist/katex.min.css';
// import { InlineMath, BlockMath } from 'react-katex';

interface PresentationSlideProps {
  slide: Slide;
  size?: 'preview' | 'full';
  className?: string;
}

export function PresentationSlide({ slide, size = 'full', className }: PresentationSlideProps) {
  const isPreview = size === 'preview';
  
  const containerClasses = cn(
    "w-full h-full flex flex-col items-center justify-center p-8 bg-white text-gray-800 overflow-hidden relative",
    isPreview ? "scale-[0.2] origin-top-left p-4" : "p-12",
    className
  );

  const renderContent = () => {
    switch (slide.type) {
      case 'TITLE':
        return (
          <div className="text-center w-full h-full flex flex-col justify-center items-center text-white" style={{ backgroundColor: slide.background || '#3B82F6' }}>
            <h1 className={cn("font-bold mb-4", isPreview ? "text-6xl" : "text-7xl")}>{slide.title}</h1>
            {slide.subtitle && <h2 className={cn("opacity-90", isPreview ? "text-3xl" : "text-4xl")}>{slide.subtitle}</h2>}
          </div>
        );
      case 'CONTENT':
        return (
          <div className="w-full h-full flex flex-col text-left">
            <h2 className={cn("font-bold mb-6 text-primary border-b-2 pb-4", isPreview ? "text-4xl" : "text-5xl")}>{slide.title}</h2>
            <div className={cn("prose max-w-none flex-grow", isPreview ? "text-2xl leading-relaxed" : "text-3xl leading-relaxed")}>
              {slide.content}
            </div>
          </div>
        );
      case 'FORMULA':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center text-center">
            <h2 className={cn("font-bold mb-12 text-primary", isPreview ? "text-4xl" : "text-5xl")}>{slide.title}</h2>
            <div className={cn("my-8 bg-gray-50 p-12 rounded-xl shadow-inner", isPreview ? "text-5xl" : "text-7xl font-serif")}>
              {/* Fallback for KaTeX rendering */}
              $ {slide.formula} $
            </div>
            {slide.description && <p className={cn("text-gray-500 mt-8", isPreview ? "text-2xl" : "text-3xl")}>{slide.description}</p>}
          </div>
        );
      case 'EXERCISE':
        return (
          <div className="w-full h-full flex flex-col bg-amber-50 p-8 rounded-2xl border-4 border-amber-200">
            <div className="flex items-center gap-4 mb-8 text-amber-700">
              <span className="material-icons-outlined text-5xl">edit_note</span>
              <h2 className={cn("font-bold", isPreview ? "text-4xl" : "text-5xl")}>{slide.title || 'Exercício'}</h2>
            </div>
            <div className={cn("flex-grow font-medium text-gray-800", isPreview ? "text-3xl" : "text-4xl leading-relaxed")}>
              {slide.problem}
            </div>
            {!isPreview && (
              <div className="mt-8 flex justify-end">
                <button className="bg-amber-600 text-white px-8 py-4 rounded-xl text-2xl font-bold shadow-lg hover:bg-amber-700">
                  Resolver
                </button>
              </div>
            )}
          </div>
        );
      case 'RESOLUTION':
        return (
          <div className="w-full h-full flex flex-col bg-emerald-50 p-8 rounded-2xl border-4 border-emerald-200">
             <div className="flex items-center gap-4 mb-8 text-emerald-700">
              <span className="material-icons-outlined text-5xl">check_circle</span>
              <h2 className={cn("font-bold", isPreview ? "text-4xl" : "text-5xl")}>{slide.title || 'Resolução'}</h2>
            </div>
            <div className="flex flex-col gap-6 flex-grow justify-center">
              {slide.steps?.map((step, idx) => (
                <div key={idx} className={cn("bg-white p-6 rounded-xl shadow-sm border border-emerald-100 font-mono text-center", isPreview ? "text-2xl" : "text-4xl")}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        );
      case 'EXAMPLE':
        return (
           <div className="w-full h-full flex flex-col">
            <h2 className={cn("font-bold mb-8 text-primary", isPreview ? "text-4xl" : "text-5xl")}>{slide.title || 'Exemplo'}</h2>
            <div className="bg-blue-50 p-8 rounded-2xl border-l-8 border-blue-500 flex-grow">
              <p className={cn("mb-6", isPreview ? "text-3xl" : "text-4xl")}>{slide.content}</p>
              {slide.matrix && (
                <div className="flex justify-center my-8">
                  <div className="grid gap-4 bg-white p-8 rounded-xl shadow" style={{ gridTemplateColumns: `repeat(${slide.matrix[0]?.length || 1}, minmax(0, 1fr))` }}>
                    {slide.matrix.map((row, i) => row.map((cell, j) => (
                      <div key={`${i}-${j}`} className={cn("flex items-center justify-center font-bold text-gray-700", isPreview ? "text-3xl p-2" : "text-5xl p-4")}>
                        {cell}
                      </div>
                    )))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'SUMMARY':
        return (
          <div className="w-full h-full flex flex-col bg-slate-800 text-white p-8 rounded-2xl">
            <h2 className={cn("font-bold mb-10 text-slate-200 border-b-2 border-slate-600 pb-4", isPreview ? "text-4xl" : "text-6xl")}>{slide.title || 'Resumo'}</h2>
            <ul className={cn("space-y-6 list-disc pl-10", isPreview ? "text-3xl" : "text-4xl")}>
              {slide.points?.map((point, idx) => (
                <li key={idx} className="pl-4">{point}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div>Unsupported slide type</div>;
    }
  };

  if (isPreview) {
    return (
      <div className={cn("w-full h-full relative bg-white overflow-hidden", className)}>
        <div className="absolute inset-0 w-[500%] h-[500%] origin-top-left scale-[0.2]">
           {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} style={slide.type === 'TITLE' ? { padding: 0 } : {}}>
      {renderContent()}
    </div>
  );
}
