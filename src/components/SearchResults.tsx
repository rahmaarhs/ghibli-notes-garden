
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SearchResultsProps {
  notes: Note[];
  searchQuery: string;
  onSelectNote: (note: Note) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  notes,
  searchQuery,
  onSelectNote
}) => {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-ghibli-sunset/30 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getSearchResults = () => {
    if (!searchQuery) return notes;
    
    return notes.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return titleMatch || contentMatch || tagMatch;
    });
  };

  const searchResults = getSearchResults();

  return (
    <div className="space-y-4">
      <Card className="ghibli-card">
        <CardHeader>
          <CardTitle className="text-ghibli-forest flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Results ({searchResults.length})
            {searchQuery && (
              <span className="text-sm font-normal text-ghibli-moss">
                for "{searchQuery}"
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      {searchResults.length === 0 ? (
        <Card className="ghibli-card">
          <CardContent className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-ghibli-moss opacity-50" />
            <p className="text-lg text-ghibli-moss">
              {searchQuery ? 'No notes found' : 'Enter a search query to find notes'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {searchResults.map(note => {
            const contentPreview = note.content.substring(0, 200);
            
            return (
              <Card
                key={note.id}
                className="ghibli-card cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => onSelectNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-ghibli-forest">
                      {highlightText(note.title, searchQuery)}
                    </h3>
                    <FileText className="w-5 h-5 text-ghibli-moss flex-shrink-0" />
                  </div>
                  
                  <p className="text-ghibli-moss mb-3 leading-relaxed">
                    {highlightText(contentPreview, searchQuery)}
                    {note.content.length > 200 && '...'}
                  </p>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {note.tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="ghibli-tag text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {highlightText(tag, searchQuery)}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-ghibli-moss/70">
                    Updated: {note.updatedAt.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
