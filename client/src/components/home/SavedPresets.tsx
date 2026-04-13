import React, { useState } from 'react';
import { Bookmark, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Settings } from '@/generator/types';

interface SavedPresetsProps {
  currentSettings: Settings;
  onLoadPreset: (settings: Settings) => void;
}

export const SavedPresets: React.FC<SavedPresetsProps> = ({ currentSettings, onLoadPreset }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  
  const getPresets = () => {
    try {
      return JSON.parse(localStorage.getItem('fgp-saved-presets') || '{}');
    } catch { return {}; }
  };
  
  const [presets, setPresets] = useState<Record<string, Settings>>(getPresets());

  const savePreset = () => {
    if (!name.trim()) return;
    const newPresets = { ...presets, [name.trim()]: currentSettings };
    localStorage.setItem('fgp-saved-presets', JSON.stringify(newPresets));
    setPresets(newPresets);
    setName('');
  };

  const deletePreset = (key: string) => {
    const newPresets = { ...presets };
    delete newPresets[key];
    localStorage.setItem('fgp-saved-presets', JSON.stringify(newPresets));
    setPresets(newPresets);
  };

  const loadPreset = (key: string) => {
    onLoadPreset(presets[key]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50 text-slate-700">
          <Bookmark className="w-4 h-4" />
          <span className="hidden sm:inline">Saved</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Saved Presets</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Name (e.g. My Bullet Journal)" 
              value={name} 
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && savePreset()}
            />
            <Button onClick={savePreset}><Save className="w-4 h-4 mr-2" /> Save</Button>
          </div>
          <div className="space-y-2 mt-4 max-h-[40vh] overflow-y-auto">
            {Object.keys(presets).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No saved presets yet.</p>
            ) : (
              Object.entries(presets).map(([key]) => (
                <div key={key} className="flex items-center justify-between p-2 border border-slate-200 rounded-md bg-white hover:border-primary/50 transition-colors">
                  <span className="font-medium text-sm text-slate-700 truncate mr-2">{key}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="secondary" onClick={() => loadPreset(key)}>Load</Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2" onClick={() => deletePreset(key)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
