import React, { useState, useEffect } from 'react';
import { Folder, Search, Tag, FileText, Plus, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FolderTree from '@/components/FolderTree';
import NoteEditor from '@/components/NoteEditor';
import SearchResults from '@/components/SearchResults';
import TagManager from '@/components/TagManager';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface FolderType {
  id: string;
  name: string;
  parentId: string | null;
  children: string[];
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([
    { id: 'root', name: 'My Notes', parentId: null, children: [] }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('notes');

  // Initialize with sample data
  useEffect(() => {
    const sampleFolders: FolderType[] = [
      { id: 'root', name: 'My Notes', parentId: null, children: ['journal', 'ideas'] },
      { id: 'journal', name: '🌱 Daily Journal', parentId: 'root', children: [] },
      { id: 'ideas', name: '💡 Creative Ideas', parentId: 'root', children: [] }
    ];
    
    const sampleNotes: Note[] = [
      {
        id: '1',
        title: 'Welcome to Your Ghibli Notes Garden',
        content: `# Welcome to Your Magical Notes Garden 🌿

Just like the enchanted forests in Studio Ghibli films, this is your personal space to cultivate thoughts, dreams, and ideas.

## Features
- **Folder Organization**: Create nested folders like building a cozy treehouse
- **Tags**: Label your thoughts like pressed flowers in a journal  
- **Search**: Find any note as easily as Totoro finds acorns
- **Markdown**: Write beautifully formatted notes

## Getting Started
1. Create new folders to organize your thoughts
2. Add tags to categorize your notes
3. Use the search to find anything instantly
4. Write in markdown for beautiful formatting

*May your notes bloom like the gardens of Howl's Moving Castle* ✨`,
        folderId: 'root',
        tags: ['welcome', 'guide'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setFolders(sampleFolders);
    setNotes(sampleNotes);
    setSelectedNote(sampleNotes[0]);
  }, []);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '# New Note\n\nStart writing your thoughts here...',
      folderId: selectedFolder,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setActiveTab('editor');
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date() } : note
    ));
    setSelectedNote(updatedNote);
  };

  const filteredNotes = notes.filter(note => {
    const matchesFolder = selectedFolder === 'root' || note.folderId === selectedFolder;
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghibli-cream via-ghibli-sky/20 to-ghibli-sage/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-ghibli-sage/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ghibli-forest flex items-center gap-2">
            🌿 Ghibli Notes Garden
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ghibli-moss w-4 h-4" />
              <Input
                placeholder="Search your garden..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 ghibli-input"
              />
            </div>
            <Button onClick={createNewNote} className="ghibli-button">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6 min-h-[calc(100vh-100px)]">
        {/* Sidebar */}
        <div className="col-span-3 space-y-4">
          <Card className="ghibli-card">
            <CardHeader>
              <CardTitle className="text-ghibli-forest flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Folders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FolderTree 
                folders={folders}
                selectedFolder={selectedFolder}
                onSelectFolder={setSelectedFolder}
                onUpdateFolders={setFolders}
              />
            </CardContent>
          </Card>

          <Card className="ghibli-card">
            <CardHeader>
              <CardTitle className="text-ghibli-forest flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Notes ({filteredNotes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setActiveTab('editor');
                  }}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-200 ${
                    selectedNote?.id === note.id 
                      ? 'bg-ghibli-sage/20 border border-ghibli-sage' 
                      : 'hover:bg-ghibli-mist/50'
                  }`}
                >
                  <h4 className="font-medium text-ghibli-forest truncate">{note.title}</h4>
                  <p className="text-sm text-ghibli-moss truncate mt-1">
                    {note.content.substring(0, 50)}...
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {note.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="ghibli-tag text-xs">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="text-xs text-ghibli-moss">+{note.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 border border-ghibli-sage/30 rounded-xl">
              <TabsTrigger value="notes" className="data-[state=active]:bg-ghibli-sage data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="editor" className="data-[state=active]:bg-ghibli-sage data-[state=active]:text-white">
                <Edit3 className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="search" className="data-[state=active]:bg-ghibli-sage data-[state=active]:text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="mt-6">
              <Card className="ghibli-card h-[600px]">
                <CardContent className="p-6">
                  {selectedNote ? (
                    <div className="h-full overflow-y-auto">
                      <div className="prose prose-lg max-w-none text-ghibli-forest">
                        <h1 className="text-ghibli-forest mb-4">{selectedNote.title}</h1>
                        <div className="whitespace-pre-wrap font-mono text-sm bg-ghibli-mist/30 p-4 rounded-lg">
                          {selectedNote.content}
                        </div>
                        {selectedNote.tags.length > 0 && (
                          <div className="flex gap-2 mt-6 flex-wrap">
                            {selectedNote.tags.map(tag => (
                              <span key={tag} className="ghibli-tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-ghibli-moss">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Select a note to read</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="editor" className="mt-6">
              <NoteEditor 
                note={selectedNote}
                onUpdateNote={updateNote}
                folders={folders}
              />
            </TabsContent>

            <TabsContent value="search" className="mt-6">
              <SearchResults 
                notes={notes}
                searchQuery={searchQuery}
                onSelectNote={(note) => {
                  setSelectedNote(note);
                  setActiveTab('editor');
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
