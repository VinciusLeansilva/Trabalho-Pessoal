"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CheckCircle2, Save, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = params.id as string;

  const [submissions, setSubmissions] = useState([
    { id: "sub-1", studentId: "s1", name: "Ana Silva", enrollment: "2026001", date: "24/08/2026 14:30", status: "Corrigido", grade: "9.0", feedback: "Excelente raciocínio nos determinantes." },
    { id: "sub-2", studentId: "s2", name: "Bruno Costa", enrollment: "2026002", date: "24/08/2026 10:15", status: "Corrigido", grade: "8.5", feedback: "Atenção apenas ao sinal na regra de Sarrus." },
    { id: "sub-3", studentId: "s3", name: "Carla Dias", enrollment: "2026003", date: "24/08/2026 16:45", status: "Entregue", grade: "", feedback: "" },
    { id: "sub-4", studentId: "s4", name: "Daniel Santos", enrollment: "2026004", date: "23/08/2026 11:20", status: "Corrigido", grade: "7.0", feedback: "Revisar multiplicação de matrizes." },
    { id: "sub-5", studentId: "s5", name: "Eduarda Lima", enrollment: "2026005", date: "24/08/2026 18:00", status: "Entregue", grade: "", feedback: "" },
  ]);

  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleGradeChange = (index: number, val: string) => {
    setSubmissions(prev => {
      const copy = [...prev];
      copy[index].grade = val;
      return copy;
    });
  };

  const handleFeedbackChange = (index: number, val: string) => {
    setSubmissions(prev => {
      const copy = [...prev];
      copy[index].feedback = val;
      return copy;
    });
  };

  const handleSaveSubmission = async (index: number) => {
    setSavingIndex(index);
    const sub = submissions[index];
    try {
      if (sub.grade) {
        await api.grades.save({
          grades: [{
            studentId: sub.studentId,
            term: '3º Bimestre',
            value: parseFloat(sub.grade) || 0,
            comments: `Atividade #${activityId}: ${sub.feedback || 'Corrigido'}`
          }]
        });
      }
      setSubmissions(prev => {
        const copy = [...prev];
        copy[index].status = "Corrigido";
        return copy;
      });
      toast.success(`Nota do aluno ${sub.name} salva no diário de notas!`);
    } catch {
      toast.error("Erro ao salvar nota.");
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href={routes.activities()}>
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Lista de Matrizes e Determinantes
              </h1>
              <Badge className="bg-indigo-600 text-white text-xs">Lista Oficial</Badge>
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">2º Ano A • Matemática • Prazo: 30/08/2026</p>
          </div>
        </div>

        <Link href={routes.grades()}>
          <Button variant="outline" className="text-xs gap-1.5">
            Ver no Boletim Geral
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="pb-1"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Submissões</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">28 / 30</p></CardContent>
        </Card>
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="pb-1"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Média da Turma</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-600">8.2</p></CardContent>
        </Card>
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="pb-1"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Taxa de Entrega</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-indigo-600">93.3%</p></CardContent>
        </Card>
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="pb-1"><CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Status da Lista</CardTitle></CardHeader>
          <CardContent><Badge variant="outline" className="text-xs font-bold text-emerald-700 bg-emerald-50">Aberta</Badge></CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="entregas">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="entregas">Entregas & Correção ({submissions.length})</TabsTrigger>
          <TabsTrigger value="questoes">Questões Vinculadas (4)</TabsTrigger>
          <TabsTrigger value="gabarito">Gabarito Oficial</TabsTrigger>
        </TabsList>

        <TabsContent value="entregas" className="mt-4">
          <div className="bg-card text-card-foreground rounded-2xl shadow-xs border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Data de Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Nota (0-10)</TableHead>
                  <TableHead>Comentário / Feedback</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub, idx) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-semibold">
                      <div>{sub.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">Mat: {sub.enrollment}</div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{sub.date}</TableCell>
                    <TableCell>
                      <Badge variant={sub.status === 'Corrigido' ? 'default' : 'secondary'} className={sub.status === 'Corrigido' ? 'bg-emerald-600 text-white text-[11px]' : 'text-[11px]'}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <input 
                        type="number"
                        min="0" max="10" step="0.1"
                        value={sub.grade}
                        onChange={(e) => handleGradeChange(idx, e.target.value)}
                        placeholder="-"
                        className="w-16 text-center border rounded-lg py-1 text-sm bg-background font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </TableCell>
                    <TableCell>
                      <input 
                        type="text"
                        value={sub.feedback}
                        onChange={(e) => handleFeedbackChange(idx, e.target.value)}
                        placeholder="Adicione um feedback..."
                        className="w-full border rounded-lg px-2.5 py-1 text-xs bg-background outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveSubmission(idx)}
                        disabled={savingIndex === idx}
                        className="bg-indigo-600 text-white text-xs h-8 px-3"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" /> Salvar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="questoes" className="mt-4 space-y-3">
          <Card className="p-4 rounded-xl">
            <h4 className="font-semibold text-sm">Questão 1: Matrizes 2x2 e Determinante</h4>
            <p className="text-xs text-muted-foreground mt-1">{"Dada a matriz A = [[3, 5], [2, 7]], calcule o determinante det(A)."}</p>
          </Card>
          <Card className="p-4 rounded-xl">
            <h4 className="font-semibold text-sm">Questão 2: Regra de Sarrus em Matrizes 3x3</h4>
            <p className="text-xs text-muted-foreground mt-1">Calcule o determinante da matriz de ordem 3 pelo método das diagonais.</p>
          </Card>
        </TabsContent>

        <TabsContent value="gabarito" className="mt-4">
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl space-y-3 text-sm">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300">Gabarito e Soluções Oficiais</h4>
            <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              • Questão 1: $\det(A) = (3 \times 7) - (5 \times 2) = 21 - 10 = 11$.<br />
              • Questão 2: Aplicando a expansão de Sarrus, o valor final obtido é $+42$.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
