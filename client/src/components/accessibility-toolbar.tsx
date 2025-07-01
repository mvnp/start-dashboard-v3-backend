import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Accessibility, 
  Type, 
  Eye, 
  Volume2, 
  Contrast, 
  MousePointer, 
  Keyboard,
  Settings,
  X,
  RotateCcw
} from "lucide-react";
import { TranslatableText } from "@/components/translatable-text";

interface AccessibilitySettings {
  fontSize: number;
  contrast: 'normal' | 'high' | 'inverted';
  reducedMotion: boolean;
  largerClickTargets: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;
  focusOutlines: boolean;
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  contrast: 'normal',
  reducedMotion: false,
  largerClickTargets: false,
  keyboardNavigation: true,
  screenReader: false,
  focusOutlines: true,
  colorBlindSupport: 'none'
};

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage and apply them
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--accessibility-font-scale', `${settings.fontSize / 100}`);
    
    // Contrast
    root.classList.remove('accessibility-high-contrast', 'accessibility-inverted');
    if (settings.contrast === 'high') {
      root.classList.add('accessibility-high-contrast');
    } else if (settings.contrast === 'inverted') {
      root.classList.add('accessibility-inverted');
    }
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }
    
    // Larger click targets
    if (settings.largerClickTargets) {
      root.classList.add('accessibility-large-targets');
    } else {
      root.classList.remove('accessibility-large-targets');
    }
    
    // Focus outlines
    if (settings.focusOutlines) {
      root.classList.add('accessibility-focus-outlines');
    } else {
      root.classList.remove('accessibility-focus-outlines');
    }
    
    // Color blind support
    root.classList.remove('accessibility-protanopia', 'accessibility-deuteranopia', 'accessibility-tritanopia');
    if (settings.colorBlindSupport !== 'none') {
      root.classList.add(`accessibility-${settings.colorBlindSupport}`);
    }
    
    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add('accessibility-keyboard-nav');
    } else {
      root.classList.remove('accessibility-keyboard-nav');
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
        aria-label="Open accessibility settings"
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-80 max-h-96 overflow-y-auto shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                <h3 className="font-semibold">
                  <TranslatableText>Accessibility Settings</TranslatableText>
                </h3>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSettings}
                  className="p-1"
                  aria-label="Reset accessibility settings"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1"
                  aria-label="Close accessibility settings"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  <Label className="text-sm">
                    <TranslatableText>Font Size</TranslatableText> ({settings.fontSize}%)
                  </Label>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([value]) => updateSetting('fontSize', value)}
                  min={80}
                  max={200}
                  step={10}
                  className="w-full"
                  aria-label="Adjust font size"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Contrast className="w-4 h-4" />
                  <Label className="text-sm">
                    <TranslatableText>Contrast</TranslatableText>
                  </Label>
                </div>
                <Select
                  value={settings.contrast}
                  onValueChange={(value: AccessibilitySettings['contrast']) => 
                    updateSetting('contrast', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">
                      <TranslatableText>Normal</TranslatableText>
                    </SelectItem>
                    <SelectItem value="high">
                      <TranslatableText>High Contrast</TranslatableText>
                    </SelectItem>
                    <SelectItem value="inverted">
                      <TranslatableText>Inverted Colors</TranslatableText>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Blind Support */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <Label className="text-sm">
                    <TranslatableText>Color Blind Support</TranslatableText>
                  </Label>
                </div>
                <Select
                  value={settings.colorBlindSupport}
                  onValueChange={(value: AccessibilitySettings['colorBlindSupport']) => 
                    updateSetting('colorBlindSupport', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <TranslatableText>None</TranslatableText>
                    </SelectItem>
                    <SelectItem value="protanopia">
                      <TranslatableText>Protanopia (Red-blind)</TranslatableText>
                    </SelectItem>
                    <SelectItem value="deuteranopia">
                      <TranslatableText>Deuteranopia (Green-blind)</TranslatableText>
                    </SelectItem>
                    <SelectItem value="tritanopia">
                      <TranslatableText>Tritanopia (Blue-blind)</TranslatableText>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4" />
                    <Label className="text-sm">
                      <TranslatableText>Larger Click Targets</TranslatableText>
                    </Label>
                  </div>
                  <Switch
                    checked={settings.largerClickTargets}
                    onCheckedChange={(checked) => updateSetting('largerClickTargets', checked)}
                    aria-label="Enable larger click targets"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    <Label className="text-sm">
                      <TranslatableText>Keyboard Navigation</TranslatableText>
                    </Label>
                  </div>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                    aria-label="Enable enhanced keyboard navigation"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">
                    <TranslatableText>Reduce Motion</TranslatableText>
                  </Label>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                    aria-label="Reduce animations and motion"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">
                    <TranslatableText>Focus Outlines</TranslatableText>
                  </Label>
                  <Switch
                    checked={settings.focusOutlines}
                    onCheckedChange={(checked) => updateSetting('focusOutlines', checked)}
                    aria-label="Show focus outlines"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}