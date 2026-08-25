"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface CreateActivityDialogProps {
  onActivityCreated?: () => void;
}

export function CreateActivityDialog({ onActivityCreated }: CreateActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Lista");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("2026-08-30");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      Promise.all([
        api.classes.list(),
        api.questionBank.list()
      ]).then(([classList, qList]) => {
        setClasses(Array.isArray(classList) ? classList : []);
        setQuestions(Array.isArray(qList) ? qList : []);
        if (Array.isArray(classList) && classList.length > 0 && !classId) {
          setClassId(classList[0].id);
        }
      }).catch(() => {});
    }
  }, [open]);

  const toggleQuestionSelection = (qId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleFinish = async () => {
    if (!title.trim() || !classId) {
      toast.error("Preencha o título e selecione uma turma.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.activities.create({
        title: `[${type}] ${title}`,
        description: instructions || `Lista contendo ${selectedQuestions.length} questões.`,
        dueDate,
        classId
      });
      toast.success("Atividade criada e publicada para a turma com sucesso!");
      setOpen(false);
      setStep(1);
      setTitle("");
      setSelectedQuestions([]);
      onActivityCreated?.();
    } catch {
      toast.error("Erro ao criar atividade.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 shadow-xs gap-2 transition-colors">
        <Plus className="h-4 w-4" /> Nova Atividade
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-base">Criar Nova Atividade / Avaliação (Passo {step} de 3)</DialogTitle>
        </DialogHeader>
        
        {step === 1 && (
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Título da Atividade</Label>
              <Input 
                placeholder="Ex: Prova Bimestral de Matrizes e Determinantes" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo</Label>
                <Select value={type} onValueChange={(v) => { if (v) setType(v); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prova">Prova Oficial</SelectItem>
                    <SelectItem value="Lista">Lista de Exercícios</SelectItem>
                    <SelectItem value="Trabalho">Trabalho em Grupo</SelectItem>
                    <SelectItem value="Simulado">Simulado ENEM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Turma de Destino</Label>
                <Select value={classId} onValueChange={(v) => { if (v) setClassId(v); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione a turma" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Data Limite / Prazo de Entrega</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div className="flex justify-end pt-3 border-t">
              <Button onClick={() => setStep(2)} disabled={!title.trim() || !classId} className="bg-indigo-600 text-white text-xs">
                Próximo: Vincular Questões
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Selecione as questões do Banco para compor a atividade ({selectedQuestions.length} selecionadas):
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-xl p-2 bg-slate-50 dark:bg-slate-900/40">
              {questions.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Nenhuma questão no banco.</p>
              ) : (
                questions.map(q => {
                  const isSelected = selectedQuestions.includes(q.id);
                  return (
                    <div 
                      key={q.id}
                      onClick={() => toggleQuestionSelection(q.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer flex justify-between items-start gap-2 transition-all ${
                        isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500 font-medium' 
                          : 'bg-card hover:bg-muted/40'
                      }`}
                    >
                      <span className="line-clamp-2">{q.statement}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>Voltar</Button>
              <Button size="sm" onClick={() => setStep(3)} className="bg-indigo-600 text-white">
                Próximo: Instruções
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Instruções Gerais para os Alunos</Label>
              <textarea 
                rows={4}
                className="w-full text-xs p-3 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Ex: Leia atentamente os enunciados. Justifique todos os cálculos no caderno..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="flex justify-between pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>Voltar</Button>
              <Button size="sm" onClick={handleFinish} disabled={isSubmitting} className="bg-indigo-600 text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar Atividade"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
