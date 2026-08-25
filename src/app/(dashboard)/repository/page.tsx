'use client';

import React, { useState } from 'react';
import { useRepository, FileItem } from '@/hooks/use-repository';
import { FolderTree } from '@/components/repository/folder-tree';
import { FileCard } from '@/components/repository/file-card';
import { FileListRow } from '@/components/repository/file-list-row';
import { UploadZone } from '@/components/repository/upload-zone';
import { CreateFolderDialog } from '@/components/repository/create-folder-dialog';
import { FileVersionsDialog } from '@/components/repository/file-versions-dialog';
import { 
  Search, Plus, Upload, LayoutGrid, List, 
  ChevronRight, Folder, Trash2, HardDrive
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RepositoryPage() {
  const repo = useRepository();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFileForVersions, setSelectedFileForVersions] = useState<FileItem | null>(null);

  const handleDeleteSelected = () => {
    if (repo.selectedItems.length > 0) {
      repo.deleteItems(repo.selectedItems);
    }
  };

  const handleSimulateUpload = async (fileName: string) => {
    await repo.uploadFile({
      name: fileName,
      size: 1024 * 450,
      type: fileName.split('.').pop() || 'pdf'
    });
    setIsUploadOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background overflow-hidden">
      {/* Header Toolbar */}
      <header className="flex-none border-b px-4 py-3 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">Meu Repositório (Drive do Professor)</h1>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
            <button 
              className="hover:text-foreground hover:underline transition-colors flex items-center"
              onClick={() => repo.setCurrentFolder(repo.folders[0])}
            >
              <Folder className="h-4 w-4 mr-1 text-amber-500" />
              Raiz
            </button>
            {repo.breadcrumb.map((node, index) => (
              <React.Fragment key={node.id}>
                <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
                <button 
                  className={`hover:text-foreground hover:underline transition-colors ${
                    index === repo.breadcrumb.length - 1 ? 'text-foreground font-medium' : ''
                  }`}
                  onClick={() => repo.setCurrentFolder(node)}
                >
                  {node.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar no repositório..." 
              className="w-full pl-9 bg-background"
              value={repo.searchQuery}
              onChange={(e) => repo.setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Pasta
          </Button>
          
          <Button onClick={() => setIsUploadOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Folder Tree */}
        <aside className="w-64 border-r bg-muted/20 flex-none hidden md:flex flex-col overflow-y-auto p-4">
          <div className="font-semibold text-xs mb-3 px-2 text-muted-foreground uppercase tracking-wider">
            Estrutura de Pastas
          </div>
          <FolderTree 
            nodes={repo.folders} 
            currentFolder={repo.currentFolder} 
            onSelect={repo.setCurrentFolder} 
          />
        </aside>

        {/* Right Content - Files/Folders Grid or List */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background relative">
          {/* Content Toolbar */}
          <div className="flex-none px-6 py-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              {repo.selectedItems.length > 0 ? (
                <>
                  <span className="text-sm text-muted-foreground font-medium mr-2">
                    {repo.selectedItems.length} selecionado(s)
                  </span>
                  <Button variant="ghost" size="sm" onClick={repo.clearSelection}>
                    Limpar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </>
              ) : (
                <span className="text-sm font-medium text-foreground">
                  {repo.files.length} {repo.files.length === 1 ? 'arquivo' : 'arquivos'} nesta pasta
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 hidden sm:flex">
                <span className="text-sm text-muted-foreground">Ordenar:</span>
                <Select value={repo.sortBy} onValueChange={(val) => { if (val) repo.setSortBy(val as 'name' | 'date' | 'size' | 'type') }}>
                  <SelectTrigger className="w-[130px] h-8 text-sm">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                    <SelectItem value="date">Data de Modificação</SelectItem>
                    <SelectItem value="size">Tamanho</SelectItem>
                    <SelectItem value="type">Tipo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center bg-muted rounded-md p-0.5">
                <button 
                  className={`p-1.5 rounded-sm transition-colors ${repo.viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                  onClick={() => repo.setViewMode('grid')}
                  title="Exibição em grade"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  className={`p-1.5 rounded-sm transition-colors ${repo.viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                  onClick={() => repo.setViewMode('list')}
                  title="Exibição em lista"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Files Container */}
          <div className="flex-1 overflow-y-auto p-6" onClick={repo.clearSelection}>
            {repo.isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : repo.files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Folder className="h-16 w-16 mb-4 text-muted" />
                <h3 className="text-lg font-medium mb-1">Esta pasta está vazia</h3>
                <p className="text-sm">Clique em <strong>Upload</strong> para adicionar provas, listas ou materiais.</p>
              </div>
            ) : repo.viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {repo.files.map(file => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    isSelected={repo.selectedItems.includes(file.id)}
                    onToggleSelection={repo.toggleSelection}
                    onToggleFavorite={repo.toggleFavorite}
                    onDelete={(id) => repo.deleteItems([id])}
                    onOpenVersions={(f) => setSelectedFileForVersions(f)}
                  />
                ))}
              </div>
            ) : (
              <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
                <div className="flex items-center gap-4 py-2 px-4 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <div className="w-5"></div>
                  <div className="w-5"></div>
                  <div className="flex-1">Nome do Arquivo</div>
                  <div className="hidden md:block w-24">Formato</div>
                  <div className="hidden sm:block w-24">Tamanho</div>
                  <div className="hidden lg:block w-36">Última Modificação</div>
                  <div className="w-28 text-right">Ações</div>
                </div>
                <div className="flex flex-col">
                  {repo.files.map(file => (
                    <FileListRow 
                      key={file.id} 
                      file={file}
                      isSelected={repo.selectedItems.includes(file.id)}
                      onToggleSelection={repo.toggleSelection}
                      onToggleFavorite={repo.toggleFavorite}
                      onDelete={(id) => repo.deleteItems([id])}
                      onOpenVersions={(f) => setSelectedFileForVersions(f)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateFolderDialog 
        isOpen={isCreateFolderOpen} 
        onOpenChange={setIsCreateFolderOpen}
        onCreate={(name) => repo.createFolder(name, repo.currentFolder?.id)}
        parentFolderName={repo.currentFolder?.name}
      />

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Arquivos para o Repositório</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <UploadZone />
            <div className="pt-2 border-t flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Ou selecione um exemplo rápido:</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handleSimulateUpload('Prova_Recuperacao_Matrizes.docx')}>
                  + Prova_Recuperacao.docx
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSimulateUpload('Lista_Fisica_Torricelli.pdf')}>
                  + Lista_Fisica.pdf
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleSimulateUpload('Apresentacao_Quimica_Gases.pptx')}>
                  + Slides_Quimica.pptx
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Versions History Dialog */}
      <FileVersionsDialog
        file={selectedFileForVersions}
        isOpen={!!selectedFileForVersions}
        onOpenChange={(open) => { if (!open) setSelectedFileForVersions(null); }}
        onRestoreVersion={async (fileId, ver) => {
          await repo.restoreVersion(fileId, ver);
          if (selectedFileForVersions) {
            setSelectedFileForVersions({ ...selectedFileForVersions, currentVersion: ver });
          }
        }}
        onAddVersion={async (fileId, notes) => {
          await repo.addVersion(fileId, notes);
          if (selectedFileForVersions) {
            const nextV = selectedFileForVersions.currentVersion + 1;
            setSelectedFileForVersions({
              ...selectedFileForVersions,
              currentVersion: nextV,
              versions: [
                ...selectedFileForVersions.versions,
                {
                  id: `v${nextV}-${Date.now()}`,
                  version: nextV,
                  label: `v${nextV}.0`,
                  dateModified: new Date().toISOString(),
                  size: selectedFileForVersions.size + 1200,
                  author: 'Prof. Carlos Santos',
                  notes
                }
              ]
            });
          }
        }}
      />
    </div>
  );
}
