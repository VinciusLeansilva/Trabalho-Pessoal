"use client";

import { Button } from "@/components/ui/button";

interface MatrixInputProps {
  name: string;
  size: number;
  value: number[][];
  onChange: (val: number[][]) => void;
}

export function MatrixInput({ name, size, value, onChange }: MatrixInputProps) {
  const handleChange = (r: number, c: number, v: string) => {
    const num = parseFloat(v);
    const newValue = [...value];
    newValue[r] = [...newValue[r]];
    newValue[r][c] = isNaN(num) ? 0 : num;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    let nextR = r;
    let nextC = c;

    switch (e.key) {
      case "ArrowUp":
        nextR = Math.max(0, r - 1);
        break;
      case "ArrowDown":
        nextR = Math.min(size - 1, r + 1);
        break;
      case "ArrowLeft":
        nextC = Math.max(0, c - 1);
        break;
      case "ArrowRight":
        nextC = Math.min(size - 1, c + 1);
        break;
      default:
        return;
    }

    if (nextR !== r || nextC !== c) {
      e.preventDefault();
      const nextInput = document.getElementById(`matrix-${name}-cell-${nextR}-${nextC}`);
      nextInput?.focus();
    }
  };

  const handleClear = () => {
    onChange(Array(size).fill(0).map(() => Array(size).fill(0)));
  };

  const handleExample = () => {
    const example = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => Math.floor(Math.random() * 10) - 5)
    );
    onChange(example);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Matriz {name} =</span>
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={handleClear}>Limpar</Button>
          <Button variant="secondary" size="sm" onClick={handleExample}>Exemplo</Button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="relative p-2 inline-block">
          <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 border-foreground" />
          <div className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 border-foreground" />
          
          <div 
            className="grid gap-2" 
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {value.map((row, r) => 
              row.map((cell, c) => (
                <input
                  key={`${r}-${c}`}
                  id={`matrix-${name}-cell-${r}-${c}`}
                  type="number"
                  value={cell.toString()}
                  onChange={(e) => handleChange(r, c, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, r, c)}
                  className="w-12 h-12 text-center text-sm rounded border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  step="any"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
