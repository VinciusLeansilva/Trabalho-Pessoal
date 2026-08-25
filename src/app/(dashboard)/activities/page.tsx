"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Loader2, CheckSquare, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { CreateActivityDialog } from "@/components/activities/create-activity-dialog";
import { api } from "@/lib/api-client";
import { routes } from "@/lib/routes";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await api.activities.list();
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(a => 
    (a.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (a.class?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Atividades & Avaliações</h1>
          <p className="text-muted-foreground text-sm mt-1">Listas de exercícios, provas bimestrais, trabalhos e prazos de entrega.</p>
        </div>
        <CreateActivityDialog onActivityCreated={fetchActivities} />
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar atividades por título ou turma..." 
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="todas">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="todas">Todas ({filteredActivities.length})</TabsTrigger>
          <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-4">
          {loading ? (
            <div className="p-12 flex justify-center items-center text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Carregando atividades...
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl space-y-3">
              <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="font-semibold text-lg">Nenhuma atividade cadastrada</h3>
              <p className="text-sm text-muted-foreground">Clique em <strong>+ Nova Atividade</strong> para criar uma lista ou prova.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredActivities.map((activity) => {
                const dueDateFormatted = activity.dueDate 
                  ? new Date(activity.dueDate).toLocaleDateString('pt-BR') 
                  : '30/08/2026';

                return (
                  <Card key={activity.id} className="rounded-2xl border hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-base font-bold line-clamp-1">{activity.title}</CardTitle>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {activity.class?.name || 'Turma'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {activity.description || 'Lista de exercícios programada.'}
                        </p>
                      </CardHeader>
                      <CardContent className="pb-2 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Prazo: {dueDateFormatted}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span>Entregas (28/30)</span>
                            <span className="text-emerald-600 font-bold">93%</span>
                          </div>
                          <Progress value={93} />
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="flex justify-end space-x-2 pt-3 border-t bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl">
                      <Link href={routes.activityDetail(activity.id)}>
                        <Button variant="outline" size="sm" className="text-xs">Ver Detalhes</Button>
                      </Link>
                      <Link href={routes.activityDetail(activity.id)}>
                        <Button size="sm" className="bg-indigo-600 text-white text-xs">Corrigir & Notas</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
