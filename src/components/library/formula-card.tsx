import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Copy, Presentation } from 'lucide-react';

interface Variable {
  name: string;
  desc: string;
}

interface FormulaCardProps {
  formula: {
    id: string;
    name: string;
    latex: string;
    variables: Variable[];
  };
}

export function FormulaCard({ formula }: FormulaCardProps) {
  const renderLatex = (latex: string) => {
    try {
      return { __html: katex.renderToString(latex, { throwOnError: false }) };
    } catch {
      return { __html: latex };
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          {formula.name}
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div 
          className="text-2xl text-center py-6 overflow-x-auto" 
          dangerouslySetInnerHTML={renderLatex(formula.latex)} 
        />
        
        {formula.variables && formula.variables.length > 0 && (
          <div className="mt-4 text-sm">
            <p className="font-semibold mb-2">Variáveis:</p>
            <ul className="space-y-1">
              {formula.variables.map((v, idx) => (
                <li key={idx} className="flex">
                  <span 
                    className="font-mono mr-2 text-blue-600" 
                    dangerouslySetInnerHTML={renderLatex(v.name)}
                  /> 
                  <span className="text-gray-600">- {v.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Copiar
        </Button>
        <Button size="sm">
          <Presentation className="h-4 w-4 mr-2" />
          Para Aula
        </Button>
      </CardFooter>
    </Card>
  );
}
