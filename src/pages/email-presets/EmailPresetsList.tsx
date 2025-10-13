import React from 'react';
import type { EmailPreset } from '@/types/EmailPresets';

type EmailPresetsListProps = {
  presets: EmailPreset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const EmailPresetsList: React.FC<EmailPresetsListProps> = ({ presets, selectedId, onSelect }) => {
  return (
    <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full bg-background">
      {presets.map(preset => (
        <div
          key={preset.id}
          className={`rounded border border-gray-200 px-3 py-2 cursor-pointer hover:bg-accent ${selectedId === preset.id ? 'bg-accent border-gray-500' : ''}`}
          onClick={() => onSelect(preset.id)}
        >
          <div className="font-semibold text-base">{preset.name || <span className="italic text-muted-foreground">(fără nume)</span>}</div>
          <div className="text-xs text-muted-foreground">{preset.recipients.length} destinatari</div>
        </div>
      ))}
    </div>
  );
};

export default EmailPresetsList;
