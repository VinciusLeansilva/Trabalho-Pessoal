import React from 'react';
import Link from 'next/link';
import { ChevronRight, Presentation, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { SUBJECTS, TOPICS_BY_SUBJECT, MATRIZES_CONTENT } from '@/data/library-seed-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FormulaCard } from '@/components/library/formula-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TopicPage({ params }: { params: { subject: string, topic: string } }) {
  const { subject: subjectId, topic: topicId } = params;
  
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const topics = TOPICS_BY_SUBJECT[subjectId as keyof typeof TOPICS_BY_SUBJECT] || [];
  const topic = topics.find(t => t.id === topicId);
  
  const content = MATRIZES_CONTENT; // Using seed data

  if (!subject || !topic) return <div>Conteúdo não encontrado.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center text-sm text-gray-500 flex-wrap">
          <Link href="/library" className="hover:text-blue-600">Biblioteca</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href={`/library/${subject.id}`} className="hover:text-blue-600">{subject.name}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-gray-900 dark:text-gray-100 font-medium">{topic.name}</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/presentations/1/present`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Presentation className="h-4 w-4" />
              APRESENTAR AULA
            </Button>
          </Link>
          <Link href={`/exercises/solver?operation=determinant`}>
            <Button variant="outline" className="gap-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              RESOLVER NO QUADRO
            </Button>
          </Link>
          <Link href={`/activities`}>
            <Button variant="secondary" className="gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              CRIAR ATIVIDADE
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{topic.name}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center"><Activity className="w-4 h-4 mr-1 text-blue-600"/> {content.formulas.length} fórmulas</span>
          <span className="flex items-center"><FileText className="w-4 h-4 mr-1 text-emerald-600"/> {content.exercises.length} exercícios</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1 text-amber-600"/> {content.examples.length} exemplos</span>
        </div>
      </div>

      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="mb-6 grid grid-cols-5 h-auto">
          <TabsTrigger value="theory" className="py-3">Teoria</TabsTrigger>
          <TabsTrigger value="formulas" className="py-3">Fórmulas</TabsTrigger>
          <TabsTrigger value="examples" className="py-3">Exemplos</TabsTrigger>
          <TabsTrigger value="exercises" className="py-3">Exercícios</TabsTrigger>
          <TabsTrigger value="materials" className="py-3">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="theory" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4 text-gray-800 leading-relaxed text-lg">
              {content.theory.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.formulas.map(f => (
              <FormulaCard key={f.id} formula={f} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          {content.examples.map(ex => (
            <Card key={ex.id}>
              <CardHeader>
                <CardTitle>{ex.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{ex.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <div className="grid gap-4">
            {content.exercises.map(ex => (
              <Card key={ex.id}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div className="flex-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                      ex.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                      ex.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {ex.difficulty}
                    </span>
                    <p className="text-gray-800">{ex.text}</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    Ver Solução
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardContent className="p-6 text-center text-gray-500 py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum material adicional disponível no momento.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
