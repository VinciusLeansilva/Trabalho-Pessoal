"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader2, Users, GraduationCap, ArrowRight, X } from 'lucide-react';
import { api } from '@/lib/api-client';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Student Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [targetClassId, setTargetClassId] = useState('');
  const [savingStudent, setSavingStudent] = useState(false);

  const fetchStudentsAndClasses = async () => {
    setLoading(true);
    try {
      const [studentsData, classesData] = await Promise.all([
        api.students.list(selectedClassId !== 'ALL' ? selectedClassId : undefined),
        api.classes.list()
      ]);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsAndClasses();
  }, [selectedClassId]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    setSavingStudent(true);
    try {
      await api.students.create({
        firstName,
        lastName,
        email,
        enrollmentNo: enrollmentNo || `ALU${Date.now().toString().slice(-4)}`,
        classId: targetClassId || undefined
      });
      toast.success(`Aluno ${firstName} ${lastName} cadastrado com sucesso!`);
      setIsCreateOpen(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setEnrollmentNo('');
      fetchStudentsAndClasses();
    } catch {
      toast.error('Erro ao cadastrar aluno.');
    } finally {
      setSavingStudent(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const name = `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.toLowerCase();
    const mat = (s.enrollmentNo || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || mat.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Alunos</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestão de matrículas, diário de bordo e desempenho escolar.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus size={18} /> Novo Aluno
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card text-card-foreground p-4 rounded-2xl shadow-xs border flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar aluno por nome ou matrícula..." 
            className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
          />
        </div>
        <select 
          value={selectedClassId} 
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-56 text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">Todas as Turmas</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-card text-card-foreground rounded-2xl shadow-xs border overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Carregando alunos...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <Users className="w-10 h-10 mx-auto text-muted" />
            <h3 className="font-semibold text-base">Nenhum aluno encontrado</h3>
            <p className="text-xs">Cadastre um novo aluno ou selecione outra turma.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-muted-foreground border-b text-xs font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">Aluno</th>
                  <th className="px-6 py-4">Matrícula</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Média Geral</th>
                  <th className="px-6 py-4">Frequência</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {(s.user?.firstName?.[0] || 'A')}
                      </div>
                      <span className="font-semibold">{s.user?.firstName} {s.user?.lastName}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs font-mono">{s.enrollmentNo || 'N/A'}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{s.user?.email}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">8.5</td>
                    <td className="px-6 py-4">94%</td>
                    <td className="px-6 py-4">
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Ativo</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={routes.studentDetail(s.id)} className="text-indigo-600 hover:underline font-semibold text-xs inline-flex items-center gap-1">
                        Ver Perfil <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Student Dialog Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-md border">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-base font-bold">Cadastrar Novo Aluno</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStudent} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Nome</label>
                  <input 
                    required 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="João" 
                    className="w-full border rounded-lg p-2 text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Sobrenome</label>
                  <input 
                    required 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Silva" 
                    className="w-full border rounded-lg p-2 text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">E-mail</label>
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="joao.silva@escola.edu.br" 
                  className="w-full border rounded-lg p-2 text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Matrícula</label>
                  <input 
                    type="text" 
                    value={enrollmentNo} 
                    onChange={(e) => setEnrollmentNo(e.target.value)} 
                    placeholder="2026001" 
                    className="w-full border rounded-lg p-2 text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Vincular Turma</label>
                  <select 
                    value={targetClassId} 
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sem turma</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t mt-4">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={savingStudent} className="bg-indigo-600 text-white">
                  {savingStudent ? 'Salvando...' : 'Salvar Aluno'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
