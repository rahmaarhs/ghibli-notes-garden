
import React, { useState } from 'react';
import { Folder, FolderOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FolderType {
  id: string;
  name: string;
  parentId: string | null;
  children: string[];
}

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolder: string;
  onSelectFolder: (folderId: string) => void;
  onUpdateFolders: (folders: FolderType[]) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
  onUpdateFolders
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const createFolder = (parentId: string) => {
    const newFolder: FolderType = {
      id: Date.now().toString(),
      name: 'New Folder',
      parentId,
      children: []
    };

    const updatedFolders = folders.map(folder => {
      if (folder.id === parentId) {
        return { ...folder, children: [...folder.children, newFolder.id] };
      }
      return folder;
    });

    onUpdateFolders([...updatedFolders, newFolder]);
    setEditingFolder(newFolder.id);
    setNewFolderName('New Folder');
  };

  const renameFolder = (folderId: string, newName: string) => {
    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, name: newName };
      }
      return folder;
    });
    onUpdateFolders(updatedFolders);
    setEditingFolder(null);
    setNewFolderName('');
  };

  const deleteFolder = (folderId: string) => {
    if (folderId === 'root') return;
    
    const folderToDelete = folders.find(f => f.id === folderId);
    if (!folderToDelete) return;

    // Remove from parent's children
    const updatedFolders = folders
      .map(folder => {
        if (folder.id === folderToDelete.parentId) {
          return { 
            ...folder, 
            children: folder.children.filter(childId => childId !== folderId) 
          };
        }
        return folder;
      })
      .filter(folder => folder.id !== folderId);

    onUpdateFolders(updatedFolders);
    
    if (selectedFolder === folderId) {
      onSelectFolder('root');
    }
  };

  const renderFolder = (folder: FolderType, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolder === folder.id;
    const hasChildren = folder.children.length > 0;

    return (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 group ${
            isSelected ? 'bg-ghibli-sage/20 border border-ghibli-sage' : 'hover:bg-ghibli-mist/30'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <div
            onClick={() => hasChildren && toggleFolder(folder.id)}
            className="flex items-center gap-1 flex-1"
          >
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 text-ghibli-moss" />
              ) : (
                <Folder className="w-4 h-4 text-ghibli-moss" />
              )
            ) : (
              <Folder className="w-4 h-4 text-ghibli-moss" />
            )}
            
            {editingFolder === folder.id ? (
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => renameFolder(folder.id, newFolderName)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    renameFolder(folder.id, newFolderName);
                  } else if (e.key === 'Escape') {
                    setEditingFolder(null);
                  }
                }}
                className="flex-1 h-6 px-2 text-sm ghibli-input"
                autoFocus
              />
            ) : (
              <span
                onClick={() => onSelectFolder(folder.id)}
                className="text-sm text-ghibli-forest hover:text-ghibli-moss transition-colors flex-1"
              >
                {folder.name}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => createFolder(folder.id)}
              className="h-6 w-6 p-0 hover:bg-ghibli-sage/20"
            >
              <Plus className="w-3 h-3" />
            </Button>
            {folder.id !== 'root' && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingFolder(folder.id);
                    setNewFolderName(folder.name);
                  }}
                  className="h-6 w-6 p-0 hover:bg-ghibli-sage/20"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteFolder(folder.id)}
                  className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div className="ml-2">
            {folder.children.map(childId => {
              const childFolder = folders.find(f => f.id === childId);
              return childFolder ? renderFolder(childFolder, level + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  const rootFolder = folders.find(f => f.id === 'root');
  if (!rootFolder) return null;

  return (
    <div className="space-y-1">
      {renderFolder(rootFolder)}
    </div>
  );
};

export default FolderTree;
