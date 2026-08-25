"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { StepData } from "./step-card";
import { MatrixDisplay } from "./matrix-display";
import { cn } from "@/lib/utils";

interface BlackboardModeProps {
  steps: StepData[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export function BlackboardMode({ steps, currentStep, onNext, onPrev, onExit }: BlackboardModeProps) {
  const [isDark, setIsDark] = useState(true);
  const step = steps[currentStep];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      if (e.key === "ArrowRight" && currentStep < steps.length - 1) onNext();
      if (e.key === "ArrowLeft" && currentStep > 0) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, steps.length, onNext, onPrev, onExit]);

  if (!step) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col transition-colors duration-300",
      isDark ? "bg-[#1e1e1e] text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-medium opacity-75">Quadro Digital</span>
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-bold">
            Passo {currentStep + 1} de {steps.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onExit}>
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">{step.title}</h2>
            <p className="text-xl opacity-80 max-w-2xl mx-auto">{step.description}</p>
          </div>

          {step.formula && (
            <div className={cn(
              "p-6 rounded-xl text-center font-serif text-3xl",
              isDark ? "bg-white/5" : "bg-black/5"
            )}>
              {step.formula}
            </div>
          )}

          {step.matrix && step.matrix.length > 0 && (
            <div className="scale-150 transform-gpu origin-top flex justify-center py-12">
              <MatrixDisplay matrix={step.matrix} highlighted={step.highlights} />
            </div>
          )}

          {step.calculation && (
            <div className={cn(
              "p-6 rounded-xl font-mono text-xl whitespace-pre overflow-x-auto",
              isDark ? "bg-black/40 text-green-400" : "bg-black/5 text-slate-800"
            )}>
              {step.calculation}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 flex justify-between items-center border-t border-white/10">
        <Button 
          size="lg" 
          variant={isDark ? "outline" : "default"}
          className={cn("text-lg px-8", isDark && "border-white/20 hover:bg-white/10")}
          onClick={onPrev} 
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 w-6 h-6" /> Anterior
        </Button>
        
        <div className="flex space-x-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                currentStep === i ? "bg-primary scale-125" : 
                currentStep > i ? "bg-primary/50" : 
                isDark ? "bg-white/20" : "bg-black/10"
              )} 
            />
          ))}
        </div>

        <Button 
          size="lg" 
          variant={isDark ? "outline" : "default"}
          className={cn("text-lg px-8", isDark && "border-white/20 hover:bg-white/10")}
          onClick={onNext} 
          disabled={currentStep === steps.length - 1}
        >
          Próximo <ChevronRight className="ml-2 w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
