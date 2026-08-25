"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixDisplay, MatrixHighlight } from "./matrix-display";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export interface StepData {
  title: string;
  description: string;
  formula?: string;
  matrix?: number[][];
  highlights?: MatrixHighlight[];
  calculation?: string;
}

interface StepCardProps {
  step: StepData;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
}

export function StepCard({ step, index, isActive, isCompleted }: StepCardProps) {
  if (!step) return null;
  if (!isActive && !isCompleted) return null;

  return (
    <Card className={cn(
      "transition-all duration-300 shadow-sm",
      isActive ? "border-indigo-600 ring-1 ring-indigo-500 shadow-md bg-card" : "opacity-75"
    )}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex-1 flex items-center space-x-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs",
            isActive ? "bg-indigo-600" : "bg-emerald-600"
          )}>
            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : (index + 1)}
          </div>
          <CardTitle className="text-base font-semibold">{step.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step.description}</p>
        
        {step.formula && (
          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-lg text-center font-mono text-base border border-slate-200 dark:border-slate-700">
            {step.formula}
          </div>
        )}

        {step.matrix && step.matrix.length > 0 && (
          <div className="py-2 overflow-x-auto flex justify-center">
            <MatrixDisplay matrix={step.matrix} highlighted={step.highlights} />
          </div>
        )}

        {step.calculation && (
          <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap border border-slate-800 shadow-inner">
            {step.calculation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
