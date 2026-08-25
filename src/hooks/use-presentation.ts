import { useState, useCallback } from 'react';
import { Slide, Presentation, SAMPLE_PRESENTATIONS } from '@/data/presentation-seed-data';

export function usePresentation(presentationId: string) {
  const initialPresentation = SAMPLE_PRESENTATIONS.find(p => p.id === presentationId) || {
    id: presentationId,
    title: 'Nova Apresentação',
    subject: 'Geral',
    lastModified: new Date().toISOString(),
    tags: [],
    slides: [{ id: 's1', type: 'TITLE', title: 'Novo Slide', background: '#3B82F6' }]
  };

  const [presentation, setPresentation] = useState<Presentation>(initialPresentation);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const addSlide = useCallback((type: Slide['type'] = 'CONTENT') => {
    const newSlide: Slide = { id: `s${Date.now()}`, type, title: 'Novo Slide' };
    setPresentation(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setCurrentSlideIndex(presentation.slides.length);
  }, [presentation.slides.length]);

  const removeSlide = useCallback((id: string) => {
    setPresentation(prev => {
      const newSlides = prev.slides.filter(s => s.id !== id);
      return { ...prev, slides: newSlides.length > 0 ? newSlides : [{ id: `s${Date.now()}`, type: 'TITLE', title: 'Novo Slide' }] };
    });
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  }, []);

  const duplicateSlide = useCallback((id: string) => {
    setPresentation(prev => {
      const slideIndex = prev.slides.findIndex(s => s.id === id);
      if (slideIndex === -1) return prev;
      const slideToDuplicate = prev.slides[slideIndex];
      const newSlide = { ...slideToDuplicate, id: `s${Date.now()}` };
      const newSlides = [...prev.slides];
      newSlides.splice(slideIndex + 1, 0, newSlide);
      return { ...prev, slides: newSlides };
    });
  }, []);

  const moveSlide = useCallback((fromIndex: number, toIndex: number) => {
    setPresentation(prev => {
      const newSlides = [...prev.slides];
      const [movedItem] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedItem);
      return { ...prev, slides: newSlides };
    });
  }, []);

  const updateSlide = useCallback((id: string, updates: Partial<Slide>) => {
    setPresentation(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.min(presentation.slides.length - 1, prev + 1));
  }, [presentation.slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < presentation.slides.length) {
      setCurrentSlideIndex(index);
    }
  }, [presentation.slides.length]);

  const save = useCallback(() => {
    console.log('Saving presentation...', presentation);
    // Real implementation would make an API call
  }, [presentation]);

  const setFullscreen = useCallback((value: boolean) => {
    setIsFullscreen(value);
  }, []);

  return {
    presentation,
    currentSlideIndex,
    currentSlide: presentation.slides[currentSlideIndex],
    addSlide,
    removeSlide,
    duplicateSlide,
    moveSlide,
    updateSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    save,
    isFullscreen,
    setFullscreen
  };
}
