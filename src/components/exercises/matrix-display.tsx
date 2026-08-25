"use client";

import { cn } from "@/lib/utils";

export type HighlightType = 'selected' | 'operation' | 'result' | 'pivot' | 'eliminated';

export interface MatrixHighlight {
  row: number;
  col: number;
  type: HighlightType;
}

interface MatrixDisplayProps {
  matrix: number[][];
  highlighted?: MatrixHighlight[];
  className?: string;
}

export function MatrixDisplay({ matrix, highlighted = [], className }: MatrixDisplayProps) {
  if (!matrix || matrix.length === 0) return null;

  const cols = matrix[0].length;

  const getHighlightClass = (r: number, c: number) => {
    const highlight = highlighted.find(h => h.row === r && h.col === c);
    if (!highlight) return "";

    switch (highlight.type) {
      case 'selected': return "bg-blue-200 dark:bg-blue-800";
      case 'operation': return "bg-amber-200 dark:bg-amber-800";
      case 'result': return "bg-green-200 dark:bg-green-800";
      case 'pivot': return "bg-purple-200 dark:bg-purple-800";
      case 'eliminated': return "bg-red-200 dark:bg-red-800 opacity-50";
      default: return "";
    }
  };

  return (
    <div className={cn("flex justify-center items-center py-4", className)}>
      <div className="relative inline-flex items-center px-4">
        {/* Left Bracket */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between w-3 text-4xl font-light text-foreground select-none">
          <div className="h-1/3 flex items-start leading-none -mt-1">⎡</div>
          <div className="h-1/3 flex items-center justify-center leading-none">⎢</div>
          <div className="h-1/3 flex items-end leading-none -mb-1">⎣</div>
        </div>
        
        <div 
          className="grid gap-x-6 gap-y-3 px-2" 
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {matrix.map((row, r) => 
            row.map((val, c) => (
              <div 
                key={`${r}-${c}`} 
                className={cn(
                  "min-w-[2.5rem] h-10 flex items-center justify-center text-lg rounded transition-colors duration-300",
                  getHighlightClass(r, c)
                )}
              >
                {Number.isInteger(val) ? val : Number(val).toFixed(2).replace(/\.00$/, '')}
              </div>
            ))
          )}
        </div>

        {/* Right Bracket */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between w-3 text-4xl font-light text-foreground select-none">
          <div className="h-1/3 flex items-start leading-none -mt-1">⎤</div>
          <div className="h-1/3 flex items-center justify-center leading-none">⎥</div>
          <div className="h-1/3 flex items-end leading-none -mb-1">⎦</div>
        </div>
      </div>
    </div>
  );
}
