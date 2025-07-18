import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertSettingsSchema, type Settings } from "@shared/schema";
import { Save, Globe, Clock, DollarSign, Edit3, Settings as SettingsIcon } from "lucide-react";
import { useEdition } from "@/lib/edition-context";
import { TranslatableText } from "@/components/translatable-text";
import { useTranslationHelper } from "@/lib/translation-helper";
import { Switch } from "@/components/ui/switch";
import { useBusinessContext } from "@/hooks/use-business-context";
import { useBusinessLanguage } from "@/lib/business-language-context";

// Comprehensive language options (sorted alphabetically by English name)
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
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'my', name: 'Myanmar', nativeName: 'မြန်မာ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
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
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' }
];

// Comprehensive timezone options (sorted alphabetically by label)
const TIMEZONES = [
  { value: 'America/Anchorage', label: 'Alaska Time' },
  { value: 'Asia/Riyadh', label: 'Arabia Standard Time' },
  { value: 'Asia/Baghdad', label: 'Arabia Standard Time (Iraq)' },
  { value: 'Asia/Kuwait', label: 'Arabia Standard Time (Kuwait)' },
  { value: 'Asia/Qatar', label: 'Arabia Standard Time (Qatar)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina Time' },
  { value: 'Asia/Dhaka', label: 'Bangladesh Time' },
  { value: 'America/Sao_Paulo', label: 'Brasília Time' },
  { value: 'Europe/Amsterdam', label: 'Central European Time (Netherlands)' },
  { value: 'Europe/Vienna', label: 'Central European Time (Austria)' },
  { value: 'Europe/Brussels', label: 'Central European Time (Belgium)' },
  { value: 'Europe/Zagreb', label: 'Central European Time (Croatia)' },
  { value: 'Europe/Prague', label: 'Central European Time (Czech Republic)' },
  { value: 'Europe/Copenhagen', label: 'Central European Time (Denmark)' },
  { value: 'Europe/Paris', label: 'Central European Time (France)' },
  { value: 'Europe/Berlin', label: 'Central European Time (Germany)' },
  { value: 'Europe/Budapest', label: 'Central European Time (Hungary)' },
  { value: 'Europe/Rome', label: 'Central European Time (Italy)' },
  { value: 'Europe/Oslo', label: 'Central European Time (Norway)' },
  { value: 'Europe/Warsaw', label: 'Central European Time (Poland)' },
  { value: 'Europe/Belgrade', label: 'Central European Time (Serbia)' },
  { value: 'Europe/Bratislava', label: 'Central European Time (Slovakia)' },
  { value: 'Europe/Ljubljana', label: 'Central European Time (Slovenia)' },
  { value: 'Europe/Madrid', label: 'Central European Time (Spain)' },
  { value: 'Europe/Stockholm', label: 'Central European Time (Sweden)' },
  { value: 'Europe/Zurich', label: 'Central European Time (Switzerland)' },
  { value: 'America/Mexico_City', label: 'Central Standard Time (Mexico)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time' },
  { value: 'Europe/Athens', label: 'Eastern European Time (Greece)' },
  { value: 'Europe/Helsinki', label: 'Eastern European Time (Finland)' },
  { value: 'Europe/Bucharest', label: 'Eastern European Time (Romania)' },
  { value: 'Europe/Sofia', label: 'Eastern European Time (Bulgaria)' },
  { value: 'Europe/Kiev', label: 'Eastern European Time (Ukraine)' },
  { value: 'America/Toronto', label: 'Eastern Standard Time (Canada)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (UK)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time' },
  { value: 'Asia/Kolkata', label: 'India Standard Time' },
  { value: 'Asia/Bangkok', label: 'Indochina Time' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Indochina Time (Vietnam)' },
  { value: 'Asia/Tehran', label: 'Iran Standard Time' },
  { value: 'Asia/Jerusalem', label: 'Israel Standard Time' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time' },
  { value: 'Asia/Kuala_Lumpur', label: 'Malaysia Time' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'Europe/Moscow', label: 'Moscow Standard Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Vancouver', label: 'Pacific Standard Time (Canada)' },
  { value: 'Asia/Karachi', label: 'Pakistan Standard Time' },
  { value: 'Asia/Manila', label: 'Philippine Time' },
  { value: 'Asia/Singapore', label: 'Singapore Time' },
  { value: 'Asia/Taipei', label: 'Taiwan Time' },
  { value: 'Europe/Istanbul', label: 'Turkey Time' },
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'Asia/Jakarta', label: 'Western Indonesian Time' },
  { value: 'Asia/Bahrain', label: 'Arabia Standard Time (Bahrain)' },
  { value: 'Asia/Muscat', label: 'Gulf Standard Time (Oman)' },
  { value: 'Asia/Baku', label: 'Azerbaijan Time' },
  { value: 'Asia/Yerevan', label: 'Armenia Time' },
  { value: 'Asia/Tbilisi', label: 'Georgia Time' },
  { value: 'Asia/Almaty', label: 'Almaty Time' },
  { value: 'Asia/Tashkent', label: 'Uzbekistan Time' },
  { value: 'Asia/Bishkek', label: 'Kyrgyzstan Time' },
  { value: 'Asia/Dushanbe', label: 'Tajikistan Time' },
  { value: 'Asia/Ashgabat', label: 'Turkmenistan Time' },
  { value: 'Asia/Kabul', label: 'Afghanistan Time' },
  { value: 'Asia/Kathmandu', label: 'Nepal Time' },
  { value: 'Asia/Colombo', label: 'Sri Lanka Time' },
  { value: 'Asia/Yangon', label: 'Myanmar Time' },
  { value: 'Asia/Phnom_Penh', label: 'Indochina Time (Cambodia)' },
  { value: 'Asia/Vientiane', label: 'Indochina Time (Laos)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time' },
  { value: 'Australia/Melbourne', label: 'Australian Eastern Time (Victoria)' },
  { value: 'Australia/Brisbane', label: 'Australian Eastern Time (Queensland)' },
  { value: 'Australia/Perth', label: 'Australian Western Time' },
  { value: 'Australia/Adelaide', label: 'Australian Central Time' },
  { value: 'Australia/Darwin', label: 'Australian Central Time (Northern Territory)' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time' },
  { value: 'Pacific/Fiji', label: 'Fiji Time' },
  { value: 'Pacific/Tahiti', label: 'Tahiti Time' },
  { value: 'Pacific/Guam', label: 'Chamorro Time' },
  { value: 'Africa/Cairo', label: 'Eastern European Time (Egypt)' },
  { value: 'Africa/Johannesburg', label: 'South Africa Time' },
  { value: 'Africa/Lagos', label: 'West Africa Time (Nigeria)' },
  { value: 'Africa/Nairobi', label: 'East Africa Time (Kenya)' },
  { value: 'Africa/Casablanca', label: 'Western European Time (Morocco)' },
  { value: 'Africa/Algiers', label: 'Central European Time (Algeria)' },
  { value: 'Africa/Tunis', label: 'Central European Time (Tunisia)' },
  { value: 'Africa/Tripoli', label: 'Eastern European Time (Libya)' },
  { value: 'Africa/Addis_Ababa', label: 'East Africa Time (Ethiopia)' },
  { value: 'Africa/Dar_es_Salaam', label: 'East Africa Time (Tanzania)' },
  { value: 'Africa/Kampala', label: 'East Africa Time (Uganda)' },
  { value: 'Africa/Kigali', label: 'Central Africa Time (Rwanda)' },
  { value: 'Africa/Lusaka', label: 'Central Africa Time (Zambia)' },
  { value: 'Africa/Harare', label: 'Central Africa Time (Zimbabwe)' },
  { value: 'Africa/Maputo', label: 'Central Africa Time (Mozambique)' },
  { value: 'Africa/Windhoek', label: 'Central Africa Time (Namibia)' },
  { value: 'Africa/Gaborone', label: 'Central Africa Time (Botswana)' },
  { value: 'Atlantic/Reykjavik', label: 'Greenwich Mean Time (Iceland)' },
  { value: 'Atlantic/Azores', label: 'Azores Time' },
  { value: 'Atlantic/Cape_Verde', label: 'Cape Verde Time' }
];

// Comprehensive currency options (sorted alphabetically by name)
const CURRENCIES = [
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: '.ރ' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SYP', name: 'Syrian Pound', symbol: '£' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' }
];

const formSchema = insertSettingsSchema.omit({ business_id: true });

export default function Settings() {
  const { toast } = useToast();
  const { t } = useTranslationHelper();
  const queryClient = useQueryClient();
  const { isEditionMode, toggleEditionMode, canEdit } = useEdition();
  const { selectedBusinessId, updateBusinessLanguage } = useBusinessContext();
  const { loadBusinessLanguage } = useBusinessLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
    },
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', selectedBusinessId],
    enabled: !!selectedBusinessId && selectedBusinessId > 0 && localStorage.getItem('x-selected-business-id') !== null,
    queryFn: () => {
      // Double-check business context is available before making request
      const businessId = localStorage.getItem('x-selected-business-id');
      if (!businessId || !selectedBusinessId) {
        throw new Error('Business context not available');
      }
      return apiRequest("GET", "/api/settings");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => apiRequest("PUT", "/api/settings", data),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings', selectedBusinessId] });
      
      // Always check if language was included in the update
      if (variables.language) {
        // Update all localStorage and sessionStorage keys immediately for ANY language change
        localStorage.setItem('x-selected-business-language', variables.language);
        sessionStorage.setItem('x-selected-business-language', variables.language);
        localStorage.setItem('traductions-selected-language', variables.language);
        sessionStorage.setItem('traductions-selected-language', variables.language);
        
        // Update business language context immediately
        updateBusinessLanguage(variables.language);
        
        // Load translations for the new language immediately
        if (selectedBusinessId) {
          await loadBusinessLanguage(selectedBusinessId, variables.language);
        }
        
        // Always reload the page to apply all language changes immediately (including English)
        setTimeout(() => {
          window.location.reload();
        }, 500);
        
        toast({
          title: t("Settings updated"),
          description: `Language changed to ${LANGUAGES.find(l => l.code === variables.language)?.name || variables.language}. Translations applied immediately.`,
        });
      } else {
        toast({
          title: t("Settings updated"),
          description: t("Your business settings have been saved successfully."),
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: t("Error"),
        description: error.message || t("Failed to update settings"),
        variant: "destructive",
      });
    },
  });

  // Update form when settings data is loaded
  React.useEffect(() => {
    if (settings && typeof settings === 'object') {
      form.reset({
        language: (settings as any).language || 'en',
        timezone: (settings as any).timezone || 'UTC',
        currency: (settings as any).currency || 'USD',
      });
    }
  }, [settings, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            <TranslatableText>Settings</TranslatableText>
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-10 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Standard SaaS Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-barber-primary rounded-lg">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              <TranslatableText>Business Settings</TranslatableText>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              <TranslatableText>Configure your business language, timezone, and currency preferences</TranslatableText>
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-3 mt-2">
            <Edit3 className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-600">
              <TranslatableText>Edition Mode</TranslatableText>
            </span>
            <Switch 
              checked={isEditionMode} 
              onCheckedChange={toggleEditionMode}
              className="data-[state=checked]:bg-barber-primary"
            />
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-barber-primary" />
                  <TranslatableText>Language Settings</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Display Language</TranslatableText>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {LANGUAGES.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name} ({language.nativeName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Timezone Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-barber-primary" />
                  <TranslatableText>Timezone Settings</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Business Timezone</TranslatableText>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {TIMEZONES.map((timezone) => (
                            <SelectItem key={timezone.value} value={timezone.value}>
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-barber-primary" />
                  <TranslatableText>Currency Settings</TranslatableText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <TranslatableText>Business Currency</TranslatableText>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name} ({currency.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-barber-primary hover:bg-barber-secondary text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? <TranslatableText>Saving...</TranslatableText> : <TranslatableText>Save Settings</TranslatableText>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}