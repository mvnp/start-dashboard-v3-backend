import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Globe, Save, Languages, Plus } from "lucide-react";
import { TranslatableText } from "@/components/translatable-text";

// Comprehensive language options (copied from Settings page)
const LANGUAGES = [
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbekcha' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' }
];

interface Translation {
  id: number;
  string: string;
  traduction: string;
  language: string;
}

export default function Traductions() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [newEnglishString, setNewEnglishString] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load selected language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('traductions-selected-language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  // Save selected language to localStorage
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('traductions-selected-language', language);
    setEditingValues({}); // Clear editing values when language changes
  };

  // Fetch all English translations (source strings)
  const { data: englishTranslations = [], isLoading: isLoadingEnglish } = useQuery<Translation[]>({
    queryKey: ['/api/traductions/en'],
    enabled: true,
  });

  // Fetch translations for selected language
  const { data: targetTranslations = [], isLoading: isLoadingTarget } = useQuery<Translation[]>({
    queryKey: [`/api/traductions/${selectedLanguage}`],
    enabled: !!selectedLanguage && selectedLanguage !== 'en',
  });

  // Create mutation for saving translations
  const saveTranslationMutation = useMutation({
    mutationFn: async ({ englishStringObj, traduction, language }: { englishStringObj: any; traduction: string; language: string }) => {
      return apiRequest('POST', '/api/traductions', {
        string: englishStringObj.string,
        traduction_id: englishStringObj.id,
        traduction,
        language
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/traductions/${selectedLanguage}`] });
      toast({
        title: "Translation saved",
        description: "The translation has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving translation",
        description: error.message || "Failed to save translation",
        variant: "destructive",
      });
    },
  });

  // Create mutation for adding new English strings
  const addEnglishStringMutation = useMutation({
    mutationFn: async (englishString: string) => {
      return apiRequest('POST', '/api/traductions', {
        string: englishString,
        traduction: englishString,
        language: 'en'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/traductions/en'] });
      setNewEnglishString('');
      toast({
        title: "English string added",
        description: "The new English string has been added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding English string",
        description: error.message || "Failed to add English string",
        variant: "destructive",
      });
    },
  });

  // Handle Enter key press to save translation
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, englishString: any) => {
    if (e.key === 'Enter') {
      const value = editingValues[englishString.string] || '';
      if (value.trim() && selectedLanguage) {
        saveTranslationMutation.mutate({
          englishStringObj: englishString,
          traduction: value.trim(),
          language: selectedLanguage
        });
        // Remove from editing values after saving
        setEditingValues(prev => {
          const newValues = { ...prev };
          delete newValues[englishString.string];
          return newValues;
        });
      }
    }
  };

  // Handle Enter key press to add new English string
  const handleAddEnglishString = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = newEnglishString.trim();
      if (value) {
        addEnglishStringMutation.mutate(value);
      }
    }
  };

  // Handle input change
  const handleInputChange = (string: string, value: string) => {
    setEditingValues(prev => ({
      ...prev,
      [string]: value
    }));
  };

  // Get translation value for display
  const getTranslationValue = (string: string) => {
    // If we're editing this string, return the editing value
    if (editingValues[string] !== undefined) {
      return editingValues[string];
    }
    
    // Otherwise, return the saved translation or empty string
    const translation = targetTranslations.find(t => t.string === string);
    return translation?.traduction || '';
  };

  const isLoading = isLoadingEnglish || (selectedLanguage && selectedLanguage !== 'en' && isLoadingTarget);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Languages className="h-8 w-8 text-barber-primary" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <TranslatableText>Translation Management</TranslatableText>
          </h1>
          <p className="text-slate-600">
            <TranslatableText>Manage translations for different languages</TranslatableText>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <TranslatableText>Language Selection</TranslatableText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language to translate" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.filter(lang => lang.code !== 'en').map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name} ({language.nativeName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedLanguage && (
              <div className="text-sm text-slate-600">
                <TranslatableText>Translating to</TranslatableText>: {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add New English String Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <TranslatableText>Add New English String</TranslatableText>
          </CardTitle>
          <p className="text-sm text-slate-600">
            <TranslatableText>Enter a new English string to add to the translation database. Press Enter to save.</TranslatableText>
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter new English string..."
                value={newEnglishString}
                onChange={(e) => setNewEnglishString(e.target.value)}
                onKeyPress={handleAddEnglishString}
                disabled={addEnglishStringMutation.isPending}
              />
            </div>
            {addEnglishStringMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <TranslatableText>Adding...</TranslatableText>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedLanguage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              <TranslatableText>Translations</TranslatableText>
              <span className="text-sm font-normal text-slate-500">
                ({englishTranslations.length} <TranslatableText>strings</TranslatableText>)
              </span>
            </CardTitle>
            <p className="text-sm text-slate-600">
              <TranslatableText>Press Enter to save a translation</TranslatableText>
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">
                        <TranslatableText>English (Source)</TranslatableText>
                      </TableHead>
                      <TableHead className="w-1/2">
                        <TranslatableText>Translation</TranslatableText> ({LANGUAGES.find(l => l.code === selectedLanguage)?.name})
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {englishTranslations.map((englishTranslation) => (
                      <TableRow key={englishTranslation.id}>
                        <TableCell className="font-medium">
                          {englishTranslation.string}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={getTranslationValue(englishTranslation.string)}
                            onChange={(e) => handleInputChange(englishTranslation.string, e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, englishTranslation)}
                            placeholder={`Enter ${LANGUAGES.find(l => l.code === selectedLanguage)?.name} translation...`}
                            className="w-full"
                            disabled={saveTranslationMutation.isPending}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedLanguage && (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              <TranslatableText>No Language Selected</TranslatableText>
            </h3>
            <p className="text-slate-600">
              <TranslatableText>Please select a language above to start managing translations</TranslatableText>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}