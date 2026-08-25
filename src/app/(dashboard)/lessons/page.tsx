"use client";

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, BookOpen, Plus, Play, Edit, FileText, Eye } from "lucide-react"

const lessonsMock = [
  {
    id: 1,
    title: "Introdução à Trigonometria",
    subject: "Matemática",
    topic: "Trigonometria",
    class: "1º Ano A",
    date: "2024-03-25",
    duration: "90 min",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Leis de Newton: Teoria e Prática",
    subject: "Física",
    topic: "Dinâmica",
    class: "1º Ano B",
    date: "2024-03-24",
    duration: "45 min",
    status: "completed"
  },
  {
    id: 3,
    title: "Funções de 2º Grau",
    subject: "Matemática",
    topic: "Álgebra",
    class: "9º Ano A",
    date: "2024-03-26",
    duration: "45 min",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Cinemática: Movimento Uniforme",
    subject: "Física",
    topic: "Cinemática",
    class: "1º Ano A",
    date: "2024-03-20",
    duration: "90 min",
    status: "completed"
  },
  {
    id: 5,
    title: "Estatística Básica",
    subject: "Matemática",
    topic: "Estatística",
    class: "3º Ano C",
    date: "2024-03-27",
    duration: "45 min",
    status: "draft"
  }
]

export default function LessonsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader
        title="Aulas"
        description="Gerencie seus planos de aula e apresentações."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Aula
          </Button>
        }
      />

      <Tabs defaultValue="minhas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="minhas">Minhas Aulas</TabsTrigger>
          <TabsTrigger value="recentes">Recentes</TabsTrigger>
          <TabsTrigger value="favoritas">Favoritas</TabsTrigger>
        </TabsList>

        <TabsContent value="minhas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessonsMock.map((lesson) => (
              <Card key={lesson.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={lesson.status === "completed" ? "secondary" : lesson.status === "draft" ? "outline" : "default"}>
                      {lesson.subject}
                    </Badge>
                    <Badge variant="outline">{lesson.class}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-xl">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {lesson.topic}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {new Date(lesson.date).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {lesson.duration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button variant="default" size="sm" className="w-full mt-2">
                    <Play className="mr-2 h-4 w-4" />
                    Apresentar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <FileText className="mr-2 h-4 w-4" />
                    Criar Atividade
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
