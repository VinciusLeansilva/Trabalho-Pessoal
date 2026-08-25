"use client";

import * as React from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "activity_due" | "grade_submitted" | "system";
  unread: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Atividade Pendente",
    description: "A lista de Cálculo vence amanhã.",
    time: "Há 10 min",
    type: "activity_due",
    unread: true,
  },
  {
    id: "2",
    title: "Nota Publicada",
    description: "As notas da Turma A foram lançadas.",
    time: "Há 2 horas",
    type: "grade_submitted",
    unread: true,
  },
  {
    id: "3",
    title: "Atualização de Sistema",
    description: "Novas funcionalidades de IA disponíveis.",
    time: "Há 1 dia",
    type: "system",
    unread: false,
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, unread: false }))
    );
  };

  return (
    <Popover>
      <PopoverTrigger className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600" />
          )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-medium leading-none">Notificações</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
            onClick={markAllAsRead}
          >
            <CheckCheck className="mr-1 h-3 w-3" />
            Marcar lidas
          </Button>
        </div>
        <div className="flex flex-col gap-1 py-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col gap-1 px-4 py-2 hover:bg-accent/50 ${
                notification.unread ? "bg-accent/10" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {notification.description}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
