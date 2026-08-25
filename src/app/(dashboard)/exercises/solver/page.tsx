"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MatrixInput } from "@/components/exercises/matrix-input";
import { StepCard } from "@/components/exercises/step-card";
import { BlackboardMode } from "@/components/exercises/blackboard-mode";
import { useExerciseSolver } from "@/hooks/use-exercise-solver";
import { Lightbulb, BookOpen, Eye, RotateCcw, MonitorPlay, CheckCircle2 } from "lucide-react";

function SolverContent() {
  const searchParams = useSearchParams();
  const defaultDomain = searchParams.get("domain") ?? "matrix";
  const defaultOperation = searchParams.get("operation") ?? "determinant";

  const [activeDomain, setActiveDomain] = useState(defaultDomain);

  // Matrix state
  const [operation, setOperation] = useState(defaultOperation);
  const [size, setSize] = useState(3);
  const [scalar, setScalar] = useState(2);
  const [matrixA, setMatrixA] = useState<number[][]>([[1, 2, 3], [0, 1, 4], [5, 6, 0]]);
  const [matrixB, setMatrixB] = useState<number[][]>([[2, 0, -1], [1, 3, 2], [0, -2, 1]]);

  // Equation state
  const [eqType, setEqType] = useState<'linear' | 'quadratic'>('quadratic');
  const [eqA, setEqA] = useState(1);
  const [eqB, setEqB] = useState(-5);
  const [eqC, setEqC] = useState(6);

  // Fraction state
  const [fracOp, setFracOp] = useState<'add' | 'subtract' | 'multiply' | 'divide' | 'simplify'>('add');
  const [numA, setNumA] = useState(2);
  const [denA, setDenA] = useState(3);
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(6);

  // Percentage state
  const [pctMode, setPctMode] = useState<'calculate' | 'increase' | 'discount' | 'between'>('increase');
  const [pctVal, setPctVal] = useState(100);
  const [pctRate, setPctRate] = useState(20);
  const [pctV2, setPctV2] = useState(150);

  // Statistics state
  const [statDataStr, setStatDataStr] = useState("12, 15, 15, 18, 20, 22, 25, 28, 30");

  // Physics state
  const [physType, setPhysType] = useState<'mruv' | 'torricelli' | 'newton' | 'kinetic-energy'>('torricelli');
  const [physV0, setPhysV0] = useState(0);
  const [physA, setPhysA] = useState(2);
  const [physT, setPhysT] = useState(5);
  const [physDs, setPhysDs] = useState(25);
  const [physM, setPhysM] = useState(10);
  const [physV, setPhysV] = useState(20);

  // Chemistry state
  const [chemType, setChemType] = useState<'ideal-gas' | 'density' | 'molar-amount'>('ideal-gas');
  const [chemP, setChemP] = useState(1);
  const [chemV, setChemV] = useState(22.4);
  const [chemN, setChemN] = useState(1);
  const [chemT, setChemT] = useState(273.15);
  const [chemM, setChemM] = useState(36);
  const [chemMolar, setChemMolar] = useState(18);

  const {
    currentStep,
    steps,
    result,
    isLoading,
    showAll,
    showHint,
    showFormulaOnly,
    isBlackboardMode,
    solveMatrix,
    solveEquation,
    solveFraction,
    solvePercentage,
    solveStatistics,
    solvePhysics,
    solveChemistry,
    nextStep,
    prevStep,
    goToStep,
    showCompleteResolution,
    setShowHint,
    setShowFormulaOnly,
    reset,
    setBlackboardMode
  } = useExerciseSolver();

  const handleSolve = () => {
    if (activeDomain === 'matrix') {
      const isBinary = ['add', 'subtract', 'multiply'].includes(operation);
      const isScalar = operation === 'scalar';
      solveMatrix(matrixA, isBinary ? matrixB : undefined, operation, isScalar ? scalar : undefined);
    } else if (activeDomain === 'equation') {
      solveEquation(eqA, eqB, eqC, eqType === 'quadratic');
    } else if (activeDomain === 'fraction') {
      solveFraction(fracOp, { numerator: numA, denominator: denA }, fracOp !== 'simplify' ? { numerator: numB, denominator: denB } : undefined);
    } else if (activeDomain === 'percentage') {
      solvePercentage(pctRate, pctVal, pctMode, pctV2);
    } else if (activeDomain === 'statistics') {
      const parsed = statDataStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      solveStatistics(parsed.length > 0 ? parsed : [10, 20, 30]);
    } else if (activeDomain === 'physics') {
      solvePhysics(physType, { v0: physV0, a: physA, t: physT, deltaS: physDs, m: physM, v: physV });
    } else if (activeDomain === 'chemistry') {
      solveChemistry(chemType, { p: chemP, v: chemV, n: chemN, t: chemT, m: chemM, molarMass: chemMolar });
    }
  };

  if (isBlackboardMode) {
    return (
      <BlackboardMode 
        steps={steps}
        currentStep={currentStep}
        onNext={nextStep}
        onPrev={prevStep}
        onExit={() => setBlackboardMode(false)}
      />
    );
  }

  const isBinaryOperation = ['add', 'subtract', 'multiply'].includes(operation);
  const isScalarOperation = operation === 'scalar';

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🧮</span> Resolvedor Universal Passo a Passo
          </h2>
          <p className="text-muted-foreground mt-1">
            Motor científico com resolução progressiva, fórmulas KaTeX, marcações visuais e modo lousa digital.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setBlackboardMode(true)}
            disabled={steps.length === 0}
            className="gap-2 border-indigo-200 dark:border-indigo-800"
          >
            <MonitorPlay className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Modo Lousa Digital (Projetor)
          </Button>
          {steps.length > 0 && (
            <Button variant="ghost" size="icon" onClick={reset} title="Reiniciar">
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Domain Selection Tabs */}
      <Tabs value={activeDomain} onValueChange={(val) => { setActiveDomain(val); reset(); }} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 h-auto p-1 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="matrix" className="py-2 text-xs md:text-sm font-medium">Matrizes</TabsTrigger>
          <TabsTrigger value="equation" className="py-2 text-xs md:text-sm font-medium">Equações</TabsTrigger>
          <TabsTrigger value="fraction" className="py-2 text-xs md:text-sm font-medium">Frações</TabsTrigger>
          <TabsTrigger value="percentage" className="py-2 text-xs md:text-sm font-medium">Porcentagem</TabsTrigger>
          <TabsTrigger value="statistics" className="py-2 text-xs md:text-sm font-medium">Estatística</TabsTrigger>
          <TabsTrigger value="physics" className="py-2 text-xs md:text-sm font-medium">Física</TabsTrigger>
          <TabsTrigger value="chemistry" className="py-2 text-xs md:text-sm font-medium">Química</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Panel: Problem Config */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Entrada de Dados</span>
                  <Badge variant="outline" className="capitalize">{activeDomain}</Badge>
                </CardTitle>
                <CardDescription>Configure os parâmetros para o cálculo passo a passo</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* 1. MATRIX TAB */}
                <TabsContent value="matrix" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Tamanho</label>
                    <Select value={size.toString()} onValueChange={(val) => {
                      if (!val) return;
                      const s = parseInt(val);
                      setSize(s);
                      setMatrixA(Array(s).fill(0).map(() => Array(s).fill(0)));
                      setMatrixB(Array(s).fill(0).map(() => Array(s).fill(0)));
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2x2 (Ordem 2)</SelectItem>
                        <SelectItem value="3">3x3 (Ordem 3)</SelectItem>
                        <SelectItem value="4">4x4 (Ordem 4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Operação</label>
                    <Select value={operation} onValueChange={(v) => v && setOperation(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="determinant">Determinante (det A)</SelectItem>
                        <SelectItem value="inverse">Matriz Inversa (A⁻¹)</SelectItem>
                        <SelectItem value="transpose">Matriz Transposta (Aᵀ)</SelectItem>
                        <SelectItem value="scalar">Multiplicação por Escalar (k · A)</SelectItem>
                        <SelectItem value="add">Soma (A + B)</SelectItem>
                        <SelectItem value="subtract">Subtração (A - B)</SelectItem>
                        <SelectItem value="multiply">Multiplicação (A × B)</SelectItem>
                        <SelectItem value="gauss">Escalonamento (Gauss)</SelectItem>
                        <SelectItem value="gauss-jordan">Gauss-Jordan (RREF)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isScalarOperation && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Escalar (k)</label>
                      <Input type="number" value={scalar} onChange={(e) => setScalar(parseFloat(e.target.value) || 0)} />
                    </div>
                  )}

                  <MatrixInput name="A" size={size} value={matrixA} onChange={setMatrixA} />

                  {isBinaryOperation && (
                    <div className="pt-3 border-t">
                      <MatrixInput name="B" size={size} value={matrixB} onChange={setMatrixB} />
                    </div>
                  )}
                </TabsContent>

                {/* 2. EQUATION TAB */}
                <TabsContent value="equation" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Tipo de Equação</label>
                    <Select value={eqType} onValueChange={(v) => { if (v) setEqType(v as 'linear' | 'quadratic'); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">1º Grau: ax + b = c</SelectItem>
                        <SelectItem value="quadratic">2º Grau: ax² + bx + c = 0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Coeficiente a</label>
                      <Input type="number" value={eqA} onChange={(e) => setEqA(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Coeficiente b</label>
                      <Input type="number" value={eqB} onChange={(e) => setEqB(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Termo c</label>
                      <Input type="number" value={eqC} onChange={(e) => setEqC(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>
                </TabsContent>

                {/* 3. FRACTION TAB */}
                <TabsContent value="fraction" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Operação</label>
                    <Select value={fracOp} onValueChange={(v: any) => setFracOp(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Adição (+)</SelectItem>
                        <SelectItem value="subtract">Subtração (-)</SelectItem>
                        <SelectItem value="multiply">Multiplicação (×)</SelectItem>
                        <SelectItem value="divide">Divisão (÷)</SelectItem>
                        <SelectItem value="simplify">Simplificação (MDC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3 border">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">Fração A:</span>
                      <Input className="w-16 text-center" type="number" value={numA} onChange={(e) => setNumA(parseInt(e.target.value) || 0)} />
                      <span>/</span>
                      <Input className="w-16 text-center" type="number" value={denA} onChange={(e) => setDenA(parseInt(e.target.value) || 1)} />
                    </div>

                    {fracOp !== 'simplify' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">Fração B:</span>
                        <Input className="w-16 text-center" type="number" value={numB} onChange={(e) => setNumB(parseInt(e.target.value) || 0)} />
                        <span>/</span>
                        <Input className="w-16 text-center" type="number" value={denB} onChange={(e) => setDenB(parseInt(e.target.value) || 1)} />
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 4. PERCENTAGE TAB */}
                <TabsContent value="percentage" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Tipo de Cálculo</label>
                    <Select value={pctMode} onValueChange={(v: any) => setPctMode(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calculate">P% de um Valor</SelectItem>
                        <SelectItem value="increase">Aumento Percentual (1 + P%)</SelectItem>
                        <SelectItem value="discount">Desconto Percentual (1 - P%)</SelectItem>
                        <SelectItem value="between">Variação Entre 2 Valores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Taxa P (%)</label>
                      <Input type="number" value={pctRate} onChange={(e) => setPctRate(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Valor Base</label>
                      <Input type="number" value={pctVal} onChange={(e) => setPctVal(parseFloat(e.target.value) || 0)} />
                    </div>
                  </div>

                  {pctMode === 'between' && (
                    <div>
                      <label className="text-xs text-muted-foreground">Valor Final (V2)</label>
                      <Input type="number" value={pctV2} onChange={(e) => setPctV2(parseFloat(e.target.value) || 0)} />
                    </div>
                  )}
                </TabsContent>

                {/* 5. STATISTICS TAB */}
                <TabsContent value="statistics" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Conjunto de Dados</label>
                    <p className="text-xs text-muted-foreground">Insira os valores numéricos separados por vírgula</p>
                    <textarea
                      value={statDataStr}
                      onChange={(e) => setStatDataStr(e.target.value)}
                      rows={3}
                      className="w-full p-2 text-sm border rounded-md bg-background"
                      placeholder="Ex: 10, 15, 20, 25, 30"
                    />
                  </div>
                </TabsContent>

                {/* 6. PHYSICS TAB */}
                <TabsContent value="physics" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Tópico de Física</label>
                    <Select value={physType} onValueChange={(v: any) => setPhysType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="torricelli">Equação de Torricelli (v² = v0² + 2aΔs)</SelectItem>
                        <SelectItem value="mruv">MRUV - Função Horária (v = v0 + at)</SelectItem>
                        <SelectItem value="newton">2ª Lei de Newton (F = m · a)</SelectItem>
                        <SelectItem value="kinetic-energy">Energia Cinética (Ec = mv²/2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {physType === 'torricelli' && (
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-xs">v0 (m/s)</label><Input type="number" value={physV0} onChange={e => setPhysV0(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">a (m/s²)</label><Input type="number" value={physA} onChange={e => setPhysA(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Δs (m)</label><Input type="number" value={physDs} onChange={e => setPhysDs(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}

                  {physType === 'mruv' && (
                    <div className="grid grid-cols-3 gap-2">
                      <div><label className="text-xs">v0 (m/s)</label><Input type="number" value={physV0} onChange={e => setPhysV0(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">a (m/s²)</label><Input type="number" value={physA} onChange={e => setPhysA(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">t (s)</label><Input type="number" value={physT} onChange={e => setPhysT(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}

                  {physType === 'newton' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs">Massa m (kg)</label><Input type="number" value={physM} onChange={e => setPhysM(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Aceleração a (m/s²)</label><Input type="number" value={physA} onChange={e => setPhysA(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}

                  {physType === 'kinetic-energy' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs">Massa m (kg)</label><Input type="number" value={physM} onChange={e => setPhysM(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Velocidade v (m/s)</label><Input type="number" value={physV} onChange={e => setPhysV(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}
                </TabsContent>

                {/* 7. CHEMISTRY TAB */}
                <TabsContent value="chemistry" className="m-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Tópico de Química</label>
                    <Select value={chemType} onValueChange={(v: any) => setChemType(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ideal-gas">Gases Ideais (PV = nRT)</SelectItem>
                        <SelectItem value="density">Densidade (d = m / V)</SelectItem>
                        <SelectItem value="molar-amount">Quantidade de Matéria (n = m / M)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {chemType === 'ideal-gas' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs">Volume V (L)</label><Input type="number" value={chemV} onChange={e => setChemV(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Mols n (mol)</label><Input type="number" value={chemN} onChange={e => setChemN(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Temp T (K)</label><Input type="number" value={chemT} onChange={e => setChemT(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}

                  {chemType === 'density' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs">Massa m (g)</label><Input type="number" value={chemM} onChange={e => setChemM(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Volume V (cm³)</label><Input type="number" value={chemV} onChange={e => setChemV(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}

                  {chemType === 'molar-amount' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs">Massa m (g)</label><Input type="number" value={chemM} onChange={e => setChemM(parseFloat(e.target.value) || 0)} /></div>
                      <div><label className="text-xs">Massa Molar M (g/mol)</label><Input type="number" value={chemMolar} onChange={e => setChemMolar(parseFloat(e.target.value) || 0)} /></div>
                    </div>
                  )}
                </TabsContent>

                <Button 
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm py-5" 
                  onClick={handleSolve} 
                  disabled={isLoading}
                >
                  {isLoading ? "Calculando passos..." : "⚡ Resolver Passo a Passo"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Progressive Resolution */}
          <div className="lg:col-span-8 space-y-4">
            {steps.length === 0 ? (
              <Card className="h-full flex items-center justify-center min-h-[420px] border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground space-y-3 pt-6 text-center max-w-md">
                  <div className="text-5xl">📐</div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Pronto para Resolver</h3>
                  <p className="text-sm">
                    Selecione a disciplina e a operação matemática desejada e clique em <strong>Resolver Passo a Passo</strong> para visualizar a resolução progressiva e detalhada.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Resolution Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={prevStep} 
                      disabled={currentStep === 0 || showAll}
                    >
                      ← Passo Anterior
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={nextStep} 
                      disabled={currentStep === steps.length - 1 || showAll}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Próximo Passo →
                    </Button>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                    {showAll ? `Exibindo todos os ${steps.length} passos` : `Passo ${currentStep + 1} de ${steps.length}`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className={showHint ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : ""}
                    >
                      <Lightbulb className="w-3.5 h-3.5 mr-1" />
                      Dica
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowFormulaOnly(!showFormulaOnly)}
                      className={showFormulaOnly ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : ""}
                    >
                      <BookOpen className="w-3.5 h-3.5 mr-1" />
                      Fórmula
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={showCompleteResolution}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Resolução Completa
                    </Button>
                  </div>
                </div>

                {/* Optional Hint Banner */}
                {showHint && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 animate-in fade-in">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Dica Pedagógica para este Passo:</strong> Preste atenção à regra de sinais e à simplificação antes de efetuar operações maiores para evitar erros algébricos comuns.
                    </div>
                  </div>
                )}

                {/* Step List / Active Step Display */}
                <div className="space-y-4">
                  {showAll ? (
                    steps.map((step, idx) => (
                      <StepCard 
                        key={idx} 
                        step={step} 
                        index={idx} 
                        isActive={true}
                        isCompleted={true}
                      />
                    ))
                  ) : (
                    <div className="space-y-4">
                      {/* Step Progress Indicators */}
                      <div className="flex gap-1.5">
                        {steps.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => goToStep(idx)}
                            className={`h-2 flex-1 rounded-full transition-all ${
                              idx === currentStep 
                                ? 'bg-indigo-600' 
                                : idx < currentStep 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-200 dark:bg-slate-800'
                            }`}
                            title={`Ir para passo ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <StepCard 
                        step={steps[currentStep]} 
                        index={currentStep} 
                        isActive={true}
                        isCompleted={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default function SolverPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Carregando resolvedor...</div>}>
      <SolverContent />
    </Suspense>
  );
}
