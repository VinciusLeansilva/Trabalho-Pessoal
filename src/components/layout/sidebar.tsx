"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  BookOpen,
  Video,
  Presentation,
  PenLine,
  Database,
  Calculator,
  Users,
  GraduationCap,
  ClipboardList,
  FileCheck,
  BarChart2,
  CalendarCheck,
  BookMarked,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookA,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    title: "PRINCIPAL",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Meu Repositório", href: "/dashboard/repository", icon: FolderOpen },
      { title: "Biblioteca", href: "/dashboard/library", icon: BookOpen },
    ],
  },
  {
    title: "ENSINO",
    items: [
      { title: "Aulas", href: "/dashboard/lessons", icon: Video },
      { title: "Apresentações", href: "/dashboard/presentations", icon: Presentation },
      { title: "Exercícios", href: "/dashboard/exercises", icon: PenLine },
      { title: "Banco de Questões", href: "/dashboard/question-bank", icon: Database },
      { title: "Fórmulas", href: "/dashboard/formulas", icon: Calculator },
    ],
  },
  {
    title: "GESTÃO",
    items: [
      { title: "Turmas", href: "/dashboard/classes", icon: Users },
      { title: "Alunos", href: "/dashboard/students", icon: GraduationCap },
      { title: "Atividades", href: "/dashboard/activities", icon: ClipboardList },
      { title: "Avaliações", href: "/dashboard/assessments", icon: FileCheck },
      { title: "Notas", href: "/dashboard/grades", icon: BarChart2 },
      { title: "Frequência", href: "/dashboard/attendance", icon: CalendarCheck },
    ],
  },
  {
    title: "PLANEJAMENTO",
    items: [
      { title: "Planejamento", href: "/dashboard/planning", icon: BookMarked },
      { title: "Calendário", href: "/dashboard/calendar", icon: Calendar },
      { title: "Relatórios", href: "/dashboard/reports", icon: TrendingUp },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { title: "Configurações", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo & Toggle */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <BookA size={20} />
          </div>
          {!collapsed && <span className="font-bold text-lg">EduMatrix</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {navGroups.map((group, index) => (
          <div key={index} className="mb-6 px-3">
            {!collapsed && (
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                {group.title}
              </h3>
            )}
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-white" : "text-muted-foreground")} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold">
            PF
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">Prof. Fernandes</span>
              <span className="truncate text-xs text-muted-foreground">Matemática</span>
            </div>
          )}
        </div>
        <Button variant="outline" className={cn("w-full justify-start", collapsed && "justify-center px-0")}>
          <LogOut size={16} className={cn(!collapsed && "mr-2")} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
