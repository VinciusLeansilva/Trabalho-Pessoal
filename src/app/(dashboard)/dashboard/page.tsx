"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  GraduationCap, 
  ClipboardList, 
  TrendingUp,
  Video,
  PenTool,
  HelpCircle,
  FilePlus,
  Presentation,
  FolderOpen,
  Play,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  Calendar,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { StatsCard } from "@/components/dashboard/stats-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { RecentActivity, ActivityItem } from "@/components/dashboard/recent-activity";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api-client";
import { routes } from "@/lib/routes";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const greetingText = `${getGreeting()}, Professor Carlos Santos!`;

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, classList] = await Promise.all([
          api.dashboard.stats(),
          api.classes.list()
        ]);
        setStats(statsData);
        setClasses(Array.isArray(classList) ? classList : []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const recentActivities: ActivityItem[] = [
    { id: "1", type: "grade_submitted", message: "Notas lançadas para o 2º Ano A (Matrizes)", timeAgo: "Há 15 min" },
    { id: "2", type: "file_upload", message: "Arquivo enviado: Prova_Bimestral_Matrizes.docx (v3.0 FINAL)", timeAgo: "Há 1 hora" },
    { id: "3", type: "activity_created", message: "Nova atividade criada: Lista de Determinantes 3x3", timeAgo: "Hoje, 09:30" },
    { id: "4", type: "lesson_completed", message: "Aula concluída: Matrizes - Operações Fundamentais", timeAgo: "Hoje, 08:00" },
  ];

  return (
    <div className="flex-1 space-y-8 p-6 md:p-8 pt-6 max-w-7xl mx-auto">
      {/* 1. Header / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🎓</span> {greetingText}
          </h1>
          <p className="text-muted-foreground capitalize text-sm mt-1">
            {formattedDate} • Ano Letivo 2026
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-1.5 shadow-xs">
          <span className="text-amber-500 text-base">☀️</span>
          <span className="text-xs font-semibold text-foreground">3º Bimestre Letivo em Andamento</span>
        </div>
      </div>

      {/* 2. Live Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Minhas Turmas" 
          value={loading ? "..." : String(stats?.totalClasses || classes.length || 4)} 
          subtitle="Turmas ativas no ERP" 
          icon={Users} 
          color="blue" 
        />
        <StatsCard 
          title="Total de Alunos" 
          value={loading ? "..." : String(stats?.totalStudents || 115)} 
          subtitle="Estudantes matriculados" 
          icon={GraduationCap} 
          color="green" 
        />
        <StatsCard 
          title="Atividades & Provas" 
          value={loading ? "..." : String(stats?.pendingActivities || 6)} 
          subtitle="Listas programadas" 
          icon={ClipboardList} 
          color="amber" 
        />
        <StatsCard 
          title="Média Geral" 
          value={loading ? "..." : String(stats?.averageGrade || 8.5)} 
          subtitle="Todas as turmas" 
          icon={TrendingUp} 
          color="purple" 
          trend={{ value: 0.4, label: "vs 2º Bimestre", positive: true }}
        />
      </div>

      {/* 3. Quick Actions Row */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <QuickActionCard title="Nova Aula" description="8 blocos didáticos" icon={Video} href={routes.planning()} color="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400" />
        <QuickActionCard title="Banco Questões" description="Exercícios KaTeX" icon={PenTool} href={routes.questionBank()} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" />
        <QuickActionCard title="Resolvedor" description="Passo a passo" icon={HelpCircle} href={routes.solver()} color="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400" />
        <QuickActionCard title="Nova Atividade" description="Listas e provas" icon={FilePlus} href={routes.activities()} color="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400" />
        <QuickActionCard title="Apresentação" description="Modo projetor" icon={Presentation} href={routes.presentations()} color="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400" />
        <QuickActionCard title="Repositório" description="Drive & Versões" icon={FolderOpen} href={routes.repository()} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" />
      </div>

      {/* 4. "Continuar de onde parei" section */}
      <Card className="shadow-xs border rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Continuar de onde parei
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border justify-between">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Última Aula</span>
                <p className="font-semibold text-sm line-clamp-1 mt-0.5">Matrizes: Operações Fundamentais</p>
                <p className="text-xs text-muted-foreground mb-3">Matemática • 2º Ano A</p>
              </div>
              <Link href={routes.planning()}>
                <Button size="sm" variant="secondary" className="w-full gap-1.5 text-xs">
                  <Play className="w-3 h-3" /> Abrir no Planejamento
                </Button>
              </Link>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border justify-between">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Último Exercício Resolvido</span>
                <p className="font-semibold text-sm line-clamp-1 mt-0.5">Determinante 3x3 (Regra de Sarrus)</p>
                <p className="text-xs text-muted-foreground mb-3">Passo a passo com lousa digital</p>
              </div>
              <Link href={routes.solver('determinant')}>
                <Button size="sm" variant="secondary" className="w-full gap-1.5 text-xs">
                  <PenTool className="w-3 h-3" /> Abrir Resolvedor
                </Button>
              </Link>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border justify-between">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Último Arquivo no Repositório</span>
                <p className="font-semibold text-sm line-clamp-1 mt-0.5">Prova_Bimestral_Matrizes.docx</p>
                <p className="text-xs text-muted-foreground mb-3">Versão FINAL • Prof. Carlos</p>
              </div>
              <Link href={routes.repository()}>
                <Button size="sm" variant="secondary" className="w-full gap-1.5 text-xs">
                  <FileText className="w-3 h-3" /> Ver no Drive
                </Button>
              </Link>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border justify-between">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Última Apresentação</span>
                <p className="font-semibold text-sm line-clamp-1 mt-0.5">Aula de Matrizes e Determinantes</p>
                <p className="text-xs text-muted-foreground mb-3">7 slides prontos para projetor</p>
              </div>
              <Link href={routes.presentationPresent('1')}>
                <Button size="sm" variant="secondary" className="w-full gap-1.5 text-xs">
                  <Presentation className="w-3 h-3" /> Modo Projetor
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-4">
          {/* Próximas Aulas */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold">Agenda de Aulas (Hoje)</CardTitle>
              <Link href={routes.calendar()}>
                <Button variant="ghost" size="sm" className="text-xs">
                  Ver Calendário
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                {[
                  { time: "08:00 - 09:40", subject: "Matemática", class: "2º Ano A", topic: "Matrizes: Multiplicação", color: "bg-blue-500" },
                  { time: "10:00 - 11:40", subject: "Matemática", class: "1º Ano A", topic: "Função Afim e Gráficos", color: "bg-emerald-500" },
                  { time: "13:30 - 15:10", subject: "Física", class: "3º Ano A", topic: "Leis de Newton e Dinâmica", color: "bg-purple-500" },
                ].map((aula, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-10 rounded-full ${aula.color}`} />
                      <div>
                        <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{aula.time}</p>
                        <p className="text-sm font-semibold">{aula.subject} • {aula.class}</p>
                        <p className="text-xs text-muted-foreground">{aula.topic}</p>
                      </div>
                    </div>
                    <Link href={routes.presentationPresent('1')}>
                      <Button size="sm" className="bg-indigo-600 text-white text-xs gap-1">
                        <Play className="w-3 h-3" /> Iniciar Aula
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Atividades Pendentes */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold">Atividades e Correções</CardTitle>
              <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 text-xs">
                3 listas ativas
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {[
                  { title: "Correção: Prova Bimestral de Matrizes", class: "2º Ano A", progress: 85, due: "Amanhã" },
                  { title: "Lançar Notas: Trabalho de Funções", class: "1º Ano A", progress: 40, due: "Hoje" },
                  { title: "Lista de Física (Dinâmica)", class: "3º Ano A", progress: 95, due: "Em 2 dias" },
                ].map((task, i) => (
                  <div key={i} className="space-y-1.5 p-3 rounded-xl border bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-muted-foreground">{task.class} • Prazo: {task.due}</p>
                      </div>
                      <span className="font-bold text-indigo-600">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                ))}
                <Link href={routes.activities()}>
                  <Button variant="link" className="w-full text-xs text-indigo-600">
                    Ver todas as atividades e provas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-3">
          {/* Turmas Cadastradas */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold">Turmas do Professor</CardTitle>
              <Link href={routes.classes()} className="text-xs text-indigo-600 hover:underline">
                Ver Todas
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-t">
                {classes.slice(0, 4).map((t, i) => (
                  <div key={t.id || i} className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">Ano Letivo {t.academicYear || '2026'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={routes.classDetail(t.id)}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Ver Turma
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Frequência & Chamada Rápida */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Chamada Digital (Hoje)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold">2º Ano A - Matemática</span>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-[10px]">Concluída</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold">1º Ano A - Matemática</span>
                  </div>
                  <Link href={routes.attendance()}>
                    <Badge variant="outline" className="text-amber-700 text-[10px] cursor-pointer hover:bg-amber-100">Pendente (Fazer)</Badge>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 6. Activity feed */}
      <Card className="rounded-2xl shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold">Histórico de Atividades do Professor</CardTitle>
          <CardDescription className="text-xs">Registro das últimas alterações, notas, presenças e uploads realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity activities={recentActivities} />
        </CardContent>
      </Card>
    </div>
  );
}
