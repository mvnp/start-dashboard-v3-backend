import { useState, KeyboardEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pen } from 'lucide-react';
import { useEdition } from '@/lib/edition-context';
import { useTranslationCache } from '@/lib/translation-cache';
import { useToast } from '@/hooks/use-toast';

interface TranslatableTextProps {
  children: string;
  className?: string;
  tag?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
}

export function TranslatableText({ 
  children, 
  className = '', 
  tag: Tag = 'span' 
}: TranslatableTextProps) {
  const { isEditionMode, currentLanguage, canEdit } = useEdition();
  const { getTranslation } = useTranslationCache();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Get cached translation instead of making individual API calls
  const displayText = getTranslation(children, currentLanguage);

  // Fetch English string to get the ID for foreign key relationship (only when editing)
  const { data: englishString } = useQuery({
    queryKey: ['englishString', children],
    queryFn: async () => {
      const response = await fetch(`/api/traductions/${encodeURIComponent(children)}/en`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) return null;
      return response.json();
    },
    enabled: isEditionMode && canEdit,
  });

  // Mutation to save translation with business context and foreign key
  const saveTranslation = useMutation({
    mutationFn: async (traduction: string) => {
      if (!englishString?.id) {
        throw new Error('English string ID not found');
      }
      
      const response = await fetch('/api/traductions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          // No business context needed
        },
        body: JSON.stringify({
          string: children,
          traduction_id: englishString.id,
          traduction,
          language: currentLanguage,
        }),
      });
      if (!response.ok) throw new Error('Failed to save translation');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("Translation saved"),
        description: t("The translation has been saved successfully."),
      });
      setIsEditing(false);
      // Reload the page to refresh cached translations
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save translation.",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = () => {
    setEditValue(displayText);
    setIsEditing(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editValue.trim() && editValue !== children) {
        saveTranslation.mutate(editValue.trim());
      } else {
        setIsEditing(false);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (editValue.trim() && editValue !== children) {
      saveTranslation.mutate(editValue.trim());
    } else {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600 rounded px-1 ${className}`}
        autoFocus
        disabled={saveTranslation.isPending}
      />
    );
  }

  // Determine if this should be block or inline-block based on the tag
  const isBlockElement = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div'].includes(Tag);
  const displayClass = isBlockElement ? 'block' : 'inline-block';

  return (
    <Tag className={`relative ${displayClass} group ${className}`}>
      {displayText}
      {isEditionMode && canEdit && (
        <button
          onClick={handleEditClick}
          className="inline-flex items-center justify-center ml-1 opacity-0 group-hover:opacity-100 transition-opacity w-3 h-3 text-blue-500 hover:text-blue-700"
          title="Edit translation"
        >
          <Pen className="w-2.5 h-2.5" />
        </button>
      )}
    </Tag>
  );
}