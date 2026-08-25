"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Eye, CheckCircle, FileText, Calendar } from "lucide-react"

const assessmentsMock = [
  {
    id: 1,
    title: "Prova Bimestral - Matemática",
    type: "Prova",
    class: "1º Ano A",
    date: "2024-04-10",
    totalPoints: 10,
    submissions: 25,
    totalStudents: 30,
    status: "active"
  },
  {
    id: 2,
    title: "Trabalho de Física - Leis de Newton",
    type: "Trabalho",
    class: "1º Ano B",
    date: "2024-03-28",
    totalPoints: 5,
    submissions: 28,
    totalStudents: 28,
    status: "grading"
  },
  {
    id: 3,
    title: "Projeto de Feira de Ciências",
    type: "Projeto",
    class: "9º Ano A",
    date: "2024-05-15",
    totalPoints: 20,
    submissions: 0,
    totalStudents: 35,
    status: "upcoming"
  }
]

export default function AssessmentsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader
        title="Avaliações"
        description="Gerencie provas, trabalhos e projetos."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Turma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as turmas</SelectItem>
            <SelectItem value="1a">1º Ano A</SelectItem>
            <SelectItem value="1b">1º Ano B</SelectItem>
            <SelectItem value="9a">9º Ano A</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="prova">Prova</SelectItem>
            <SelectItem value="trabalho">Trabalho</SelectItem>
            <SelectItem value="projeto">Projeto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessmentsMock.map((assessment) => (
          <Card key={assessment.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={assessment.type === "Prova" ? "destructive" : assessment.type === "Trabalho" ? "default" : "secondary"}>
                  {assessment.type}
                </Badge>
                <Badge variant="outline">{assessment.class}</Badge>
              </div>
              <CardTitle className="mt-2 text-xl">{assessment.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(assessment.date).toLocaleDateString('pt-BR')}
                </div>
                <div>{assessment.totalPoints} pontos</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Entregas ({assessment.submissions}/{assessment.totalStudents})</span>
                  <span>{Math.round((assessment.submissions / assessment.totalStudents) * 100)}%</span>
                </div>
                <Progress value={(assessment.submissions / assessment.totalStudents) * 100} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 pt-4 border-t">
              <Button variant="secondary" size="sm" className="flex-1">
                <Eye className="mr-2 h-4 w-4" />
                Ver
              </Button>
              <Button variant="default" size="sm" className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Corrigir
              </Button>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <FileText className="mr-2 h-4 w-4" />
                Gabarito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
