import { useState, useCallback, useMemo } from 'react';

export interface FileVersionItem {
  id: string;
  version: number;
  label?: string;
  dateModified: string;
  size: number;
  author: string;
  notes?: string;
}

export interface FolderNode {
  id: string;
  name: string;
  children: FolderNode[];
  fileCount?: number;
  isFavorite?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  dateModified: string;
  folderId: string;
  isFavorite: boolean;
  owner: string;
  currentVersion: number;
  versions: FileVersionItem[];
}

const mockFolders: FolderNode[] = [
  {
    id: 'root',
    name: 'Meu Repositório',
    children: [
      {
        id: 'f1',
        name: 'Matemática',
        children: [
          { id: 'f1-1', name: '1º Ano', children: [] },
          { id: 'f1-2', name: '2º Ano', children: [] },
          { id: 'f1-3', name: '3º Ano', children: [] },
        ],
      },
      { id: 'f2', name: 'Física', children: [] },
      { id: 'f3', name: 'Provas e Avaliações', children: [] },
      { id: 'f4', name: 'Exercícios e Listas', children: [] },
      { id: 'f5', name: 'Slides e Apresentações', children: [] },
      { id: 'f6', name: 'Planejamentos', children: [] },
    ],
  },
];

const mockFiles: FileItem[] = [
  {
    id: 'file1',
    name: 'Prova_Bimestral_Matrizes.docx',
    type: 'docx',
    size: 1024 * 500,
    dateModified: '2026-08-24T14:30:00Z',
    folderId: 'f3',
    isFavorite: true,
    owner: 'Prof. Carlos Santos',
    currentVersion: 3,
    versions: [
      { id: 'v1', version: 1, label: 'v1.0 (Rascunho Inicial)', dateModified: '2026-08-10T09:00:00Z', size: 1024 * 420, author: 'Prof. Carlos', notes: 'Primeira versão com 4 questões' },
      { id: 'v2', version: 2, label: 'v2.0 (Revisão Gabarito)', dateModified: '2026-08-18T11:20:00Z', size: 1024 * 480, author: 'Prof. Carlos', notes: 'Adicionada questão bônus' },
      { id: 'v3', version: 3, label: 'FINAL (Pronta para Aplicação)', dateModified: '2026-08-24T14:30:00Z', size: 1024 * 500, author: 'Prof. Carlos', notes: 'Revisão ortográfica e formatação oficial' },
    ]
  },
  {
    id: 'file2',
    name: 'Lista_Exercicios_Determinantes.pdf',
    type: 'pdf',
    size: 1024 * 1024 * 2.5,
    dateModified: '2026-08-22T10:00:00Z',
    folderId: 'f1-2',
    isFavorite: false,
    owner: 'Prof. Carlos Santos',
    currentVersion: 2,
    versions: [
      { id: 'v1', version: 1, label: 'v1.0', dateModified: '2026-08-15T08:00:00Z', size: 1024 * 1024 * 2.0, author: 'Prof. Carlos' },
      { id: 'v2', version: 2, label: 'v2.0 (Com Gabarito)', dateModified: '2026-08-22T10:00:00Z', size: 1024 * 1024 * 2.5, author: 'Prof. Carlos' },
    ]
  },
  {
    id: 'file3',
    name: 'Slides_Cinematica_MRUV.pptx',
    type: 'pptx',
    size: 1024 * 1024 * 12,
    dateModified: '2026-08-23T09:15:00Z',
    folderId: 'f5',
    isFavorite: true,
    owner: 'Prof. Carlos Santos',
    currentVersion: 1,
    versions: [
      { id: 'v1', version: 1, label: 'v1.0 (Oficial)', dateModified: '2026-08-23T09:15:00Z', size: 1024 * 1024 * 12, author: 'Prof. Carlos' }
    ]
  },
  {
    id: 'file4',
    name: 'Boletim_Notas_1Bimestre.xlsx',
    type: 'xlsx',
    size: 1024 * 180,
    dateModified: '2026-08-24T16:45:00Z',
    folderId: 'root',
    isFavorite: true,
    owner: 'Prof. Carlos Santos',
    currentVersion: 2,
    versions: [
      { id: 'v1', version: 1, label: 'v1.0', dateModified: '2026-08-20T10:00:00Z', size: 1024 * 150, author: 'Prof. Carlos' },
      { id: 'v2', version: 2, label: 'FINAL', dateModified: '2026-08-24T16:45:00Z', size: 1024 * 180, author: 'Prof. Carlos' }
    ]
  },
  {
    id: 'file5',
    name: 'Grafico_Funcao_Quadratica.png',
    type: 'png',
    size: 1024 * 1024 * 1.2,
    dateModified: '2026-08-19T11:20:00Z',
    folderId: 'f1-1',
    isFavorite: false,
    owner: 'Prof. Carlos Santos',
    currentVersion: 1,
    versions: [
      { id: 'v1', version: 1, label: 'v1.0', dateModified: '2026-08-19T11:20:00Z', size: 1024 * 1024 * 1.2, author: 'Prof. Carlos' }
    ]
  },
  {
    id: 'file6',
    name: 'Plano_Ensino_Anual_2026.docx',
    type: 'docx',
    size: 1024 * 850,
    dateModified: '2026-08-01T08:00:00Z',
    folderId: 'f6',
    isFavorite: false,
    owner: 'Prof. Carlos Santos',
    currentVersion: 1,
    versions: [
      { id: 'v1', version: 1, label: 'v1.0 (Aprovado)', dateModified: '2026-08-01T08:00:00Z', size: 1024 * 850, author: 'Prof. Carlos' }
    ]
  }
];

export type UseRepositoryReturn = {
  currentFolder: FolderNode | null;
  breadcrumb: FolderNode[];
  files: FileItem[];
  folders: FolderNode[];
  selectedItems: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  searchQuery: string;
  isLoading: boolean;
  selectedFileForVersions: FileItem | null;
  setCurrentFolder: (folder: FolderNode) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sort: 'name' | 'date' | 'size' | 'type') => void;
  setSearchQuery: (q: string) => void;
  setSelectedFileForVersions: (file: FileItem | null) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  uploadFile: (file: { name: string; size: number; type: string }) => Promise<void>;
  deleteItems: (ids: string[]) => Promise<void>;
  renameItem: (id: string, newName: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  restoreVersion: (fileId: string, versionNumber: number) => Promise<void>;
  addVersion: (fileId: string, notes: string) => Promise<void>;
};

const getBreadcrumb = (nodes: FolderNode[], targetId: string, path: FolderNode[] = []): FolderNode[] | null => {
  for (const node of nodes) {
    if (node.id === targetId) return [...path, node];
    if (node.children.length > 0) {
      const found = getBreadcrumb(node.children, targetId, [...path, node]);
      if (found) return found;
    }
  }
  return null;
};

export function useRepository(): UseRepositoryReturn {
  const [currentFolder, setCurrentFolder] = useState<FolderNode | null>(mockFolders[0]);
  const [folders, setFolders] = useState<FolderNode[]>(mockFolders);
  const [allFiles, setAllFiles] = useState<FileItem[]>(mockFiles);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileForVersions, setSelectedFileForVersions] = useState<FileItem | null>(null);

  const breadcrumb = useMemo(() => {
    if (!currentFolder) return [];
    return getBreadcrumb(folders, currentFolder.id) || [];
  }, [currentFolder, folders]);

  const files = useMemo(() => {
    let filtered = allFiles.filter(f => currentFolder ? f.folderId === currentFolder.id : true);
    if (searchQuery) {
      filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime();
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });
  }, [allFiles, currentFolder, searchQuery, sortBy]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const clearSelection = useCallback(() => setSelectedItems([]), []);

  const createFolder = async (name: string, parentId?: string) => {
    setIsLoading(true);
    const newFolder: FolderNode = { id: `folder-${Date.now()}`, name, children: [] };
    
    setFolders(prev => {
      const addNode = (nodes: FolderNode[]): FolderNode[] => {
        if (!parentId) return [...nodes, newFolder];
        return nodes.map(node => {
          if (node.id === parentId) return { ...node, children: [...node.children, newFolder] };
          return { ...node, children: addNode(node.children) };
        });
      };
      return addNode(prev);
    });
    setIsLoading(false);
  };

  const uploadFile = async (uploaded: { name: string; size: number; type: string }) => {
    setIsLoading(true);
    const ext = uploaded.name.split('.').pop()?.toLowerCase() || 'other';
    const newFileItem: FileItem = {
      id: `file-${Date.now()}`,
      name: uploaded.name,
      type: ext,
      size: uploaded.size || 1024 * 350,
      dateModified: new Date().toISOString(),
      folderId: currentFolder?.id || 'root',
      isFavorite: false,
      owner: 'Prof. Carlos Santos',
      currentVersion: 1,
      versions: [
        {
          id: `v1-${Date.now()}`,
          version: 1,
          label: 'v1.0 (Upload Inicial)',
          dateModified: new Date().toISOString(),
          size: uploaded.size || 1024 * 350,
          author: 'Prof. Carlos Santos',
          notes: 'Arquivo enviado para o repositório.'
        }
      ]
    };

    setAllFiles(prev => [newFileItem, ...prev]);
    setIsLoading(false);
  };

  const deleteItems = async (ids: string[]) => {
    setIsLoading(true);
    setAllFiles(prev => prev.filter(f => !ids.includes(f.id)));
    clearSelection();
    setIsLoading(false);
  };

  const renameItem = async (id: string, newName: string) => {
    setIsLoading(true);
    setAllFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    setIsLoading(false);
  };

  const toggleFavorite = async (id: string) => {
    setAllFiles(prev => prev.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const restoreVersion = async (fileId: string, versionNumber: number) => {
    setIsLoading(true);
    setAllFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          currentVersion: versionNumber,
          dateModified: new Date().toISOString()
        };
      }
      return f;
    }));
    setIsLoading(false);
  };

  const addVersion = async (fileId: string, notes: string) => {
    setIsLoading(true);
    setAllFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        const nextVer = f.currentVersion + 1;
        const newVer: FileVersionItem = {
          id: `v${nextVer}-${Date.now()}`,
          version: nextVer,
          label: `v${nextVer}.0`,
          dateModified: new Date().toISOString(),
          size: f.size + Math.floor(Math.random() * 5000),
          author: 'Prof. Carlos Santos',
          notes
        };
        return {
          ...f,
          currentVersion: nextVer,
          dateModified: new Date().toISOString(),
          versions: [...f.versions, newVer]
        };
      }
      return f;
    }));
    setIsLoading(false);
  };

  return {
    currentFolder, breadcrumb, files, folders, selectedItems, viewMode, sortBy, searchQuery, isLoading,
    selectedFileForVersions,
    setCurrentFolder, setViewMode, setSortBy, setSearchQuery, setSelectedFileForVersions,
    toggleSelection, clearSelection, createFolder, uploadFile, deleteItems, renameItem, toggleFavorite,
    restoreVersion, addVersion
  };
}
