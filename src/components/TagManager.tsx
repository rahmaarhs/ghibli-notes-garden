
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, X } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TagManagerProps {
  notes: Note[];
  onUpdateNotes: (notes: Note[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ notes, onUpdateNotes }) => {
  const [newTag, setNewTag] = useState('');

  // Get all unique tags from all notes
  const getAllTags = () => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  // Get count of notes for each tag
  const getTagCount = (tag: string) => {
    return notes.filter(note => note.tags.includes(tag)).length;
  };

  const addGlobalTag = () => {
    if (!newTag.trim()) return;
    
    // This component is more for viewing/managing existing tags
    // Individual tag addition happens in the NoteEditor
    setNewTag('');
  };

  const removeTagFromAllNotes = (tagToRemove: string) => {
    const updatedNotes = notes.map(note => ({
      ...note,
      tags: note.tags.filter(tag => tag !== tagToRemove),
      updatedAt: new Date()
    }));
    
    onUpdateNotes(updatedNotes);
  };

  const allTags = getAllTags();

  return (
    <Card className="ghibli-card">
      <CardHeader>
        <CardTitle className="text-ghibli-forest flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Tag Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add new tag */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Create new tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addGlobalTag();
              }
            }}
            className="flex-1 ghibli-input"
          />
          <Button onClick={addGlobalTag} variant="outline" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Tag list */}
        {allTags.length === 0 ? (
          <div className="text-center py-8 text-ghibli-moss">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No tags yet. Create some tags while editing notes!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allTags.map(tag => (
              <div
                key={tag}
                className="flex items-center justify-between p-3 rounded-lg bg-ghibli-mist/30 hover:bg-ghibli-sage/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="ghibli-tag">
                    {tag}
                  </Badge>
                  <span className="text-sm text-ghibli-moss">
                    {getTagCount(tag)} note{getTagCount(tag) !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTagFromAllNotes(tag)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TagManager;
