"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { 
  Plus, Search, Filter, Eye, Copy, CheckSquare, 
  Heart, LayoutGrid, List, Sparkles, BookOpen 
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")

  // Create Question Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newStatement, setNewStatement] = useState("")
  const [newSubject, setNewSubject] = useState("Matemática")
  const [newDifficulty, setNewDifficulty] = useState("MEDIUM")
  const [newType, setNewType] = useState("MULTIPLE_CHOICE")
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("A")
  const [newExplanation, setNewExplanation] = useState("")

  // View Details Dialog
  const [viewingQuestion, setViewingQuestion] = useState<any | null>(null)

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("q", searchQuery)
      if (difficultyFilter !== "ALL") params.append("difficulty", difficultyFilter)
      if (typeFilter !== "ALL") params.append("type", typeFilter)

      const res = await fetch(`/api/question-bank?${params.toString()}`)
      const data = await res.json()
      setQuestions(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Erro ao carregar banco de questões.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [searchQuery, difficultyFilter, typeFilter])

  const handleCreateQuestion = async () => {
    if (!newStatement.trim()) {
      toast.error("O enunciado da questão é obrigatório.")
      return
    }

    try {
      const res = await fetch("/api/question-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statement: newStatement,
          difficulty: newDifficulty,
          type: newType,
          correctAnswer: newCorrectAnswer,
          explanation: newExplanation,
          options: ["A) Opção 1", "B) Opção 2", "C) Opção 3", "D) Opção 4", "E) Opção 5"]
        })
      })
      if (res.ok) {
        toast.success("Questão adicionada com sucesso ao Banco!")
        setIsCreateOpen(false)
        setNewStatement("")
        setNewExplanation("")
        fetchQuestions()
      }
    } catch {
      toast.error("Erro ao salvar questão.")
    }
  }

  const handleCopyQuestion = (q: any) => {
    navigator.clipboard.writeText(`${q.statement}\n\nGabarito: ${q.correctAnswer}\nResolução: ${q.explanation || 'N/A'}`)
    toast.success("Enunciado e gabarito copiados para a área de transferência!")
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <PageHeader
        title="Banco de Questões"
        description="Biblioteca estruturada de exercícios com filtros por disciplina, nível de dificuldade e resolução passo a passo."
        actions={
          <div className="flex space-x-2 flex-wrap">
            <Link href="/activities">
              <Button variant="outline" className="border-indigo-200 dark:border-indigo-800">
                Criar Atividade
              </Button>
            </Link>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Nova Questão
            </Button>
          </div>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar por palavras-chave, assunto, ENEM..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={isFilterOpen ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <div className="flex border rounded-md p-0.5 bg-muted/40">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleContent className="space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Dificuldade</label>
              <Select value={difficultyFilter} onValueChange={(v) => v && setDifficultyFilter(v)}>
                <SelectTrigger><SelectValue placeholder="Dificuldade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as Dificuldades</SelectItem>
                  <SelectItem value="EASY">Fácil</SelectItem>
                  <SelectItem value="MEDIUM">Médio</SelectItem>
                  <SelectItem value="HARD">Difícil</SelectItem>
                  <SelectItem value="EXPERT">Avançado / Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Tipo de Questão</label>
              <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v)}>
                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Tipos</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE">Múltipla Escolha</SelectItem>
                  <SelectItem value="OPEN">Discursiva / Aberta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="ghost" className="text-xs text-muted-foreground" onClick={() => { setDifficultyFilter("ALL"); setTypeFilter("ALL"); setSearchQuery(""); }}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Questions Display */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground">
          Carregando questões do banco...
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl space-y-2">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-base">Nenhuma questão encontrada</h3>
          <p className="text-xs text-muted-foreground">Tente alterar os termos de pesquisa ou crie uma nova questão.</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {questions.map((q) => (
            <Card key={q.id} className={viewMode === "list" ? "flex flex-col md:flex-row hover:shadow-md transition-shadow" : "flex flex-col hover:shadow-md transition-shadow"}>
              <div className="flex-1 flex flex-col p-5">
                <CardHeader className="p-0 mb-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                      #{q.id}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[11px]">{q.subject?.name || "Geral"}</Badge>
                      <Badge 
                        variant={q.difficulty === "HARD" ? "destructive" : q.difficulty === "MEDIUM" ? "default" : "secondary"}
                        className="text-[11px]"
                      >
                        {q.difficulty === "EASY" ? "Fácil" : q.difficulty === "MEDIUM" ? "Médio" : "Difícil"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex-1 space-y-3">
                  <p className="text-sm font-medium leading-relaxed line-clamp-3">{q.statement}</p>
                  
                  {q.options && Array.isArray(q.options) && (
                    <div className="space-y-1 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border text-xs text-muted-foreground">
                      {q.options.slice(0, 3).map((opt: string, i: number) => (
                        <div key={i} className="truncate">{opt}</div>
                      ))}
                      {q.options.length > 3 && (
                        <div className="text-[10px] italic text-indigo-600">+ mais {q.options.length - 3} alternativas...</div>
                      )}
                    </div>
                  )}

                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {q.tags.map((t: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                          #{t.tag?.name || t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>

              <CardFooter className={viewMode === "list" ? "flex flex-col md:w-44 justify-center gap-1.5 border-t md:border-t-0 md:border-l p-4 bg-muted/10" : "flex flex-wrap gap-1 pt-3 pb-3 px-5 border-t bg-slate-50/50 dark:bg-slate-900/30"}>
                <Button variant="ghost" size="sm" className="h-8 text-xs justify-start flex-1" onClick={() => setViewingQuestion(q)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs justify-start flex-1" onClick={() => handleCopyQuestion(q)}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copiar
                </Button>
                <Link href={`/exercises/solver?operation=determinant`} className="w-full">
                  <Button variant="ghost" size="sm" className="h-8 text-xs justify-start w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5" /> Resolver Passo a Passo
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Question Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Questão ao Banco</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Enunciado da Questão</Label>
              <Textarea 
                rows={4}
                placeholder="Digite o enunciado da questão. Suporte a KaTeX: $a^2 + b^2 = c^2$..."
                value={newStatement}
                onChange={(e) => setNewStatement(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Dificuldade</Label>
                <Select value={newDifficulty} onValueChange={(v) => { if (v) setNewDifficulty(v); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Fácil</SelectItem>
                    <SelectItem value="MEDIUM">Médio</SelectItem>
                    <SelectItem value="HARD">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Gabarito / Resposta Correta</Label>
                <Input 
                  placeholder="Ex: A, ou x = 3"
                  value={newCorrectAnswer}
                  onChange={(e) => setNewCorrectAnswer(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Resolução Comentada / Explicação</Label>
              <Textarea 
                rows={3}
                placeholder="Passo a passo da resolução da questão..."
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button className="bg-indigo-600 text-white" onClick={handleCreateQuestion}>Salvar no Banco</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Question Details Modal */}
      <Dialog open={!!viewingQuestion} onOpenChange={(open) => { if (!open) setViewingQuestion(null); }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-base">
              <span>Questão #{viewingQuestion?.id}</span>
              <Badge>{viewingQuestion?.difficulty}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Enunciado</h4>
              <p className="font-medium text-slate-900 dark:text-slate-100">{viewingQuestion?.statement}</p>
            </div>

            {viewingQuestion?.options && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Alternativas</h4>
                <div className="space-y-1">
                  {viewingQuestion.options.map((opt: string, idx: number) => (
                    <div key={idx} className="p-2 rounded bg-card border text-xs">
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Gabarito Oficial: {viewingQuestion?.correctAnswer}</h4>
              {viewingQuestion?.explanation && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">{viewingQuestion.explanation}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setViewingQuestion(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
