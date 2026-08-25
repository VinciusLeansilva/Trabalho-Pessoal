import React from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Activity } from 'lucide-react';
import { SUBJECTS, TOPICS_BY_SUBJECT } from '@/data/library-seed-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const subjectId = params.subject;
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const topics = TOPICS_BY_SUBJECT[subjectId as keyof typeof TOPICS_BY_SUBJECT] || [];

  if (!subject) {
    return <div>Disciplina não encontrada.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Link href="/library" className="hover:text-blue-600">Biblioteca</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 font-medium">{subject.name}</span>
      </div>

      <div className="flex items-center gap-4 border-b pb-6">
        <div className={`p-4 rounded-lg bg-${subject.color}-100 text-${subject.color}-600`}>
          <FileText size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-muted-foreground">{subject.topics} Tópicos • {subject.exercises} Exercícios</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 pt-4">
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <h3 className="font-semibold text-lg mb-4">Tópicos</h3>
          {topics.map(topic => (
            <div key={topic.id} className="p-2 hover:bg-gray-100 rounded-md cursor-pointer font-medium text-sm">
              {topic.name}
            </div>
          ))}
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Conteúdo Disponível</h2>
          <div className="grid gap-4">
            {topics.map(topic => (
              <Card key={topic.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{topic.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {topic.subtopics.map((sub, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {sub}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center"><Activity className="w-4 h-4 mr-1"/> {topic.formulas} fórmulas</span>
                        <span className="flex items-center"><FileText className="w-4 h-4 mr-1"/> {topic.exercises} exercícios</span>
                      </div>
                    </div>
                    <Link href={`/library/${subject.id}/${topic.id}`}>
                      <Button>Acessar</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
