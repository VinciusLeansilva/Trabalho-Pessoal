import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Play, FileText, Printer, BookOpen, Target, List } from "lucide-react"

export default function LessonDetailPage({ params: _params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader
        title="Introdução à Trigonometria"
        breadcrumbs={[
          { label: "Aulas", href: "/lessons" },
          { label: "Trigonometria" }
        ]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Criar Atividade
            </Button>
            <Button variant="secondary">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Apresentar
            </Button>
          </div>
        }
      />

      <div className="flex items-center space-x-2 mb-6">
        <Badge>Matemática</Badge>
        <Badge variant="outline">1º Ano A</Badge>
        <span className="text-sm text-muted-foreground">90 minutos</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo da Aula</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
              <h3>1. O que é Trigonometria?</h3>
              <p>
                A trigonometria (do grego trigōnon &quot;triângulo&quot; + metron &quot;medida&quot;) é um ramo da matemática que estuda as relações entre os comprimentos de 2 lados de um triângulo retângulo (triângulo onde um dos ângulos mede 90 graus), para diferentes valores de um dos seus ângulos agudos.
              </p>
              
              <h3>2. Triângulo Retângulo</h3>
              <p>Revisão dos elementos do triângulo retângulo:</p>
              <ul>
                <li>Hipotenusa (maior lado, oposto ao ângulo reto)</li>
                <li>Cateto Oposto (lado oposto ao ângulo de referência)</li>
                <li>Cateto Adjacente (lado que forma o ângulo de referência junto com a hipotenusa)</li>
              </ul>

              <h3>3. Razões Trigonométricas</h3>
              <p>As três razões fundamentais são:</p>
              <ul>
                <li><strong>Seno (sen):</strong> Cateto Oposto / Hipotenusa</li>
                <li><strong>Cosseno (cos):</strong> Cateto Adjacente / Hipotenusa</li>
                <li><strong>Tangente (tan):</strong> Cateto Oposto / Cateto Adjacente</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <List className="mr-2 h-5 w-5" />
                Exercícios Relacionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer border">
                  <span>1. Calcule o seno do ângulo alfa no triângulo abaixo...</span>
                  <Badge variant="outline">Fácil</Badge>
                </li>
                <li className="flex justify-between items-center p-2 hover:bg-muted rounded-md cursor-pointer border">
                  <span>2. Um avião decola sob um ângulo de 30º...</span>
                  <Badge variant="outline">Médio</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Tópico</h4>
                <p>Trigonometria no Triângulo Retângulo</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Unidade Temática</h4>
                <p>Geometria e Medidas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Objetivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-2 text-sm">
                <li>Compreender as razões trigonométricas no triângulo retângulo.</li>
                <li>Identificar cateto oposto, adjacente e hipotenusa.</li>
                <li>Aplicar as fórmulas de seno, cosseno e tangente na resolução de problemas.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fórmulas Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-mono text-sm">
              <div className="p-3 bg-muted rounded-md">
                sen(θ) = CO / H
              </div>
              <div className="p-3 bg-muted rounded-md">
                cos(θ) = CA / H
              </div>
              <div className="p-3 bg-muted rounded-md">
                tan(θ) = CO / CA
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
