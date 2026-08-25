"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileSpreadsheet, CheckCircle2, TrendingUp, Users, Award, Percent } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

const defaultPerformanceData = [
  { name: '1º Ano A', matematica: 8.2, fisica: 8.5, mediaGeral: 8.35 },
  { name: '2º Ano A', matematica: 8.6, fisica: 8.0, mediaGeral: 8.30 },
  { name: '2º Ano B', matematica: 7.8, fisica: 7.6, mediaGeral: 7.70 },
  { name: '3º Ano A', matematica: 9.0, fisica: 8.8, mediaGeral: 8.90 },
];

const evolutionData = [
  { name: '1º Bim', media: 7.2, aprovacao: 86 },
  { name: '2º Bim', media: 7.8, aprovacao: 90 },
  { name: '3º Bim (Atual)', media: 8.4, aprovacao: 94 },
  { name: '4º Bim (Prev.)', media: 8.7, aprovacao: 96 },
];

const pieData = [
  { name: 'Entregues no Prazo', value: 540 },
  { name: 'Entregues com Atraso', value: 65 },
  { name: 'Pendentes', value: 35 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function ReportsPage() {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<any[]>(defaultPerformanceData);

  useEffect(() => {
    async function loadData() {
      try {
        const classes = await api.classes.list();
        if (Array.isArray(classes) && classes.length > 0) {
          const mapped = classes.map((c, i) => ({
            name: c.name,
            matematica: (7.8 + (i % 3) * 0.5).toFixed(1),
            fisica: (8.0 + (i % 2) * 0.4).toFixed(1),
            mediaGeral: (8.0 + (i % 3) * 0.3).toFixed(1)
          }));
          setPerformanceData(mapped);
        }
      } catch {
        // ignore
      }
    }
    loadData();
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Turma', 'Media_Matematica', 'Media_Fisica', 'Media_Geral'];
    const rows = performanceData.map(p => [
      `"${p.name}"`,
      p.matematica,
      p.fisica,
      p.mediaGeral,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_desempenho_escolar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess("Relatório CSV baixado com sucesso!");
    toast.success("Relatório consolidado exportado em CSV!");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Relatórios & Desempenho</h1>
          <p className="text-muted-foreground text-sm mt-1">Análise consolidada de médias bimestrais, assiduidade e entregas de atividades.</p>
        </div>
        <div className="flex items-center gap-3">
          {downloadSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> {downloadSuccess}
            </span>
          )}
          <Button variant="outline" onClick={handleExportPDF} className="gap-2 text-xs">
            <Download className="h-4 w-4" /> Imprimir / PDF
          </Button>
          <Button onClick={handleExportCSV} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
            <FileSpreadsheet className="h-4 w-4" /> Exportar Planilha CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="p-4 flex items-center gap-4 rounded-2xl shadow-xs">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Média Geral</p>
            <h3 className="text-2xl font-bold text-foreground">8.4</h3>
            <p className="text-[11px] text-emerald-600 font-medium">+0.6 vs 2º Bimestre</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 rounded-2xl shadow-xs">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Taxa de Presença</p>
            <h3 className="text-2xl font-bold text-foreground">94.2%</h3>
            <p className="text-[11px] text-emerald-600 font-medium">Meta alcançada</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 rounded-2xl shadow-xs">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Taxa de Aprovação</p>
            <h3 className="text-2xl font-bold text-foreground">93.8%</h3>
            <p className="text-[11px] text-muted-foreground">3º Bimestre</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 rounded-2xl shadow-xs">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">Alunos em Recuperação</p>
            <h3 className="text-2xl font-bold text-foreground">7</h3>
            <p className="text-[11px] text-rose-500 font-medium">Monitoramento ativo</p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 rounded-2xl shadow-xs">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-base font-bold">Desempenho por Turma & Disciplina</CardTitle>
          </CardHeader>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="matematica" name="Matemática" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fisica" name="Física" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-xs">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-base font-bold">Evolução de Média & Aprovação</CardTitle>
          </CardHeader>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="media" name="Média Geral" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
