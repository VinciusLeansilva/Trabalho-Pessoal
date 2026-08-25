"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Save, CheckCircle2, UserCheck, Loader2, BookOpen } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-25');
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F' | 'J'>>({});
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load Classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const classList = await api.classes.list();
        if (Array.isArray(classList) && classList.length > 0) {
          setClasses(classList);
          setSelectedClassId(classList[0].id);
        }
      } catch {
        // ignore
      }
    }
    loadClasses();
  }, []);

  // Load Students for Selected Class
  useEffect(() => {
    if (!selectedClassId) return;

    async function loadClassStudents() {
      setLoading(true);
      try {
        const studentsData = await api.students.list(selectedClassId);
        const list = Array.isArray(studentsData) ? studentsData : [];
        setStudents(list);

        // Initialize all present by default
        const initialAttendance: Record<string, 'P' | 'F' | 'J'> = {};
        list.forEach(s => {
          initialAttendance[s.id] = 'P';
        });
        setAttendance(initialAttendance);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadClassStudents();
  }, [selectedClassId, selectedDate]);

  const handleToggle = (id: string, status: 'P' | 'F' | 'J') => {
    setIsSaved(false);
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    setIsSaved(false);
    const newAtt: Record<string, 'P' | 'F' | 'J'> = {};
    students.forEach(s => {
      newAtt[s.id] = 'P';
    });
    setAttendance(newAtt);
    toast.info("Todos os alunos marcados como presentes.");
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status: status === 'P' ? 'PRESENT' : status === 'F' ? 'ABSENT' : 'JUSTIFIED'
      }));

      // Create a lesson instance or attach to class
      await api.attendance.save({
        lessonId: selectedClassId, // associated class container
        records
      });

      setIsSaved(true);
      toast.success("Chamada diária salva no sistema com sucesso!");
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      toast.error("Erro ao salvar chamada.");
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter(s => s === 'P').length;
  const absentCount = Object.values(attendance).filter(s => s === 'F').length;
  const justifiedCount = Object.values(attendance).filter(s => s === 'J').length;
  const attendancePercentage = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Chamada Digital</h1>
          <p className="text-muted-foreground text-sm mt-1">Registro diário de presença dos estudantes por turma.</p>
        </div>
        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Chamada salva!
            </span>
          )}
          <Button 
            variant="outline"
            onClick={handleMarkAllPresent}
            className="text-xs gap-1.5"
          >
            <UserCheck size={16} className="text-emerald-600" /> Todos Presentes
          </Button>
          <Button 
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-xs disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Salvando...' : 'Salvar Chamada'}
          </Button>
        </div>
      </div>

      {/* Selectors & KPI Bar */}
      <div className="bg-card text-card-foreground p-5 rounded-2xl shadow-xs border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Turma</label>
          <select 
            value={selectedClassId} 
            onChange={e => setSelectedClassId(e.target.value)}
            className="border py-2 px-3 rounded-xl w-full text-sm bg-background focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">Data da Aula</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border py-2 px-3 rounded-xl w-full text-sm bg-background focus:ring-2 focus:ring-indigo-500 outline-none" 
          />
        </div>

        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-center">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Taxa de Presença</p>
          <p className="text-2xl font-bold text-emerald-600">{attendancePercentage}%</p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900 border rounded-xl text-center flex items-center justify-around">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold">PRESENÇAS</p>
            <p className="text-lg font-bold text-emerald-600">{presentCount}</p>
          </div>
          <div className="border-x px-2">
            <p className="text-[10px] text-muted-foreground font-semibold">FALTAS</p>
            <p className="text-lg font-bold text-rose-600">{absentCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold">JUSTIF.</p>
            <p className="text-lg font-bold text-amber-600">{justifiedCount}</p>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-card text-card-foreground rounded-2xl shadow-xs border overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Carregando lista da turma...
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-muted" />
            <h3 className="font-semibold text-base">Nenhum aluno matriculado nesta turma</h3>
          </div>
        ) : (
          <div className="divide-y">
            {students.map((student) => {
              const status = attendance[student.id] || 'P';
              return (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {(student.user?.firstName?.[0] || 'A')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{student.user?.firstName} {student.user?.lastName}</p>
                      <p className="text-xs text-muted-foreground font-mono">Matrícula: {student.enrollmentNo || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggle(student.id, 'P')}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        status === 'P'
                          ? 'bg-emerald-600 text-white shadow-xs scale-105'
                          : 'bg-muted text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      title="Presente"
                    >
                      P
                    </button>
                    <button
                      onClick={() => handleToggle(student.id, 'F')}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        status === 'F'
                          ? 'bg-rose-600 text-white shadow-xs scale-105'
                          : 'bg-muted text-muted-foreground hover:bg-rose-50 hover:text-rose-700'
                      }`}
                      title="Falta"
                    >
                      F
                    </button>
                    <button
                      onClick={() => handleToggle(student.id, 'J')}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        status === 'J'
                          ? 'bg-amber-500 text-white shadow-xs scale-105'
                          : 'bg-muted text-muted-foreground hover:bg-amber-50 hover:text-amber-700'
                      }`}
                      title="Falta Justificada"
                    >
                      J
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
