"use client";

import { useState } from "react";
import { 
  Sparkles, Bot, Send, Copy, Check, BookOpen, 
  CheckSquare, Presentation, Lightbulb, X, PlusCircle, ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

interface AIResponse {
  type: 'exercises' | 'lesson_plan' | 'explanation' | 'slides' | 'review' | 'general';
  title: string;
  content: string;
  timestamp: string;
  suggestedAction?: string;
  structuredData?: any;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([
    {
      type: 'general',
      title: 'Assistente Pedagógico EduMatrix',
      content: 'Olá, Professor! Sou seu assistente de ensino e gestão. Como posso ajudá-lo hoje?\n\n• Criar planos de aula estruturados (BNCC)\n• Gerar exercícios com gabarito e passos\n• Transformar conteúdo em slides de aula\n• Elaborar provas e atividades avaliativas',
      timestamp: 'Agora'
    }
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    {
      icon: BookOpen,
      label: "Plano: Matrizes",
      action: "lesson_plan",
      prompt: "Crie uma aula completa de matrizes e determinantes para o 2º Ano do Ensino Médio."
    },
    {
      icon: CheckSquare,
      label: "Criar 10 Exercícios",
      action: "exercises",
      prompt: "Crie uma lista de exercícios sobre determinantes e sistemas lineares com gabarito."
    },
    {
      icon: Presentation,
      label: "Gerar Slides",
      action: "slides",
      prompt: "Transforme o conteúdo de matrizes e cinemática em uma sequência de slides didáticos para projetor."
    },
    {
      icon: Lightbulb,
      label: "Explicar Passo a Passo",
      action: "explanation",
      prompt: "Explique como calcular o determinante de ordem 3 pela Regra de Sarrus de forma didática com alertas de erros de sinal."
    }
  ];

  const handleGenerate = async (customPrompt?: string, actionType?: string) => {
    const textToSend = customPrompt || prompt;
    if (!textToSend.trim()) return;

    setIsGenerating(true);
    setPrompt("");

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, actionType })
      });
      const data = await res.json();

      setResponses(prev => [
        {
          type: (actionType as any) || 'general',
          title: data.structuredData?.title ? `Proposta: ${data.structuredData.title}` : 'Resposta da IA Pedagógica',
          content: data.text || 'Resposta gerada.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestedAction: data.suggestedAction,
          structuredData: data.structuredData
        },
        ...prev
      ]);
    } catch {
      toast.error("Erro ao comunicar com o Assistente de IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        title="Assistente Pedagógico de IA"
      >
        <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
        <span className="text-sm font-semibold">IA Pedagógica</span>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl bg-background border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                    Assistente Pedagógico EduMatrix
                    <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200">
                      IA Integrada
                    </Badge>
                  </h2>
                  <p className="text-xs text-muted-foreground">Planejamento, exercícios, provas e slides integrados ao ERP</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-muted/20 border-b overflow-x-auto flex gap-2 no-scrollbar">
              {quickPrompts.map((qp, idx) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleGenerate(qp.prompt, qp.action)}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-border hover:border-indigo-500/50 text-xs font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors shadow-xs"
                  >
                    <Icon className="h-3.5 w-3.5 text-indigo-600" />
                    <span>{qp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Response Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {responses.map((res, i) => (
                <Card key={i} className="border-border shadow-sm">
                  <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      {res.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">{res.timestamp}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCopy(res.content, i)}
                        title="Copiar texto"
                      >
                        {copiedIndex === i ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-sm prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                    {res.content}

                    {/* Action buttons based on suggested action */}
                    {res.suggestedAction === 'insert_lesson_plan' && (
                      <div className="mt-3 pt-3 border-t flex justify-end">
                        <Link href="/planning">
                          <Button size="sm" className="bg-indigo-600 text-white text-xs gap-1.5" onClick={() => setIsOpen(false)}>
                            <PlusCircle className="w-3.5 h-3.5" /> Abrir no Criador de Aulas
                          </Button>
                        </Link>
                      </div>
                    )}

                    {res.suggestedAction === 'create_presentation' && (
                      <div className="mt-3 pt-3 border-t flex justify-end">
                        <Link href="/presentations">
                          <Button size="sm" className="bg-indigo-600 text-white text-xs gap-1.5" onClick={() => setIsOpen(false)}>
                            <Presentation className="w-3.5 h-3.5" /> Abrir no Editor de Slides
                          </Button>
                        </Link>
                      </div>
                    )}

                    {res.suggestedAction === 'save_question_bank' && (
                      <div className="mt-3 pt-3 border-t flex justify-end">
                        <Link href="/question-bank">
                          <Button size="sm" className="bg-indigo-600 text-white text-xs gap-1.5" onClick={() => setIsOpen(false)}>
                            <CheckSquare className="w-3.5 h-3.5" /> Ver no Banco de Questões
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-sm text-indigo-800 dark:text-indigo-200 animate-pulse">
                  <Bot className="h-5 w-5 animate-spin" />
                  <span>Gerando resposta pedagógica estruturada...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t bg-background">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGenerate();
                }}
                className="space-y-2"
              >
                <div className="relative">
                  <Textarea
                    placeholder="Ex: Crie 5 exercícios de determinantes, elabore um plano de aula sobre cinética..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="resize-none pr-12 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-2.5 bottom-2.5 bg-indigo-600 hover:bg-indigo-700 text-white h-8 w-8 rounded-lg shadow-sm"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground text-center">
                  Dica: Pressione <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Enter</kbd> para enviar.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
