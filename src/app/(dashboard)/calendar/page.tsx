"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarEvent {
  id: string;
  day: number;
  title: string;
  type: 'class' | 'exam' | 'work' | 'assignment';
  time: string;
  classGroup: string;
}

export default function CalendarPage() {
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const startDayOffset = 6; // Aug 2026 starts on a Saturday

  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', day: 24, title: 'Aula: Matrizes (2º Ano A)', type: 'class', time: '08:00', classGroup: '2º Ano A' },
    { id: '2', day: 26, title: 'Trabalho de Física', type: 'work', time: '13:30', classGroup: '3º Ano A' },
    { id: '3', day: 28, title: 'Prova Bimestral de Matemática', type: 'exam', time: '08:00', classGroup: '2º Ano A' },
    { id: '4', day: 30, title: 'Entrega: Lista de Determinantes', type: 'assignment', time: '23:59', classGroup: '2º Ano B' },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    day: 25,
    type: 'class' as CalendarEvent['type'],
    time: '08:00',
    classGroup: '2º Ano A',
  });

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) return;
    setEvents(prev => [
      ...prev,
      {
        id: String(Date.now()),
        ...newEvent,
      }
    ]);
    setNewEvent({
      title: '',
      day: 25,
      type: 'class',
      time: '08:00',
      classGroup: '2º Ano A',
    });
    setIsNewEventOpen(false);
  };

  const getEventBadgeClass = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200';
      case 'work': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200';
      case 'assignment': return 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300 border border-green-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário Letivo</h1>
          <p className="text-muted-foreground mt-1">Aulas, avaliações, entregas e eventos escolares.</p>
        </div>
        <Button onClick={() => setIsNewEventOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <h2 className="text-xl font-semibold">Agosto 2026</h2>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm">Mês</Button>
                <Button variant="ghost" size="sm">Semana</Button>
                <Button variant="ghost" size="sm">Dia</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b bg-muted/40">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                  <div key={d} className="p-3 text-center font-semibold text-xs text-muted-foreground border-r last:border-r-0">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-5">
                {Array.from({length: startDayOffset}).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[110px] p-2 border-r border-b bg-muted/20" />
                ))}
                {days.map(day => {
                  const dayEvents = events.filter(e => e.day === day);
                  return (
                    <div key={day} className="min-h-[110px] p-2 border-r border-b relative hover:bg-muted/10 transition-colors">
                      <span className={`text-xs font-semibold ${day === 24 ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center' : 'text-foreground'}`}>
                        {day}
                      </span>
                      <div className="mt-1.5 space-y-1">
                        {dayEvents.map(e => (
                          <div key={e.id} className={`p-1 rounded text-[11px] font-medium truncate ${getEventBadgeClass(e.type)}`}>
                            {e.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full lg:w-[320px] space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Próximos Eventos</CardTitle>
              <CardDescription>Eventos programados neste mês</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="p-3 rounded-lg border bg-card flex gap-3 items-center">
                  <div className={`w-1.5 h-8 rounded-full ${
                    event.type === 'exam' ? 'bg-red-500' :
                    event.type === 'work' ? 'bg-amber-500' :
                    event.type === 'assignment' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.day} de Agosto • {event.time} • {event.classGroup}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Legenda de Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-blue-500"/> <span>Aula Regular</span></div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-red-500"/> <span>Prova / Avaliação</span></div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-amber-500"/> <span>Trabalho / Projeto</span></div>
              <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-green-500"/> <span>Entrega de Atividade</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Novo Evento */}
      <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título do Evento</Label>
              <Input 
                placeholder="Ex: Prova Substitutiva de Matrizes" 
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dia (Agosto)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="31" 
                  value={newEvent.day}
                  onChange={e => setNewEvent({ ...newEvent, day: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input 
                  type="time" 
                  value={newEvent.time}
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(val) => {
                    if (val) setNewEvent({ ...newEvent, type: val as CalendarEvent['type'] });
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Aula</SelectItem>
                    <SelectItem value="exam">Prova</SelectItem>
                    <SelectItem value="work">Trabalho</SelectItem>
                    <SelectItem value="assignment">Atividade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Turma</Label>
                <Input 
                  value={newEvent.classGroup}
                  onChange={e => setNewEvent({ ...newEvent, classGroup: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-700 text-white">Criar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
