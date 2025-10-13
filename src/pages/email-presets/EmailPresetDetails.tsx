import React from 'react';
import type { EmailPreset } from '@/types/EmailPresets';

type EmailPresetDetailsProps = {
  preset: EmailPreset | null;
  setPreset: (p: EmailPreset) => void;
  editMode: boolean;
};

const EmailPresetDetails: React.FC<EmailPresetDetailsProps> = ({ preset, setPreset, editMode }) => {
  if (!preset) return <div className="p-4 text-muted-foreground">Niciun preset selectat</div>;

  const handleChange = (field: keyof EmailPreset, value: any) => {
    setPreset({ ...preset, [field]: value });
  };

  const handleRecipientChange = (idx: number, value: string) => {
    const recipients = [...preset.recipients];
    recipients[idx] = value;
    setPreset({ ...preset, recipients });
  };
  const handleAddRecipient = () => setPreset({ ...preset, recipients: [...preset.recipients, ''] });
  const handleRemoveRecipient = (idx: number) => setPreset({ ...preset, recipients: preset.recipients.filter((_, i) => i !== idx) });

  const handleKeywordChange = (idx: number, value: string) => {
    const keywords = [...preset.keywords];
    keywords[idx] = value;
    setPreset({ ...preset, keywords });
  };
  const handleAddKeyword = () => setPreset({ ...preset, keywords: [...preset.keywords, ''] });
  const handleRemoveKeyword = (idx: number) => setPreset({ ...preset, keywords: preset.keywords.filter((_, i) => i !== idx) });

  return (
    <div className="flex flex-col gap-4 p-4 bg-background">
      <div>
        <label className="block text-sm font-medium mb-1">Nume preset</label>
        <input
          className="w-full px-2 py-1 border rounded bg-background"
          value={preset.name}
          onChange={e => handleChange('name', e.target.value)}
          disabled={!editMode}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Destinatari</label>
        <div className="flex flex-col gap-1">
          {preset.recipients.map((r, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="flex-1 px-2 py-1 border rounded bg-background"
                value={r}
                onChange={e => handleRecipientChange(idx, e.target.value)}
                disabled={!editMode}
              />
              {editMode && (
                <button className="text-red-500 px-2" onClick={() => handleRemoveRecipient(idx)} type="button">-</button>
              )}
            </div>
          ))}
          {editMode && (
            <button className="text-green-600 font-bold mt-1" onClick={handleAddRecipient} type="button">+ Adaugă destinatar</button>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Subiect</label>
        <input
          className="w-full px-2 py-1 border rounded bg-background"
          value={preset.subject}
          onChange={e => handleChange('subject', e.target.value)}
          disabled={!editMode}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mesaj</label>
        <textarea
          className="w-full px-2 py-1 border rounded bg-background min-h-[100px]"
          value={preset.message}
          onChange={e => handleChange('message', e.target.value)}
          disabled={!editMode}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Keyword-uri</label>
        <div className="flex flex-col gap-1">
          {preset.keywords.map((k, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="flex-1 px-2 py-1 border rounded bg-background"
                value={k}
                onChange={e => handleKeywordChange(idx, e.target.value)}
                disabled={!editMode}
              />
              {editMode && (
                <button className="text-red-500 px-2" onClick={() => handleRemoveKeyword(idx)} type="button">-</button>
              )}
            </div>
          ))}
          {editMode && (
            <button className="text-green-600 font-bold mt-1" onClick={handleAddKeyword} type="button">+ Adaugă keyword</button>
          )}
        </div>
      </div>

    </div>
  );
};

export default EmailPresetDetails;
