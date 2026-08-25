"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  PenLine,
  GraduationCap,
  Video
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function SearchModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Digite para pesquisar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Exercícios">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/exercises/1"))}>
            <PenLine className="mr-2 h-4 w-4" />
            <span>Lista de Cálculo I</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Fórmulas">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/formulas/bhaskara"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Fórmula de Bhaskara</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Aulas">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/lessons/12"))}>
            <Video className="mr-2 h-4 w-4" />
            <span>Introdução à Física Quântica</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Alunos">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/students/42"))}>
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>João Silva</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
