"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Star } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LegendItem {
  v: string;
  s: string;
  u: string;
}

interface FormulaItem {
  name: string;
  tex: string;
  legend: LegendItem[];
}

const formulas: Record<string, Record<string, FormulaItem[]>> = {
  matematica: {
    "Geometria Plana": [
      { name: "Área do Triângulo", tex: "A = \\frac{b \\cdot h}{2}", legend: [{v: "A", s: "Área", u: "m²"}, {v: "b", s: "Base", u: "m"}, {v: "h", s: "Altura", u: "m"}] },
      { name: "Área do Círculo", tex: "A = \\pi r^2", legend: [{v: "A", s: "Área", u: "m²"}, {v: "r", s: "Raio", u: "m"}] },
    ],
    "Álgebra": [
      { name: "Fórmula de Bhaskara", tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", legend: [{v: "x", s: "Raízes", u: "-"}, {v: "a,b,c", s: "Coeficientes", u: "-"}] }
    ]
  },
  fisica: {
    "Mecânica": [
      { name: "Segunda Lei de Newton", tex: "F = m \\cdot a", legend: [{v: "F", s: "Força", u: "N"}, {v: "m", s: "Massa", u: "kg"}, {v: "a", s: "Aceleração", u: "m/s²"}] },
      { name: "Velocidade Média", tex: "v_m = \\frac{\\Delta s}{\\Delta t}", legend: [{v: "v_m", s: "Velocidade", u: "m/s"}, {v: "Δs", s: "Deslocamento", u: "m"}, {v: "Δt", s: "Tempo", u: "s"}] }
    ]
  }
};

const FormulaCard = ({ formula }: { formula: FormulaItem }) => {
  const html = katex.renderToString(formula.tex, { throwOnError: false, displayMode: true });
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{formula.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="py-4 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="mt-4">
          <table className="w-full text-sm text-left">
            <thead><tr className="border-b"><th>Var</th><th>Significado</th><th>Unidade</th></tr></thead>
            <tbody>
              {formula.legend.map((l: LegendItem, i: number) => (
                <tr key={i} className="border-b last:border-0"><td>{l.v}</td><td>{l.s}</td><td>{l.u}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <div className="p-4 pt-0 flex gap-2 justify-end mt-auto">
        <Button variant="ghost" size="icon"><Star className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon"><Copy className="w-4 h-4" /></Button>
        <Button variant="outline" size="sm">Ver Exercícios</Button>
      </div>
    </Card>
  );
};

export default function FormulasPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Biblioteca de Fórmulas</h1>
      
      <Tabs defaultValue="matematica">
        <TabsList>
          <TabsTrigger value="matematica">Matemática</TabsTrigger>
          <TabsTrigger value="fisica">Física</TabsTrigger>
          <TabsTrigger value="quimica">Química</TabsTrigger>
        </TabsList>

        {Object.entries(formulas).map(([subject, areas]) => (
          <TabsContent key={subject} value={subject} className="mt-6">
            <Accordion multiple defaultValue={Object.keys(areas)}>
              {Object.entries(areas).map(([area, areaFormulas]) => (
                <AccordionItem key={area} value={area}>
                  <AccordionTrigger className="text-xl font-semibold">{area}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
                      {areaFormulas.map((f, i) => (
                        <FormulaCard key={i} formula={f} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
