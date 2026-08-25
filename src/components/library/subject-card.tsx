import React from 'react';
import Link from 'next/link';
import { Sigma, Atom, FlaskConical, BookOpen, Landmark, Globe, Leaf, Languages } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = {
  Sigma, Atom, FlaskConical, BookOpen, Landmark, Globe, Leaf, Languages
};

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
  amber: 'bg-amber-100 text-amber-600',
  teal: 'bg-teal-100 text-teal-600',
  emerald: 'bg-emerald-100 text-emerald-600'
};

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    color: string;
    icon: string;
    topics: number;
    exercises: number;
  };
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const Icon = iconMap[subject.icon] || BookOpen;
  const colorClass = colorMap[subject.color] || 'bg-gray-100 text-gray-600';

  return (
    <Link href={`/library/${subject.id}`}>
      <Card className="hover:scale-105 transition-transform cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className={`p-4 rounded-full ${colorClass} mb-4`}>
            <Icon size={32} />
          </div>
          <h3 className="font-semibold text-lg mb-2">{subject.name}</h3>
          <p className="text-sm text-gray-500">
            {subject.topics} Tópicos • {subject.exercises} Exercícios
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
