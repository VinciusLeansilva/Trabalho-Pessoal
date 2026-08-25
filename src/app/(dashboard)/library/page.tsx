"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SubjectCard } from '@/components/library/subject-card';
import { SUBJECTS } from '@/data/library-seed-data';

export default function LibraryPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca Educacional</h1>
          <p className="text-muted-foreground">Explore conteúdos, fórmulas e exercícios para suas aulas.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Buscar conteúdo, fórmulas, exercícios..." 
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Conteúdos em Destaque</h2>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 text-lg">Novo Currículo de Matemática</h3>
            <p className="text-blue-700">Atualizado com os novos parâmetros do MEC para o Ensino Médio.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Disciplinas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SUBJECTS.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
}
