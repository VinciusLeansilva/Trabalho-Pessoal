"use client";
import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

interface CreateClassDialogProps {
  onClassCreated?: () => void;
}

export function CreateClassDialog({ onClassCreated }: CreateClassDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('2026');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await api.classes.create({
        name,
        academicYear,
      });
      toast.success(`Turma "${name}" criada com sucesso!`);
      setName('');
      setIsOpen(false);
      onClassCreated?.();
    } catch {
      toast.error('Erro ao criar turma no servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-xs transition-colors"
      >
        <Plus size={18} /> Nova Turma
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-md border">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-lg font-bold">Criar Nova Turma</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted-foreground hover:text-foreground rounded-full hover:bg-muted p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Nome da Turma</label>
                <input 
                  required 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: 2º Ano A - Matemática" 
                  className="w-full border rounded-lg p-2.5 bg-background text-foreground text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Ano Letivo</label>
                <input 
                  required 
                  type="text" 
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-background text-foreground text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
