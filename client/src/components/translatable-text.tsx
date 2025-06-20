import React, { useState } from 'react';
import { useEdition } from '@/lib/edition-context';
import { useBusinessLanguage } from '@/lib/business-language-context';
import { useBusinessContext } from '@/hooks/use-business-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Edit3 } from 'lucide-react';

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
  // Handle case where component renders before providers are ready
  let editionContext;
  let businessLanguage;
  let businessContext;
  
  try {
    editionContext = useEdition();
  } catch (error) {
    // EditionProvider not available, use fallback values
    editionContext = {
      isEditionMode: false,
      canEdit: false
    };
  }
  
  try {
    businessLanguage = useBusinessLanguage();
  } catch (error) {
    // BusinessLanguageProvider not available, use fallback
    businessLanguage = {
      translations: {},
      getTranslation: (text: string) => text,
      isLoading: false,
      refreshTranslations: async () => {}
    };
  }

  try {
    businessContext = useBusinessContext();
  } catch (error) {
    // BusinessContext not available, use fallback
    businessContext = {
      selectedBusinessLanguage: 'en'
    };
  }
  
  const { isEditionMode, canEdit } = editionContext;
  const { getTranslation } = businessLanguage;
  const { selectedBusinessLanguage } = businessContext;
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const queryClient = useQueryClient();

  // Use business language translation system
  const displayText = getTranslation(children);
  
  // Use selected business language for editing
  const editingLanguage = selectedBusinessLanguage || 'en';

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
    enabled: isEditionMode && canEdit && isEditing,
  });

  // Mutation to save translation
  const saveTranslation = useMutation({
    mutationFn: async (traduction: string) => {
      if (!englishString?.id) {
        throw new Error('English string not found');
      }

      const response = await fetch('/api/traductions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          traduction_id: englishString.id,
          traduction,
          language: editingLanguage,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate translation cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      // Refresh business language translations
      businessLanguage.refreshTranslations();
      toast({ title: "Translation saved successfully" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error saving translation", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleEdit = () => {
    setEditValue(displayText);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue !== displayText) {
      saveTranslation.mutate(editValue);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Tag className={className}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={handleSave}
          className="bg-transparent border-b border-dashed border-blue-500 outline-none min-w-[100px] w-full"
          autoFocus
        />
      </Tag>
    );
  }

  // Only show edit icon for non-English languages when edition mode is active
  const showEditIcon = isEditionMode && canEdit && editingLanguage !== 'en';

  return (
    <Tag 
      className={`${className} ${showEditIcon ? 'group inline-flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded px-1 cursor-pointer' : ''}`}
      onClick={showEditIcon ? handleEdit : undefined}
    >
      {displayText}
      {showEditIcon && (
        <Edit3 
          size={12} 
          className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
        />
      )}
    </Tag>
  );
}