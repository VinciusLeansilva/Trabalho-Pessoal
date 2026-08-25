"use client";

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, Percent, MoreVertical, Loader2 } from 'lucide-react';
import { CreateClassDialog } from '@/components/classes/create-class-dialog';
import { api } from '@/lib/api-client';
import { routes } from '@/lib/routes';
import Link from 'next/link';

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const [classList, statsData] = await Promise.all([
        api.classes.list(),
        api.dashboard.stats()
      ]);
      setClasses(Array.isArray(classList) ? classList : []);
      setStats(statsData);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Minhas Turmas</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerenciamento centralizado de turmas, alunos, diários e notas.</p>
        </div>
        <CreateClassDialog onClassCreated={fetchClasses} />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card text-card-foreground p-4 rounded-xl shadow-xs border flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl"><BookOpen size={24} /></div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Turmas</p>
            <p className="text-2xl font-bold">{stats?.totalClasses || classes.length || 0}</p>
          </div>
        </div>
        <div className="bg-card text-card-foreground p-4 rounded-xl shadow-xs border flex items-center space-x-4">
          <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Total Alunos</p>
            <p className="text-2xl font-bold">{stats?.totalStudents || 0}</p>
          </div>
        </div>
        <div className="bg-card text-card-foreground p-4 rounded-xl shadow-xs border flex items-center space-x-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl"><GraduationCap size={24} /></div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Média Geral</p>
            <p className="text-2xl font-bold">{stats?.averageGrade || 8.5}</p>
          </div>
        </div>
        <div className="bg-card text-card-foreground p-4 rounded-xl shadow-xs border flex items-center space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl"><Percent size={24} /></div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Taxa Presença</p>
            <p className="text-2xl font-bold">{stats?.attendanceRate ? `${stats.attendanceRate}%` : '92.4%'}</p>
          </div>
        </div>
      </div>

      {/* Class List Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando turmas...
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl space-y-3">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-lg">Nenhuma turma cadastrada</h3>
          <p className="text-sm text-muted-foreground">Clique em <strong>+ Nova Turma</strong> para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(cls => {
            const studentCount = cls._count?.classStudents || cls.classStudents?.length || 0;
            const lessonCount = cls._count?.lessons || cls.lessons?.length || 0;

            return (
              <div key={cls.id} className="bg-card text-card-foreground rounded-2xl shadow-xs border p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold truncate">{cls.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Ano Letivo: {cls.academicYear || '2026'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 py-3 border-y text-center">
                    <div>
                      <p className="text-xl font-bold">{studentCount}</p>
                      <p className="text-[11px] text-muted-foreground">Alunos</p>
                    </div>
                    <div className="border-x">
                      <p className="text-xl font-bold text-indigo-600">{lessonCount}</p>
                      <p className="text-[11px] text-muted-foreground">Aulas</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-600">8.4</p>
                      <p className="text-[11px] text-muted-foreground">Média</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Link href={routes.classDetail(cls.id)} className="flex-1 bg-muted hover:bg-muted/80 text-center py-2 rounded-lg text-xs font-semibold transition-colors">
                    Ver Turma
                  </Link>
                  <Link href={routes.attendance(cls.id)} className="flex-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-center py-2 rounded-lg text-xs font-semibold transition-colors">
                    Chamada
                  </Link>
                  <Link href={routes.grades(cls.id)} className="flex-1 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 hover:bg-green-100 text-center py-2 rounded-lg text-xs font-semibold transition-colors">
                    Notas
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
