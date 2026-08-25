"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileDown, Plus, Sparkles, Loader2, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

export default function PlanningPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [form, setForm] = useState({
    title: "Matrizes: Conceitos e Operações Fundamentais",
    subject: "Matemática",
    classGroup: "2º Ano A",
    duration: "100 min",
    date: "2026-08-25",
    objective: "Compreender a representação de matrizes m x n, identificar elementos a_ij e realizar operações de adição e multiplicação por escalar.",
    introduction: "Apresentação de exemplos práticos de tabelas de dados na computação gráfica e redes sociais.",
    theory: "Definição formal de matriz m x n. Notação a_ij. Matriz quadrada, identidade, nula e transposta. Regras de soma e subtração.",
    examples: "Exemplo resolvido: Dadas A e B de ordem 2x2, calcular 2A - 3B no quadro digital.",
    exercises: "3 exercícios graduados: Fácil (fixação), Médio (operações), Difícil (situação-problema).",
    resolution: "Resolução comentada passo a passo com alerta para regras de sinais.",
    activity: "Lista individual de 5 questões para entrega na próxima aula.",
    review: "Síntese dos 3 conceitos-chave e mapa mental do conteúdo."
  });

  const recentPlans = [
    {
      title: "Matrizes: Conceitos e Operações Fundamentais",
      subject: "Matemática",
      classGroup: "2º Ano A",
      duration: "100 min",
      date: "2026-08-25",
      objective: "Compreender a representação de matrizes m x n, identificar elementos a_ij e realizar operações de adição e multiplicação por escalar.",
      introduction: "Apresentação de tabelas de dados e processamento gráfico.",
      theory: "Definição de matriz m x n, matriz transposta e soma.",
      examples: "Dadas A e B de ordem 2x2, calcular 2A - 3B.",
      exercises: "3 exercícios do livro didático.",
      resolution: "Resolução detalhada no quadro.",
      activity: "Lista de exercícios individuais.",
      review: "Fechamento dos pontos principais."
    },
    {
      title: "Determinantes 2x2 e 3x3 (Regra de Sarrus)",
      subject: "Matemática",
      classGroup: "2º Ano B",
      duration: "100 min",
      date: "2026-08-27",
      objective: "Aplicar a Regra de Sarrus para calcular determinantes de ordem 3.",
      introduction: "Motivação: resolução de sistemas lineares e cálculo de áreas.",
      theory: "Definição de determinante e Regra de Sarrus.",
      examples: "Cálculo de determinante com termos positivos e negativos.",
      exercises: "4 exercícios práticos.",
      resolution: "Demonstração dos erros comuns de sinal.",
      activity: "Quiz rápido em duplas.",
      review: "Propriedades dos determinantes."
    },
    {
      title: "Cinemática: Movimento Uniformemente Variado",
      subject: "Física",
      classGroup: "1º Ano A",
      duration: "100 min",
      date: "2026-08-28",
      objective: "Relacionar Força, Aceleração e Equação de Torricelli.",
      introduction: "Demonstração de frenagem veicular.",
      theory: "Funções horárias de posição e velocidade e Torricelli.",
      examples: "Cálculo de espaço de frenagem.",
      exercises: "Lista bimestral de física.",
      resolution: "Atenção às unidades do SI.",
      activity: "Laboratório virtual de MRUV.",
      review: "Mapa mental de cinemática."
    }
  ];

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Crie um plano de aula completo de ${form.subject} sobre ${form.title}`,
          actionType: 'lesson_plan'
        })
      });
      const data = await res.json();
      if (data.structuredData) {
        setForm(prev => ({
          ...prev,
          title: data.structuredData.title || prev.title,
          objective: data.structuredData.objective || prev.objective,
          introduction: data.structuredData.introduction || prev.introduction,
          theory: data.structuredData.theory || prev.theory,
          examples: data.structuredData.examples || prev.examples,
          exercises: data.structuredData.exercises || prev.exercises,
          resolution: data.structuredData.resolution || prev.resolution,
          activity: data.structuredData.activity || prev.activity,
          review: data.structuredData.review || prev.review
        }));
        toast.success("Plano estruturado gerado pela IA Pedagógica com sucesso!");
      }
    } catch {
      toast.error("Erro ao conectar à IA Pedagógica.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/lesson-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form,
          date: form.date
        })
      });
      setIsSaved(true);
      toast.success("Plano de aula salvo no sistema e integrado ao calendário!");
      setTimeout(() => setIsSaved(false), 3000);
    } catch {
      toast.error("Erro ao salvar plano.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📅</span> Planejamento & Criador de Aulas
          </h1>
          <p className="text-muted-foreground mt-1">
            Estruture aulas completas em 8 blocos pedagógicos com geração por IA, cronogramas semanais, mensais e anuais.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button 
            variant="outline" 
            onClick={handleGenerateAI} 
            disabled={isGeneratingAI}
            className="gap-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
          >
            {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
            Gerar com IA Pedagógica
          </Button>

          <Button variant="outline" onClick={handleExportPDF} className="gap-2">
            <FileDown className="w-4 h-4" /> Imprimir / PDF
          </Button>

          <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <BookmarkCheck className="w-4 h-4" /> {isSaving ? "Salvando..." : "Salvar Plano"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="criador-aula">
        <TabsList className="grid grid-cols-4 w-full md:w-[540px] bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="criador-aula">Criador de Aula (8 Blocos)</TabsTrigger>
          <TabsTrigger value="semanal">Semanal</TabsTrigger>
          <TabsTrigger value="mensal">Mensal</TabsTrigger>
          <TabsTrigger value="anual">Anual</TabsTrigger>
        </TabsList>

        {/* 1. ESTRUTURA COMPLETA EM 8 BLOCOS */}
        <TabsContent value="criador-aula" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* Header Details */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Informações Gerais da Aula</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Título do Conteúdo / Assunto</Label>
                    <Input 
                      value={form.title} 
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Ex: Matrizes: Conceitos e Operações Fundamentais" 
                      className="font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Disciplina</Label>
                      <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Turma</Label>
                      <Input value={form.classGroup} onChange={e => setForm({ ...form, classGroup: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Duração Estimada</Label>
                      <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Data Prevista</Label>
                      <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 8 Pedagogical Blocks */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground px-1">
                  Estrutura Pedagógica Completa (8 Blocos)
                </h3>

                {/* Bloco 1: Objetivo */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs flex items-center justify-center font-bold">1</span>
                      Objetivo Pedagógico (BNCC)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.objective} onChange={e => setForm({ ...form, objective: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 2: Introdução */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs flex items-center justify-center font-bold">2</span>
                      Introdução & Motivação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.introduction} onChange={e => setForm({ ...form, introduction: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 3: Teoria */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs flex items-center justify-center font-bold">3</span>
                      Teoria & Conceitos Fundamentais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={3} value={form.theory} onChange={e => setForm({ ...form, theory: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 4: Exemplo */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">4</span>
                      Exemplos Guiados em Sala
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.examples} onChange={e => setForm({ ...form, examples: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 5: Exercício */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-xs flex items-center justify-center font-bold">5</span>
                      Exercícios Práticos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.exercises} onChange={e => setForm({ ...form, exercises: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 6: Resolução */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 text-xs flex items-center justify-center font-bold">6</span>
                      Resolução Passo a Passo & Erros Comuns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.resolution} onChange={e => setForm({ ...form, resolution: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 7: Atividade */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 text-xs flex items-center justify-center font-bold">7</span>
                      Atividade de Fixação / Tarefa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} />
                  </CardContent>
                </Card>

                {/* Bloco 8: Revisão */}
                <Card>
                  <CardHeader className="py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 text-xs flex items-center justify-center font-bold">8</span>
                      Revisão & Fechamento da Aula
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-3">
                    <Textarea rows={2} value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Sidebar: Saved Models */}
            <div className="lg:col-span-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Modelos & Planos Salvos</CardTitle>
                  <CardDescription>Carregue um plano para editar ou reutilizar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentPlans.map((plan, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setForm({
                          title: plan.title,
                          subject: plan.subject,
                          classGroup: plan.classGroup,
                          duration: plan.duration,
                          date: plan.date,
                          objective: plan.objective,
                          introduction: plan.introduction,
                          theory: plan.theory,
                          examples: plan.examples,
                          exercises: plan.exercises,
                          resolution: plan.resolution,
                          activity: plan.activity,
                          review: plan.review
                        });
                        toast.info(`Plano "${plan.title}" carregado no editor.`);
                      }}
                      className="p-3.5 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 cursor-pointer transition-all shadow-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">{plan.subject}</Badge>
                        <span className="text-[11px] text-muted-foreground">{plan.date}</span>
                      </div>
                      <h4 className="font-semibold text-sm line-clamp-1">{plan.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{plan.classGroup} • {plan.duration}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2. SEMANAL */}
        <TabsContent value="semanal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planejamento Semanal (Semana 35 — Agosto 2026)</CardTitle>
              <CardDescription>Distribuição horária das aulas programadas por turma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { day: "Segunda (24/08)", classes: ["08:00 - 2º Ano A (Matrizes: Conceitos)", "10:00 - 1º Ano A (Função Afim)"] },
                  { day: "Terça (25/08)", classes: ["08:00 - 3º Ano A (Eletrodinâmica)", "13:30 - 2º Ano B (Matrizes: Adição)"] },
                  { day: "Quarta (26/08)", classes: ["10:00 - 2º Ano A (Multiplicação de Matrizes)", "15:00 - Plantão de Dúvidas"] },
                  { day: "Quinta (27/08)", classes: ["08:00 - 1º Ano A (Lista de Exercícios)", "10:00 - 3º Ano A (Circuitos Elétricos)"] },
                  { day: "Sexta (28/08)", classes: ["08:00 - 2º Ano B (Determinantes)", "11:00 - Reunião Pedagógica"] },
                ].map((col, idx) => (
                  <div key={idx} className="p-4 rounded-xl border bg-muted/20 space-y-3">
                    <h4 className="font-semibold text-sm text-foreground border-b pb-2">{col.day}</h4>
                    <div className="space-y-2">
                      {col.classes.map((c, cIdx) => (
                        <div key={cIdx} className="p-2.5 rounded-lg bg-card text-xs border shadow-xs">
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. MENSAL */}
        <TabsContent value="mensal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Planejamento Mensal — Agosto 2026</CardTitle>
              <CardDescription>Metas bimestrais e cronograma de provas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border bg-card">
                  <h4 className="font-semibold text-sm mb-1 text-indigo-600">Semanas 1 e 2: Álgebra Linear e Matrizes</h4>
                  <p className="text-xs text-muted-foreground">Definição, ordem m x n, operações fundamentais, propriedades e multiplicação de matrizes.</p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <h4 className="font-semibold text-sm mb-1 text-emerald-600">Semana 3: Determinantes e Regra de Cramer</h4>
                  <p className="text-xs text-muted-foreground">Determinantes de 2ª e 3ª ordem (Regra de Sarrus) e resolução de sistemas lineares.</p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <h4 className="font-semibold text-sm mb-1 text-amber-600">Semana 4: Avaliação Bimestral & Recuperação</h4>
                  <p className="text-xs text-muted-foreground">Aplicação da Prova Bimestral 3 e correção coletiva comentada com o Resolvedor Universal.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. ANUAL */}
        <TabsContent value="anual" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano Anual de Ensino (Ano Letivo 2026)</CardTitle>
              <CardDescription>Distribuição dos blocos curriculares ao longo dos 4 bimestres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <h4 className="font-bold text-sm text-blue-700 dark:text-blue-300 mb-2">1º Bimestre</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Conjuntos numéricos</li>
                    <li>• Funções de 1º e 2º grau</li>
                    <li>• Gráficos e vértices</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border bg-green-50/30 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                  <h4 className="font-bold text-sm text-green-700 dark:text-green-300 mb-2">2º Bimestre</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Trigonometria no triângulo</li>
                    <li>• Círculo trigonométrico</li>
                    <li>• Leis dos senos e cossenos</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                  <h4 className="font-bold text-sm text-amber-700 dark:text-amber-300 mb-2">3º Bimestre (Atual)</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Matrizes e determinantes</li>
                    <li>• Sistemas lineares (Gauss)</li>
                    <li>• Resoluções no EduMatrix</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border bg-purple-50/30 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
                  <h4 className="font-bold text-sm text-purple-700 dark:text-purple-300 mb-2">4º Bimestre</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• Geometria Espacial</li>
                    <li>• Estatística descritiva</li>
                    <li>• Probabilidade e revisão geral</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
