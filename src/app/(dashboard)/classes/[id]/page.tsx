"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Users, Calendar, FileText, CheckSquare, Plus, Search, Loader2, ArrowLeft, BookOpen } from 'lucide-react';
import { api } from '@/lib/api-client';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id as string;
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alunos' | 'notas' | 'frequencia' | 'atividades'>('alunos');
  const [searchStudent, setSearchStudent] = useState('');

  useEffect(() => {
    async function loadClass() {
      setLoading(true);
      try {
        const data = await api.classes.get(classId);
        setClassData(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    if (classId) loadClass();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        Carregando detalhes da turma...
      </div>
    );
  }

  if (!classData || classData.error) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Turma não encontrada</h2>
        <Link href={routes.classes()}>
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Turmas</Button>
        </Link>
      </div>
    );
  }

  const students = classData.classStudents?.map((cs: any) => cs.student) || [];
  const filteredStudents = students.filter((s: any) => {
    const fullName = `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.toLowerCase();
    return fullName.includes(searchStudent.toLowerCase()) || (s.enrollmentNo || '').includes(searchStudent);
  });

  const tabs = [
    { id: 'alunos', label: `Alunos (${students.length})`, icon: Users },
    { id: 'notas', label: 'Notas & Boletim', icon: FileText },
    { id: 'frequencia', label: 'Frequência', icon: Calendar },
    { id: 'atividades', label: `Atividades (${classData.assignments?.length || 0})`, icon: CheckSquare },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href={routes.classes()}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {classData.name}
            </h1>
            <p className="text-muted-foreground text-sm">Ano Letivo {classData.academicYear || '2026'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href={routes.attendance(classId)}>
            <Button variant="outline" className="text-xs gap-1.5 border-blue-200 text-blue-700 dark:text-blue-300">
              <Calendar className="w-3.5 h-3.5" /> Fazer Chamada
            </Button>
          </Link>
          <Link href={routes.grades(classId)}>
            <Button variant="outline" className="text-xs gap-1.5 border-green-200 text-green-700 dark:text-green-300">
              <FileText className="w-3.5 h-3.5" /> Lançar Notas
            </Button>
          </Link>
          <Link href={routes.planning()}>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Nova Aula / Planejamento
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="mt-4">
        {activeTab === 'alunos' && (
          <div className="bg-card text-card-foreground rounded-2xl shadow-xs border overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar aluno por nome ou matrícula..." 
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground border-b text-xs font-semibold uppercase">
                  <tr>
                    <th className="px-6 py-3">Aluno</th>
                    <th className="px-6 py-3">Matrícula</th>
                    <th className="px-6 py-3">Média</th>
                    <th className="px-6 py-3">Frequência</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        Nenhum aluno matriculado nesta turma.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s: any) => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                            {(s.user?.firstName?.[0] || 'A')}
                          </div>
                          <span>{s.user?.firstName} {s.user?.lastName}</span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs font-mono">{s.enrollmentNo || 'N/A'}</td>
                        <td className="px-6 py-4 font-semibold text-emerald-600">8.5</td>
                        <td className="px-6 py-4">94%</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Ativo</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={routes.studentDetail(s.id)} className="text-indigo-600 hover:underline font-semibold text-xs">
                            Ver Perfil
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notas' && (
          <div className="bg-card text-card-foreground rounded-2xl shadow-xs border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Boletim de Notas da Turma</h3>
                <p className="text-xs text-muted-foreground">Médias bimestrais calculadas automaticamente</p>
              </div>
              <Link href={routes.grades(classId)}>
                <Button className="bg-indigo-600 text-white text-xs">Abrir Diário de Notas</Button>
              </Link>
            </div>
            <div className="p-8 border rounded-xl text-center bg-slate-50 dark:bg-slate-900/40">
              <p className="text-sm text-muted-foreground mb-3">Acesse o diário de notas para lançar avaliações, provas e trabalhos desta turma.</p>
              <Link href={routes.grades(classId)}>
                <Button variant="outline" size="sm">Lançar Notas da Turma</Button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'frequencia' && (
          <div className="bg-card text-card-foreground rounded-2xl shadow-xs border p-12 text-center space-y-4">
            <Calendar className="mx-auto h-12 w-12 text-indigo-500 mb-2" />
            <h3 className="text-lg font-bold">Chamada Digital da Turma</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Registre a frequência dos alunos e consulte o histórico de assiduidade.
            </p>
            <Link href={routes.attendance(classId)}>
              <Button className="bg-indigo-600 text-white text-xs">Fazer Chamada de Hoje</Button>
            </Link>
          </div>
        )}

        {activeTab === 'atividades' && (
          <div className="bg-card text-card-foreground rounded-2xl shadow-xs border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">Atividades e Listas da Turma</h3>
              <Link href={routes.activities()}>
                <Button size="sm" className="bg-indigo-600 text-white text-xs">+ Nova Atividade</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {(!classData.assignments || classData.assignments.length === 0) ? (
                <p className="text-xs text-muted-foreground text-center py-6">Nenhuma atividade vinculada a esta turma ainda.</p>
              ) : (
                classData.assignments.map((act: any) => (
                  <div key={act.id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm">{act.title}</h4>
                      <p className="text-xs text-muted-foreground">{act.description || 'Lista de exercícios'}</p>
                    </div>
                    <Link href={routes.activityDetail(act.id)}>
                      <Button variant="outline" size="sm" className="text-xs">Ver Atividade</Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
