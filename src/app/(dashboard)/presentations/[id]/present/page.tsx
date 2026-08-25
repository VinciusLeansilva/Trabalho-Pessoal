'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePresentation } from '@/hooks/use-presentation';
import { PresentationSlide } from '@/components/presentations/presentation-slide';
import { Button } from '@/components/ui/button';
import { 
  X, ChevronLeft, ChevronRight, Moon, Sun, 
  PenTool, Eraser, Maximize, Minimize, Clock, HelpCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PresentPage() {
  const params = useParams();
  const router = useRouter();
  const { presentation, currentSlide, nextSlide, prevSlide, currentSlideIndex } = usePresentation(params.id as string);
  
  const [showControls, setShowControls] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [penColor, setPenColor] = useState('#EF4444'); // Red default
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Presentation Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isDrawMode) setShowControls(false);
      }, 3500);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    handleMouseMove();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isDrawMode]);

  // Keyboard navigation: ArrowLeft, ArrowRight, Space, Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      if (!isDrawMode) nextSlide();
    } else if (e.key === 'ArrowLeft') {
      if (!isDrawMode) prevSlide();
    } else if (e.key === 'Escape') {
      router.push(`/presentations/${presentation.id}/edit`);
    } else if (e.key.toLowerCase() === 'd') {
      setIsDrawMode(prev => !prev);
    }
  }, [nextSlide, prevSlide, router, presentation.id, isDrawMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawing.current = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !isDrawMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Resize canvas to match screen
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, [currentSlideIndex]);

  const toggleTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 overflow-hidden flex items-center justify-center transition-colors duration-300 select-none",
        isDarkMode ? "bg-slate-950" : "bg-white"
      )}
      onClick={() => { if (!isDrawMode) nextSlide(); }}
    >
      {/* Slide View */}
      <div className={cn("w-full h-full max-w-[1920px] max-h-[1080px] aspect-video", isDarkMode && "dark")}>
        <PresentationSlide 
          slide={currentSlide} 
          size="full" 
          className={isDarkMode ? "bg-slate-950 text-slate-100" : ""}
        />
      </div>

      {/* Chalkboard / Canvas Annotation Layer */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 z-10",
          isDrawMode ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"
        )}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      {/* Top Floating Controls */}
      <div 
        className={cn(
          "absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none transition-opacity duration-300 z-20",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Left: Presentation Info & Timer */}
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border shadow-sm pointer-events-auto">
          <span className="font-semibold text-xs truncate max-w-[200px]">
            {presentation.title}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            {formatTimer(elapsedSeconds)}
          </div>
        </div>

        {/* Right: Tools & Exit */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Drawing Tools */}
          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md p-1 rounded-full border shadow-sm">
            <Button 
              variant={isDrawMode ? "default" : "ghost"} 
              size="sm" 
              className={cn("rounded-full h-8 px-3 text-xs gap-1.5", isDrawMode && "bg-indigo-600 text-white")}
              onClick={(e) => { e.stopPropagation(); setIsDrawMode(!isDrawMode); }}
            >
              <PenTool className="h-3.5 w-3.5" />
              Lousa (D)
            </Button>
            {isDrawMode && (
              <>
                <button 
                  className={cn("w-5 h-5 rounded-full border-2", penColor === '#EF4444' && "ring-2 ring-offset-1 ring-slate-400")}
                  style={{ backgroundColor: '#EF4444' }}
                  onClick={(e) => { e.stopPropagation(); setPenColor('#EF4444'); }}
                />
                <button 
                  className={cn("w-5 h-5 rounded-full border-2", penColor === '#3B82F6' && "ring-2 ring-offset-1 ring-slate-400")}
                  style={{ backgroundColor: '#3B82F6' }}
                  onClick={(e) => { e.stopPropagation(); setPenColor('#3B82F6'); }}
                />
                <button 
                  className={cn("w-5 h-5 rounded-full border-2", penColor === '#10B981' && "ring-2 ring-offset-1 ring-slate-400")}
                  style={{ backgroundColor: '#10B981' }}
                  onClick={(e) => { e.stopPropagation(); setPenColor('#10B981'); }}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); clearCanvas(); }}
                  title="Limpar anotações"
                >
                  <Eraser className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 bg-background/80 backdrop-blur-md border shadow-sm"
            onClick={toggleTheme}
            title="Alternar Tema"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 bg-background/80 backdrop-blur-md border shadow-sm hover:bg-destructive hover:text-white"
            onClick={(e) => { e.stopPropagation(); router.push(`/presentations/${presentation.id}/edit`); }}
            title="Sair do Modo Apresentação (Esc)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom Floating Navigation Bar */}
      <div 
        className={cn(
          "absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-md px-6 py-2.5 rounded-full border shadow-lg pointer-events-auto transition-opacity duration-300 z-20",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <span className="font-mono font-medium text-xs text-muted-foreground">
          {currentSlideIndex + 1} / {presentation.slides.length}
        </span>

        {/* Slide Progress bar */}
        <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentSlideIndex + 1) / presentation.slides.length) * 100}%` }}
          />
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
          disabled={currentSlideIndex === presentation.slides.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
