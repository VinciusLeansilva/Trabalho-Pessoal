'use client';

import React, { useState } from 'react';
import { FileItem } from '@/hooks/use-repository';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { History, RotateCcw, Plus, CheckCircle2, FileText, Download } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FileVersionsDialogProps {
  file: FileItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRestoreVersion: (fileId: string, version: number) => Promise<void>;
  onAddVersion: (fileId: string, notes: string) => Promise<void>;
}

export function FileVersionsDialog({
  file,
  isOpen,
  onOpenChange,
  onRestoreVersion,
  onAddVersion
}: FileVersionsDialogProps) {
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!file) return null;

  const handleCreateNewVersion = async () => {
    if (!newVersionNotes.trim()) return;
    await onAddVersion(file.id, newVersionNotes);
    setNewVersionNotes('');
    setIsAdding(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Histórico e Versionamento de Arquivo
          </DialogTitle>
          <DialogDescription className="truncate">
            {file.name} • Versão Atual: <strong>v{file.currentVersion}.0</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {/* Version List */}
          <div className="space-y-3">
            {file.versions.map((ver) => {
              const isCurrent = ver.version === file.currentVersion;
              return (
                <div
                  key={ver.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-500'
                      : 'bg-card hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {ver.label || `Versão ${ver.version}.0`}
                        </span>
                        {isCurrent ? (
                          <Badge className="bg-indigo-600 text-white text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Ativa
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            v{ver.version}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(ver.dateModified), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })} • {formatBytes(ver.size)} • {ver.author}
                      </p>
                      {ver.notes && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 bg-white/70 dark:bg-slate-900/70 p-2 rounded border border-dashed">
                          📝 {ver.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 px-2" title="Baixar esta versão">
                        <Download className="w-4 h-4" />
                      </Button>
                      {!isCurrent && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 text-xs border-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          onClick={() => onRestoreVersion(file.id, ver.version)}
                        >
                          <RotateCcw className="w-3 h-3 text-indigo-600" />
                          Restaurar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Version Form */}
          {isAdding ? (
            <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registrar Nova Versão (v{file.currentVersion + 1}.0)
              </h4>
              <Input
                placeholder="Descreva as alterações desta versão (ex: Gabarito revisado, questão 4 corrigida)"
                value={newVersionNotes}
                onChange={(e) => setNewVersionNotes(e.target.value)}
                className="text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button size="sm" className="bg-indigo-600 text-white" onClick={handleCreateNewVersion}>
                  Salvar Nova Versão
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-full border-dashed gap-1.5"
            >
              <Plus className="w-4 h-4" /> Registrar Nova Versão deste Arquivo
            </Button>
          )}
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
