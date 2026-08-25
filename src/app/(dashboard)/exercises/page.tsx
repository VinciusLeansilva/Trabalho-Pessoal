"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function ExercisesPage() {
  const router = useRouter();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Exercícios & Resolução</h2>
      </div>
      <Tabs defaultValue="resolver" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resolver">Resolver Exercício</TabsTrigger>
          <TabsTrigger value="meus">Meus Exercícios</TabsTrigger>
          <TabsTrigger value="banco">Banco de Questões</TabsTrigger>
        </TabsList>
        <TabsContent value="resolver" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolver Novo Exercício</CardTitle>
              <CardDescription>
                Cole o enunciado do exercício ou configure os parâmetros para a resolução passo a passo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Matéria</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Matemática</SelectItem>
                      <SelectItem value="physics">Física</SelectItem>
                      <SelectItem value="chemistry">Química</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tópico</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matrices">Matrizes e Sistemas</SelectItem>
                      <SelectItem value="calculus">Cálculo Diferencial</SelectItem>
                      <SelectItem value="algebra">Álgebra Linear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enunciado (Opcional)</label>
                <Textarea placeholder="Cole ou digite o exercício aqui..." className="min-h-[150px]" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Limpar</Button>
              <Button onClick={() => router.push("/exercises/solver?type=matrix&operation=determinant")}>
                Resolver Passo a Passo
              </Button>
            </CardFooter>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Exercícios Recentes</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Determinante 3x3</CardTitle>
                  <CardDescription>Álgebra Linear</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Calcule o determinante da matriz A usando a Regra de Sarrus.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="meus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meus Exercícios</CardTitle>
              <CardDescription>Histórico de exercícios resolvidos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Nenhum exercício salvo no histórico.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banco" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input placeholder="Buscar questões..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Matéria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as matérias</SelectItem>
                <SelectItem value="math">Matemática</SelectItem>
                <SelectItem value="physics">Física</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary">Filtrar</Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                      {i % 2 === 0 ? "Média" : "Fácil"}
                    </Badge>
                    <Badge variant="outline">Matrizes</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">Questão {i}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm">Encontre a matriz inversa da matriz A dadas as seguintes condições...</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Resolver</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
