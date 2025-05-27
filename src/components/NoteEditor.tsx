
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Tag, X, Eye, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (note: Note) => void;
  folders: FolderType[];
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote, folders }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState('split');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    }
  }, [note]);

  const handleSave = () => {
    if (!note) return;
    
    const updatedNote: Note = {
      ...note,
      title,
      content,
      tags,
      updatedAt: new Date()
    };
    
    onUpdateNote(updatedNote);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-ghibli-forest mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-ghibli-forest mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-ghibli-forest mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-ghibli-forest">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-ghibli-moss">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-ghibli-mist px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br>');
  };

  if (!note) {
    return (
      <Card className="ghibli-card h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-ghibli-moss">
            <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Select or create a note to start editing</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ghibli-card h-[600px]">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold border-none shadow-none bg-transparent text-ghibli-forest placeholder:text-ghibli-moss/50"
            placeholder="Note title..."
          />
          <div className="flex items-center gap-2">
            <Tabs value={previewMode} onValueChange={setPreviewMode}>
              <TabsList className="bg-ghibli-mist/50">
                <TabsTrigger value="edit" className="data-[state=active]:bg-white">
                  <Edit className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="split" className="data-[state=active]:bg-white">
                  Split
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-white">
                  <Eye className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={handleSave} className="ghibli-button">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="ghibli-tag flex items-center gap-1"
              >
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 ghibli-input"
            />
            <Button onClick={addTag} variant="outline" size="sm">
              <Tag className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Editor/Preview */}
        <div className="flex-1 min-h-0">
          {previewMode === 'edit' && (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note in markdown..."
              className="w-full h-full resize-none ghibli-input font-mono text-sm"
            />
          )}

          {previewMode === 'preview' && (
            <div className="w-full h-full overflow-y-auto">
              <div
                className="prose prose-lg max-w-none text-ghibli-forest"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(content)
                }}
              />
            </div>
          )}

          {previewMode === 'split' && (
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="border-r border-ghibli-sage/30 pr-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write in markdown..."
                  className="w-full h-full resize-none ghibli-input font-mono text-sm"
                />
              </div>
              <div className="overflow-y-auto pl-4">
                <div
                  className="prose prose-lg max-w-none text-ghibli-forest"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(content)
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 text-sm text-ghibli-moss">
          Last updated: {note.updatedAt.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteEditor;
